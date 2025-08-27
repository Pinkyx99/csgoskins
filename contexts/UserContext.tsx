import React, { createContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { User, Skin, SkinRarity } from '../types';
import { supabase } from '../lib/supabaseClient';
import { Session, AuthError, AuthResponse } from '@supabase/supabase-js';

interface UserContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    signInWithUsername: (credentials: {username: string, password: string}) => Promise<AuthResponse>;
    signUpWithUsername: (credentials: {username: string, password: string}) => Promise<AuthResponse>;
    signOut: () => Promise<{ error: AuthError | null; }>;
    updateBalance: (amount: number) => Promise<void>;
    addSkinsToInventory: (skins: Skin[], cost: number) => Promise<Skin[]>;
    processSoldWinnings: (winnings: Skin[], cost: number) => Promise<void>;
    removeSkinFromInventory: (instanceId: string) => Promise<void>;
    removeSkinsFromInventory: (instanceIds: string[]) => Promise<void>;
    processUpgrade: (instanceIdsToRemove: string[], balanceToSpend: number, skinToAdd: Skin | null) => Promise<void>;
    updateAvatar: (avatarUrl: string) => Promise<void>;
    transferBalance: (recipientUsername: string, amount: number) => Promise<{ error: any }>;
    checkUserStatus: () => Promise<void>;
    authModalOpen: boolean;
    setAuthModalOpen: (open: boolean) => void;
    processGameWager: (betAmount: number, winAmount: number) => Promise<{ success: boolean; error?: any }>;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

const userProfileSelect = '*, is_admin, is_banned, ban_expires_at, ban_reason, is_muted, mute_expires_at, mute_reason, best_win, total_wagered, total_won';

const parseInventory = (inventoryData: any): Skin[] => {
    if (Array.isArray(inventoryData)) {
        return inventoryData;
    }
    if (typeof inventoryData === 'string') {
        try {
            const parsed = JSON.parse(inventoryData);
            if (Array.isArray(parsed)) {
                return parsed;
            }
        } catch (e) {
            console.error("Failed to parse inventory string from DB:", e);
        }
    }
    // If it's null, undefined, or a non-array/non-string, return empty array.
    return [];
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [authModalOpen, setAuthModalOpen] = useState(false);

    const checkUserStatus = useCallback(async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
            setUser(null);
            return;
        }

        const { data: profile, error } = await supabase
            .from('profiles')
            .select(userProfileSelect)
            .eq('id', session.user.id)
            .single();

        if (error) {
            console.error("Error checking user status:", error.message || error);
            setUser(null);
        } else if (profile) {
             const rawInventory = parseInventory(profile.inventory);
             
             let needsDbUpdate = false;
             const validatedInventory = rawInventory.map((item: Skin) => {
                 if (!item.instance_id) {
                     needsDbUpdate = true;
                     return { ...item, instance_id: crypto.randomUUID() };
                 }
                 return item;
             });

             if (needsDbUpdate) {
                 const { error: updateError } = await supabase
                    .from('profiles')
                    .update({ inventory: validatedInventory })
                    .eq('id', profile.id);
                if (updateError) {
                    console.error("Error back-filling instance_ids:", updateError);
                }
             }

             setUser({
                id: profile.id,
                name: profile.username,
                avatar: profile.avatar_url || `https://api.dicebear.com/8.x/bottts/svg?seed=${profile.username}`,
                balance: Number(profile.balance),
                inventory: validatedInventory,
                is_admin: profile.is_admin,
                is_banned: profile.is_banned,
                ban_expires_at: profile.ban_expires_at,
                ban_reason: profile.ban_reason,
                is_muted: profile.is_muted,
                mute_expires_at: profile.mute_expires_at,
                mute_reason: profile.mute_reason,
                best_win: profile.best_win || null,
                total_wagered: profile.total_wagered || 0,
                total_won: profile.total_won || 0,
            });
        } else {
            setUser(null);
        }
    }, []);

    useEffect(() => {
        setLoading(true);
        checkUserStatus().finally(() => setLoading(false));

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            checkUserStatus();
        });

        return () => subscription.unsubscribe();
    }, [checkUserStatus]);

    const signInWithUsername = (credentials: {username: string, password: string}) => {
        const email = `${credentials.username.trim().toLowerCase()}@skskins.app`;
        return supabase.auth.signInWithPassword({ email, password: credentials.password });
    };

    const signUpWithUsername = (credentials: {username: string, password: string}) => {
        const username = credentials.username.trim();
        const email = `${username.toLowerCase()}@skskins.app`;
        return supabase.auth.signUp({
            email,
            password: credentials.password,
            options: {
                data: {
                    username: username,
                },
            },
        });
    };
    
    const signOut = () => {
        return supabase.auth.signOut();
    };

    const updateBalance = async (amount: number) => {
        if (!user) return;
        
        // Optimistic UI update
        setUser(prev => prev ? { ...prev, balance: prev.balance + amount } : null);

        // Read-modify-write to DB
        const { data: profile, error: fetchError } = await supabase
            .from('profiles')
            .select('balance')
            .eq('id', user.id)
            .single();

        if (fetchError) {
            console.error("Error fetching balance for update:", fetchError.message || fetchError);
            checkUserStatus();
            return;
        }

        const newBalance = Number(profile.balance) + amount;

        const { error: updateError } = await supabase
            .from('profiles')
            .update({ balance: newBalance })
            .eq('id', user.id);

        if (updateError) {
            console.error("Error updating balance:", updateError.message || updateError);
            checkUserStatus();
        } else {
            // Success, update local state with confirmed value
            setUser(prev => prev ? { ...prev, balance: newBalance } : null);
        }
    };
    
    const addSkinsToInventory = async (skins: Skin[], cost: number): Promise<Skin[]> => {
        if (!user || skins.length === 0) return [];
    
        const newSkinsWithIds = skins.map(s => ({ ...s, instance_id: crypto.randomUUID() }));
        const wonValue = skins.reduce((sum, skin) => sum + skin.price, 0);
        
        // Read-modify-write to DB
        const { data: profile, error: fetchError } = await supabase
            .from('profiles')
            .select('inventory, balance, total_wagered, total_won, best_win')
            .eq('id', user.id)
            .single();

        if (fetchError) {
            console.error("Error fetching profile for adding skins:", fetchError.message || fetchError);
            checkUserStatus();
            return [];
        }

        const currentInventory = parseInventory(profile.inventory);
        const newInventory = [...newSkinsWithIds, ...currentInventory];
        const newBalance = Number(profile.balance) - cost;
        const newTotalWagered = (Number(profile.total_wagered) || 0) + cost;
        const newTotalWon = (Number(profile.total_won) || 0) + wonValue;

        let newBestWin = profile.best_win as Skin | null;
        skins.forEach(skin => {
            if (!newBestWin || skin.price > newBestWin.price) {
                newBestWin = { ...skin, instance_id: undefined, wears: undefined };
            }
        });

        // Optimistic UI update
        setUser(prev => prev ? { ...prev, balance: newBalance, inventory: newInventory, total_wagered: newTotalWagered, total_won: newTotalWon, best_win: newBestWin } : null);

        const { error: updateError } = await supabase
            .from('profiles')
            .update({ inventory: newInventory, balance: newBalance, total_wagered: newTotalWagered, total_won: newTotalWon, best_win: newBestWin })
            .eq('id', user.id);
    
        if (updateError) {
            console.error("Error adding skins and updating stats:", updateError.message || updateError);
            checkUserStatus();
            return [];
        }
        
        return newSkinsWithIds;
    };

    const processSoldWinnings = async (winnings: Skin[], cost: number) => {
        if (!user) return;
        
        const wonValue = winnings.reduce((sum, skin) => sum + skin.price, 0);

        const { data: profile, error: fetchError } = await supabase
            .from('profiles')
            .select('balance, total_wagered, total_won, best_win')
            .eq('id', user.id)
            .single();

        if (fetchError) {
            console.error("Error fetching profile for selling winnings:", fetchError.message || fetchError);
            checkUserStatus();
            return;
        }

        const newBalance = (Number(profile.balance) || 0) - cost + wonValue;
        const newTotalWagered = (Number(profile.total_wagered) || 0) + cost;
        const newTotalWon = (Number(profile.total_won) || 0) + wonValue;
        
        let newBestWin = profile.best_win as Skin | null;
        winnings.forEach(skin => {
            if (!newBestWin || skin.price > newBestWin.price) {
                newBestWin = { ...skin, instance_id: undefined, wears: undefined };
            }
        });

        // Optimistic UI update
        setUser(prev => prev ? { ...prev, balance: newBalance, total_wagered: newTotalWagered, total_won: newTotalWon, best_win: newBestWin } : null);

        const { error: updateError } = await supabase
            .from('profiles')
            .update({ balance: newBalance, total_wagered: newTotalWagered, total_won: newTotalWon, best_win: newBestWin })
            .eq('id', user.id);
    
        if (updateError) {
            console.error("Error updating stats after selling:", updateError.message || updateError);
            checkUserStatus();
        }
    };

    const removeSkinFromInventory = async (instanceId: string) => {
        if (!user) return;
        
        const newInventory = user.inventory.filter(s => s.instance_id !== instanceId);
        setUser(prev => prev ? { ...prev, inventory: newInventory } : null);

        const { error } = await supabase
            .from('profiles')
            .update({ inventory: newInventory })
            .eq('id', user.id);
            
        if (error) {
            console.error('Error removing skin from inventory:', error);
            checkUserStatus();
        }
    };

    const removeSkinsFromInventory = async (instanceIds: string[]) => {
        if (!user) return;
        if (instanceIds.length === 0) return;

        const newInventory = user.inventory.filter(s => !instanceIds.includes(s.instance_id!));
        setUser(prev => prev ? { ...prev, inventory: newInventory } : null);

        const { error } = await supabase
            .from('profiles')
            .update({ inventory: newInventory })
            .eq('id', user.id);

        if (error) {
            console.error('Error removing skins from inventory:', error);
            checkUserStatus();
        }
    };

    const processUpgrade = async (instanceIdsToRemove: string[], balanceToSpend: number, skinToAdd: Skin | null) => {
        if (!user) return;

        const { data: profile, error: fetchError } = await supabase
            .from('profiles')
            .select('inventory, balance, total_wagered, total_won, best_win')
            .eq('id', user.id)
            .single();

        if (fetchError) {
            console.error("Error fetching profile for upgrade:", fetchError.message || fetchError);
            checkUserStatus(); // Re-sync with DB
            return;
        }

        const currentInventory = parseInventory(profile.inventory);
        const skinsToRemove = currentInventory.filter(s => instanceIdsToRemove.includes(s.instance_id!));
        const valueOfSkinsToRemove = skinsToRemove.reduce((sum, skin) => sum + skin.price, 0);
        
        const wagerAmount = valueOfSkinsToRemove + balanceToSpend;

        let newInventory = currentInventory.filter(s => !instanceIdsToRemove.includes(s.instance_id!));
        let winAmount = 0;
        let newBestWin = profile.best_win as Skin | null;

        if (skinToAdd) { // It's a win
            const newSkinWithId = { ...skinToAdd, instance_id: crypto.randomUUID(), wears: undefined }; // remove wears from inventory items
            newInventory.unshift(newSkinWithId); // add to front
            winAmount = skinToAdd.price;
            if (!newBestWin || skinToAdd.price > newBestWin.price) {
                newBestWin = { ...skinToAdd, instance_id: undefined, wears: undefined };
            }
        }

        const newBalance = Number(profile.balance) - balanceToSpend;
        const newTotalWagered = (Number(profile.total_wagered) || 0) + wagerAmount;
        const newTotalWon = (Number(profile.total_won) || 0) + winAmount;
        
        setUser(prev => prev ? {
            ...prev,
            inventory: newInventory,
            balance: newBalance,
            total_wagered: newTotalWagered,
            total_won: newTotalWon,
            best_win: newBestWin,
        } : null);

        const { error: updateError } = await supabase
            .from('profiles')
            .update({
                inventory: newInventory,
                balance: newBalance,
                total_wagered: newTotalWagered,
                total_won: newTotalWon,
                best_win: newBestWin,
            })
            .eq('id', user.id);
        
        if (updateError) {
            console.error("Error processing upgrade:", updateError.message || updateError);
            checkUserStatus(); // Re-sync
        }
    };

    const updateAvatar = async (avatarUrl: string) => {
        if (!user) return;
        
        setUser(prev => prev ? { ...prev, avatar: avatarUrl } : null);

        const { error } = await supabase
            .from('profiles')
            .update({ avatar_url: avatarUrl })
            .eq('id', user.id);
        
        if (error) {
            console.error("Error updating avatar:", error);
            checkUserStatus();
        }
    };
    
    const transferBalance = async (recipientUsername: string, amount: number) => {
        if (!user || user.name === recipientUsername) {
            return { error: { message: 'Cannot transfer to yourself.' } };
        }
        
        // Use an RPC call for atomic transaction
        const { error } = await supabase.rpc('transfer_balance', {
            p_recipient_username: recipientUsername,
            p_transfer_amount: amount,
        });

        if (error) {
            console.error("Error transferring balance:", error);
            checkUserStatus();
            return { error };
        }
        
        checkUserStatus();
        return { error: null };
    };

    const processGameWager = async (betAmount: number, winAmount: number): Promise<{ success: boolean; error?: any }> => {
        if (!user) return { success: false, error: 'User not logged in' };
        
        const { data: profile, error: fetchError } = await supabase
            .from('profiles')
            .select('balance, total_wagered, total_won')
            .eq('id', user.id)
            .single();

        if (fetchError) {
            console.error("Error fetching profile for game wager:", fetchError.message || fetchError);
            checkUserStatus();
            return { success: false, error: fetchError };
        }

        const newBalance = Number(profile.balance) + winAmount;
        const newTotalWagered = (Number(profile.total_wagered) || 0) + betAmount;
        const newTotalWon = (Number(profile.total_won) || 0) + winAmount;
        
        setUser(prev => prev ? { ...prev, balance: newBalance, total_wagered: newTotalWagered, total_won: newTotalWon } : null);
        
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ balance: newBalance, total_wagered: newTotalWagered, total_won: newTotalWon })
            .eq('id', user.id);
            
        if (updateError) {
            console.error("Error processing game wager:", updateError.message || updateError);
            checkUserStatus();
            return { success: false, error: updateError };
        }
        
        return { success: true };
    };

    const value = {
        user,
        session,
        loading,
        signInWithUsername,
        signUpWithUsername,
        signOut,
        updateBalance,
        addSkinsToInventory,
        processSoldWinnings,
        removeSkinFromInventory,
        removeSkinsFromInventory,
        processUpgrade,
        updateAvatar,
        transferBalance,
        checkUserStatus,
        authModalOpen,
        setAuthModalOpen,
        processGameWager,
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
