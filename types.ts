

export enum SkinRarity {
    Consumer = 'Consumer Grade',
    Industrial = 'Industrial Grade',
    MilSpec = 'Mil-Spec',
    Restricted = 'Restricted',
    Classified = 'Classified',
    Covert = 'Covert',
    Gold = 'Exceedingly Rare',
}

export interface SkinWear {
    name: string; // e.g., 'FN', 'MW', 'FT'
    price: number;
    chance: number;
}

export interface Skin {
    id: string;
    instance_id?: string; // Unique identifier for an instance of a skin in an inventory
    name: string;
    rarity: SkinRarity;
    image: string;
    price: number;
    chance: number; // For grouped skins, this is the total chance
    wears?: SkinWear[];
}

export interface Case {
    id: string;
    name: string;
    price: number;
    image: string;
    items: Skin[];
    isNew?: boolean;
    category?: string;
}

export interface Winning {
    id: number;
    userName: string;
    skin: Skin;
    caseName: string;
    time: string;
}

export interface User {
    id: string;
    name: string;
    avatar: string;
    balance: number;
    inventory: Skin[];
    is_admin: boolean;
    is_banned: boolean;
    ban_expires_at: string | null;
    ban_reason: string | null;
    is_muted: boolean;
    mute_expires_at: string | null;
    mute_reason: string | null;
    best_win: Skin | null;
    total_wagered: number;
    total_won: number;
}

export interface ChatMessage {
  id: number;
  created_at: string;
  content: string;
  user_id: string;
  username: string;
  avatar_url?: string;
}

export interface PublicProfile {
    id: string;
    username: string;
    avatar_url: string;
}

export interface FullPublicProfile extends PublicProfile {
    best_win: Skin | null;
    total_wagered: number;
    total_won: number;
    inventory?: Skin[];
}

export interface Transaction {
    id: number;
    created_at: string;
    sender_id: string;
    recipient_id: string;
    sender_username: string;
    recipient_username: string;
    amount: number;
}

export interface AnnouncementEventData {
    message: string;
}

export interface RainEventData {
    amount_per_user: number;
    max_claims: number;
}

export interface SiteEvent {
    id: string;
    created_at: string;
    event_type: 'RAIN' | 'ANNOUNCEMENT' | 'CHAT_CLEARED';
    created_by_username: string;
    data: RainEventData | AnnouncementEventData | null;
    expires_at: string | null;
}

// --- Case Battle Types ---

export interface CaseBattleParticipant {
    id: string; // user_id or a generated bot id
    username: string;
    avatar_url: string;
    is_bot: boolean;
    total_value: number;
    winnings: { [round: number]: Skin }; // key is the round index
}

export interface CaseBattle {
    id: string;
    created_at: string;
    created_by_user_id: string;
    created_by_username: string;
    cases: Case[];
    max_players: number;
    status: 'waiting' | 'starting' | 'in_progress' | 'finished';
    winner_id?: string;
    participants: CaseBattleParticipant[];
    total_value: number;
    current_case_index: number;
    current_round_winnings?: { [participantId: string]: Skin };
}

// --- Spinner Types ---
export interface Reel {
    key: number | string;
    fullItems: Skin[];
    winner: Skin | null;
    winnerIndex?: number;
    isFinished: boolean;
    isPlaceholder?: boolean;
}

// --- Trade Types ---
export type TradeOfferStatus = 'pending' | 'accepted' | 'declined' | 'cancelled';

export interface TradeOffer {
    id: string;
    created_at: string;
    sender_id: string;
    recipient_id: string;
    sender_items: string[]; // instance_ids
    recipient_items: string[]; // instance_ids
    status: TradeOfferStatus;
    expires_at: string;
    // For display, populated client-side
    sender_username?: string;
    sender_avatar_url?: string;
    recipient_username?: string;
    recipient_avatar_url?: string;
    sender_skins?: Skin[];
    recipient_skins?: Skin[];
}