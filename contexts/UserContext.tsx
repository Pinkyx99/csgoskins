import React, { createContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { User, Skin } from '../types';
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
    addSkinToInventory: (skin: Skin) => Promise<Skin | null>;
    addSkinsToInventory: (skins: Skin[]) => Promise<Skin[]>;
    removeSkinFromInventory: (instanceId: string) => Promise<void>;
    removeSkinsFromInventory: (instanceIds: string[]) => Promise<void>;
    swapSkinsInInventory: (instanceIdsToRemove: string[], skinToAdd: Skin) => Promise<void>;
    updateAvatar: (avatarUrl: string) => Promise<void>;
    transferBalance: (recipientUsername: string, amount: number) => Promise<{ error: any }>;
    checkUserStatus: () => Promise<void>;
    authModalOpen: boolean;
    setAuthModalOpen: (open: boolean) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

const userProfileSelect = '*, is_admin, is_banned, ban_expires_at, ban_reason, is_muted, mute_expires_at, mute_reason';

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
            console.error("Error checking user status:", error);
            setUser(null);
        } else if (profile) {
             setUser({
                id: profile.id,
                name: profile.username,
                avatar: profile.avatar_url || `https://api.dicebear.com/8.x/bottts/svg?seed=${profile.username}`,
                balance: Number(profile.balance),
                inventory: parseInventory(profile.inventory),
                is_admin: profile.is_admin,
                is_banned: profile.is_banned,
                ban_expires_at: profile.ban_expires_at,
                ban_reason: profile.ban_reason,
                is_muted: profile.is_muted,
                mute_expires_at: profile.mute_expires_at,
                mute_reason: profile.mute_reason,
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
        const email = `${credentials.username.trim().toLowerCase()}@csgoskins.app`;
        return supabase.auth.signInWithPassword({ email, password: credentials.password });
    };

    const signUpWithUsername = (credentials: {username: string, password: string}) => {
        const username = credentials.username.trim();
        const email = `${username.toLowerCase()}@csgoskins.app`;
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
    
    const addSkinsToInventory = async (skins: Skin[]): Promise<Skin[]> => {
        if (!user || skins.length === 0) return [];
    
        const newSkinsWithIds = skins.map(s => ({ ...s, instance_id: `${s.id}-${Date.now()}-${Math.random()}` }));
        
        // Optimistic UI update
        setUser(prev => {
            if (!prev) return null;
            const existingInventory = parseInventory(prev.inventory);
            return { ...prev, inventory: [...newSkinsWithIds, ...existingInventory] };
        });
        
        // Read-modify-write to DB
        const { data: profile, error: fetchError } = await supabase
            .from('profiles')
            .select('inventory')
            .eq('id', user.id)
            .single();

        if (fetchError) {
            console.error("Error fetching inventory for adding skins:", fetchError.message || fetchError);
            checkUserStatus();
            return [];
        }

        const currentInventory = parseInventory(profile.inventory);
        const newInventory = [...newSkinsWithIds, ...currentInventory];

        const { error: updateError } = await supabase
            .from('profiles')
            .update({ inventory: newInventory })
            .eq('id', user.id);
    
        if (updateError) {
            console.error("Error adding skins:", updateError.message || updateError);
            checkUserStatus();
            return [];
        }
        
        // Success, update local state with confirmed value
        setUser(prev => prev ? { ...prev, inventory: newInventory } : null);
        return newSkinsWithIds;
    };

    const addSkinToInventory = async (skin: Skin): Promise<Skin | null> => {
        const result = await addSkinsToInventory([skin]);
        return result.length > 0 ? result[0] : null;
    };
    
     const removeSkinsFromInventory = async (instanceIds: string[]) => {
        if (!user || instanceIds.length === 0) return;

        // Optimistic UI update
        setUser(prev => {
            if (!prev) return null;
            const existingInventory = parseInventory(prev.inventory);
            const newInventory = existingInventory.filter(s => s.instance_id && !instanceIds.includes(s.instance_id));
            return { ...prev, inventory: newInventory };
        });

        // Read-modify-write to DB
        const { data: profile, error: fetchError } = await supabase
            .from('profiles')
            .select('inventory')
            .eq('id', user.id)
            .single();
        
        if (fetchError) {
            console.error("Error fetching inventory for removing skins:", fetchError.message || fetchError);
            checkUserStatus();
            return;
        }

        const currentInventory = parseInventory(profile.inventory);
        const newInventory = currentInventory.filter((s: Skin) => s.instance_id && !instanceIds.includes(s.instance_id));

        const { error: updateError } = await supabase
            .from('profiles')
            .update({ inventory: newInventory })
            .eq('id', user.id);

        if (updateError) {
            console.error("Error removing skins:", updateError.message || updateError);
            checkUserStatus();
        } else {
            // Success, update local state with confirmed value
            setUser(prev => prev ? { ...prev, inventory: newInventory } : null);
        }
    };

    const removeSkinFromInventory = async (instanceId: string) => {
        return removeSkinsFromInventory([instanceId]);
    };

    const swapSkinsInInventory = async (instanceIdsToRemove: string[], skinToAdd: Skin) => {
        if (!user) return;

        const newSkinWithId = { ...skinToAdd, instance_id: `${skinToAdd.id}-${Date.now()}-${Math.random()}` };

        // Optimistic UI update
        setUser(prev => {
            if (!prev) return null;
            const existingInventory = parseInventory(prev.inventory);
            const inventoryAfterRemoval = existingInventory.filter(s => s.instance_id && !instanceIdsToRemove.includes(s.instance_id));
            const newInventory = [newSkinWithId, ...inventoryAfterRemoval];
            return { ...prev, inventory: newInventory };
        });

        // Read-modify-write to DB
        const { data: profile, error: fetchError } = await supabase
            .from('profiles')
            .select('inventory')
            .eq('id', user.id)
            .single();
        
        if (fetchError) {
            console.error("Error fetching inventory for swapping skins:", fetchError.message || fetchError);
            checkUserStatus();
            return;
        }

        const currentInventory = parseInventory(profile.inventory);
        const inventoryAfterRemoval = currentInventory.filter((s: Skin) => s.instance_id && !instanceIdsToRemove.includes(s.instance_id));
        const newInventory = [newSkinWithId, ...inventoryAfterRemoval];

        const { error: updateError } = await supabase
            .from('profiles')
            .update({ inventory: newInventory })
            .eq('id', user.id);

        if (updateError) {
            console.error("Error swapping skins:", updateError.message || updateError);
            checkUserStatus(); // Re-sync with DB on failure
        } else {
            // Success, confirm the state update.
            setUser(prev => prev ? { ...prev, inventory: newInventory } : null);
        }
    };

    const updateAvatar = async (avatarUrl: string) => {
        if (!user) return;
        const oldAvatar = user.avatar;
        setUser({ ...user, avatar: avatarUrl });
        const { error } = await supabase.from('profiles').update({ avatar_url: avatarUrl }).eq('id', user.id);
        if (error) {
            console.error("Error updating avatar:", error.message || error);
            setUser({ ...user, avatar: oldAvatar });
        }
    };

    const transferBalance = async (recipientUsername: string, amount: number) => {
        if (!user || user.balance < amount || amount <= 0) {
            return { error: { message: "Invalid amount or insufficient balance." } };
        }

        const { error } = await supabase.rpc('transfer_balance', {
            recipient_username_arg: recipientUsername,
            amount_arg: amount
        });

        if (!error) {
            // The RPC function handles the deduction, so we just need to update local state
            await checkUserStatus();
        }

        return { error };
    };

    const value = {
        user,
        session,
        loading,
        signInWithUsername,
        signUpWithUsername,
        signOut,
        updateBalance,
        addSkinToInventory,
        addSkinsToInventory,
        removeSkinFromInventory,
        removeSkinsFromInventory,
        swapSkinsInInventory,
        updateAvatar,
        transferBalance,
        checkUserStatus,
        authModalOpen,
        setAuthModalOpen,
    };

    return (
        <UserContext.Provider value={value}>
            {loading ? (
                <div className="fixed inset-0 flex items-center justify-center bg-[#0d1a2f] z-[200]">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                children
            )}
        </UserContext.Provider>
    );
};