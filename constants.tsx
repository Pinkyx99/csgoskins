

import React from 'react';
import { Link } from 'react-router-dom';
import { Case, Skin, SkinRarity, Winning } from './types';
import { FAVOR_BOX_CASE_ITEMS } from './data/cases/favorBoxCase';
import { BIRTHDAY_CAKE_CASE_ITEMS } from './data/cases/birthdayCakeCase';
import { SURPRISE_PARTY_CASE_ITEMS } from './data/cases/surprisePartyCase';
import { DAILY_CASE_ITEMS } from './data/cases/dailyCase';
import { INDIRECT_CASE_ITEMS } from './data/cases/indirectCase';
import { LOW_CASE_ITEMS } from './data/cases/lowCase';
import { MEDIUM_CASE_ITEMS } from './data/cases/mediumCase';
import { ULTRA_CASE_ITEMS } from './data/cases/ultraCase';
import { AMMO_CASE_ITEMS } from './data/cases/ammoCase';
import { RUST_CASE_ITEMS } from './data/cases/rustCase';
import { C4_CASE_ITEMS } from './data/cases/c4Case';
import { CHOCOLATE_CASE_ITEMS } from './data/cases/chocolateCase';
import { EMBER_CASE_ITEMS } from './data/cases/emberCase';
import { NEON_CASE_ITEMS } from './data/cases/neonCase';
import { PLAGUE_CASE_ITEMS } from './data/cases/plagueCase';
import { TOOLBOX_CASE_ITEMS } from './data/cases/toolboxCase';
import { WASTELAND_CASE_ITEMS } from './data/cases/wastelandCase';
import { LOVELY_CASE_ITEMS } from './data/cases/lovelyCase';
import { STEAMPUNK_CASE_ITEMS } from './data/cases/steampunkCase';
import { GIGA_BULA_CASE_ITEMS } from './data/cases/gigaBulaCase';
import { SLIME_CASE_ITEMS } from './data/cases/slimeCase';
import { STRIKING_NINJA_CASE_ITEMS } from './data/cases/strikingNinjaCase';
import { DUCK_CASE_ITEMS } from './data/cases/duckCase';
import { SUMMER_CASE_ITEMS } from './data/cases/summerCase';
import { CURSED_CASE_ITEMS } from './data/cases/cursedCase';
import { RUTHLESS_CASE_ITEMS } from './data/cases/ruthlessCase';
import { SALOON_CASE_ITEMS } from './data/cases/saloonCase';
import { WATER_CASE_ITEMS } from './data/cases/waterCase';
import { DANGER_CASE_ITEMS } from './data/cases/dangerCase';
import { G2A_CASE_ITEMS } from './data/cases/g2aCase';
import { CYBER_CASE_ITEMS } from './data/cases/cyberCase';
import { ELEGANT_CASE_ITEMS } from './data/cases/elegantCase';
import { SUNKEN_CASE_ITEMS } from './data/cases/sunkenCase';
import { DEATH_CASE_ITEMS } from './data/cases/deathCase';
import { FROSTBITE_CASE_ITEMS } from './data/cases/frostbiteCase';
import { BEAST_CASE_ITEMS } from './data/cases/beastCase';
import { LUNAR_CASE_ITEMS } from './data/cases/lunarCase';
import { VAPORWAVE_CASE_ITEMS } from './data/cases/vaporwaveCase';
import { ANARCHY_CASE_ITEMS } from './data/cases/anarchyCase';
import { RADIATION_CASE_ITEMS } from './data/cases/radiationCase';
import { LUXURIOUS_CASE_ITEMS } from './data/cases/luxuriousCase';
import { ROYAL_CASE_ITEMS } from './data/cases/royalCase';
import { HOWL_CASE_ITEMS } from './data/cases/howlCase';
import { AMETHYST_CASE_ITEMS } from './data/cases/amethystCase';
import { SCARLET_CASE_ITEMS } from './data/cases/scarletCase';
import { PORCELAIN_CASE_ITEMS } from './data/cases/porcelainCase';
import { GEMSTONE_CASE_ITEMS } from './data/cases/gemstoneCase';
import { PINATA_CASE_ITEMS } from './data/cases/pinataCase';
import { GOLDEN_ERA_CASE_ITEMS } from './data/cases/goldenEraCase';
import { COLORFUL_STICKER_CASE_ITEMS } from './data/cases/colorfulStickerCase';
import { ANIME_STICKER_CASE_ITEMS } from './data/cases/animeStickerCase';
import { GOLD_STICKER_CASE_ITEMS } from './data/cases/goldStickerCase';
import { HOWLING_DAWN_STICKER_CASE_ITEMS } from './data/cases/howlingDawnStickerCase';
import { ALL_STAR_STICKER_CASE_ITEMS } from './data/cases/allStarStickerCase';

export const rarityStyles: { [key in SkinRarity]: { text: string; border: string; bg: string; shadow: string; } } = {
    [SkinRarity.Consumer]: { text: 'text-gray-400', border: 'border-gray-400', bg: 'bg-gray-400', shadow: 'shadow-gray-400/50' },
    [SkinRarity.Industrial]: { text: 'text-sky-300', border: 'border-sky-300', bg: 'bg-sky-300', shadow: 'shadow-sky-300/50' },
    [SkinRarity.MilSpec]: { text: 'text-blue-500', border: 'border-blue-500', bg: 'bg-blue-500', shadow: 'shadow-blue-500/50' },
    [SkinRarity.Restricted]: { text: 'text-purple-500', border: 'border-purple-500', bg: 'bg-purple-500', shadow: 'shadow-purple-500/50' },
    [SkinRarity.Classified]: { text: 'text-pink-500', border: 'border-pink-500', bg: 'bg-pink-500', shadow: 'shadow-pink-500/50' },
    [SkinRarity.Covert]: { text: 'text-red-500', border: 'border-red-500', bg: 'bg-red-500', shadow: 'shadow-red-500/50' },
    [SkinRarity.Gold]: { text: 'text-yellow-400', border: 'border-yellow-400', bg: 'bg-yellow-400', shadow: 'shadow-yellow-400/50' },
};

export const MOCK_CASES: Case[] = [
    { id: 'c1', name: 'Favor Box Case', price: 1.00, image: 'https://media.csgo-skins.com/container/event-10-year-1.png?v3', items: FAVOR_BOX_CASE_ITEMS, category: 'anniversary' },
    { id: 'c2', name: 'Surprise Party Case', price: 2.50, image: 'https://media.csgo-skins.com/container/event-10-year-2.png?v3', items: SURPRISE_PARTY_CASE_ITEMS, category: 'anniversary' },
    { id: 'c3', name: 'Birthday Cake Case', price: 5.00, image: 'https://media.csgo-skins.com/container/event-10-year-3.png?v3', items: BIRTHDAY_CAKE_CASE_ITEMS, category: 'anniversary' },
    { id: 'c49', name: 'Piñata Case', price: 20.00, image: 'https://media.csgo-skins.com/container/event-10-year-4.png?v3', items: PINATA_CASE_ITEMS, category: 'anniversary' },
    { id: 'c50', name: 'Golden Era Case', price: 50.00, image: 'https://media.csgo-skins.com/container/event-10-year-5.png?v3', items: GOLDEN_ERA_CASE_ITEMS, category: 'anniversary' },

    { id: 'c51', name: 'Colorful Case', price: 0.50, image: 'https://media.csgo-skins.com/container/colorful-sticker-case.png', items: COLORFUL_STICKER_CASE_ITEMS, category: 'sticker' },
    { id: 'c52', name: 'Anime Case', price: 0.50, image: 'https://media.csgo-skins.com/container/anime-sticker-case.png', items: ANIME_STICKER_CASE_ITEMS, category: 'sticker' },
    { id: 'c53', name: 'Gold Case', price: 2.50, image: 'https://media.csgo-skins.com/container/gold-sticker-case.png', items: GOLD_STICKER_CASE_ITEMS, category: 'sticker' },
    { id: 'c54', name: 'Howling Dawn Case', price: 4.00, image: 'https://media.csgo-skins.com/container/howl-sticker-case.png', items: HOWLING_DAWN_STICKER_CASE_ITEMS, category: 'sticker' },
    { id: 'c55', name: 'All-Star Case', price: 10.00, image: 'https://media.csgo-skins.com/container/all-stars-sticker-case.png', items: ALL_STAR_STICKER_CASE_ITEMS, category: 'sticker' },

    { id: 'c4', name: 'Daily Case', price: 0.00, image: 'https://media.csgo-skins.com/container/daily-case.png', items: DAILY_CASE_ITEMS, category: 'regular' },
    { id: 'c5', name: 'Low Case', price: 0.30, image: 'https://media.csgo-skins.com/container/low-case.png', items: LOW_CASE_ITEMS, category: 'regular' },
    { id: 'c6', name: 'Indirect Case', price: 0.50, image: 'https://media.csgo-skins.com/container/indirect-case.png', items: INDIRECT_CASE_ITEMS, category: 'regular' },
    { id: 'c7', name: 'Medium Case', price: 0.75, image: 'https://media.csgo-skins.com/container/medium-case.png', items: MEDIUM_CASE_ITEMS, category: 'regular' },
    { id: 'c8', name: 'Ultra Case', price: 1.00, image: 'https://media.csgo-skins.com/container/ultra-case.png', items: ULTRA_CASE_ITEMS, category: 'regular' },
    { id: 'c9', name: 'Ammo Case', price: 1.05, image: 'https://media.csgo-skins.com/container/ammo-case.png', items: AMMO_CASE_ITEMS, category: 'regular' },
    { id: 'c10', name: 'Rust Case', price: 1.10, image: 'https://media.csgo-skins.com/container/rust-case.png', items: RUST_CASE_ITEMS, category: 'regular' },
    { id: 'c11', name: 'C4 Case', price: 1.20, image: 'https://media.csgo-skins.com/container/final-countdown.png?v1', items: C4_CASE_ITEMS, category: 'regular' },
    { id: 'c12', name: 'Chocolate Case', price: 1.40, image: 'https://media.csgo-skins.com/container/114.png?v1', items: CHOCOLATE_CASE_ITEMS, category: 'regular' },
    { id: 'c13', name: 'Ember Case', price: 1.50, image: 'https://media.csgo-skins.com/container/ember-case.png', items: EMBER_CASE_ITEMS, category: 'regular' },
    { id: 'c14', name: 'Neon Case', price: 2.00, image: 'https://media.csgo-skins.com/container/neon-case.png', items: NEON_CASE_ITEMS, category: 'regular' },
    { id: 'c15', name: 'Plague Case', price: 2.00, image: 'https://media.csgo-skins.com/container/plague-case.png', items: PLAGUE_CASE_ITEMS, category: 'regular' },
    { id: 'c16', name: 'Toolbox Case', price: 2.00, image: 'https://media.csgo-skins.com/container/toolbox-case.png?v2', items: TOOLBOX_CASE_ITEMS, category: 'regular' },
    { id: 'c17', name: 'Wasteland Case', price: 2.50, image: 'https://media.csgo-skins.com/container/wasteland-case.png', items: WASTELAND_CASE_ITEMS, isNew: true, category: 'regular' },
    { id: 'c18', name: 'Lovely Case', price: 3.00, image: 'https://media.csgo-skins.com/container/24.png?v1', items: LOVELY_CASE_ITEMS, category: 'regular' },
    { id: 'c19', name: 'Steampunk Case', price: 3.00, image: 'https://media.csgo-skins.com/container/steampunk-case.png?v2', items: STEAMPUNK_CASE_ITEMS, category: 'regular' },
    { id: 'c20', name: 'GigaBuła Case', price: 4.00, image: 'https://media.csgo-skins.com/container/giga-bula-case.png', items: GIGA_BULA_CASE_ITEMS, category: 'regular' },
    { id: 'c21', name: 'Slime Case', price: 4.00, image: 'https://media.csgo-skins.com/container/slime-case.png', items: SLIME_CASE_ITEMS, category: 'regular' },
    { id: 'c22', name: 'Striking Ninja Case', price: 4.00, image: 'https://media.csgo-skins.com/container/striking-ninja-case.png', items: STRIKING_NINJA_CASE_ITEMS, category: 'regular' },
    { id: 'c23', name: 'Ninja Case', price: 4.50, image: 'https://media.csgo-skins.com/container/ninja-case.png', items: SURPRISE_PARTY_CASE_ITEMS, category: 'regular' },
    { id: 'c24', name: 'Duck Case', price: 5.00, image: 'https://media.csgo-skins.com/container/duck-case.png', items: DUCK_CASE_ITEMS, category: 'regular' },
    { id: 'c25', name: 'Summer Case', price: 5.00, image: 'https://media.csgo-skins.com/container/summer-case.png', items: SUMMER_CASE_ITEMS, category: 'regular' },
    { id: 'c26', name: 'Cursed Case', price: 5.50, image: 'https://media.csgo-skins.com/container/purple-plague-case.png', items: CURSED_CASE_ITEMS, category: 'regular' },
    { id: 'c27', name: 'Ruthless Case', price: 6.50, image: 'https://media.csgo-skins.com/container/ruthless-case.png', items: RUTHLESS_CASE_ITEMS, category: 'regular' },
    { id: 'c28', name: 'Saloon Case', price: 7.00, image: 'https://media.csgo-skins.com/container/saloon-case.png', items: SALOON_CASE_ITEMS, category: 'regular' },
    { id: 'c29', name: 'Water Case', price: 7.50, image: 'https://media.csgo-skins.com/container/water-case.png', items: WATER_CASE_ITEMS, category: 'regular' },
    { id: 'c30', name: 'Danger Case', price: 8.00, image: 'https://media.csgo-skins.com/container/danger-case.png', items: DANGER_CASE_ITEMS, category: 'regular' },
    { id: 'c31', name: 'G2a Case', price: 10.00, image: 'https://media.csgo-skins.com/container/g2a-case.png', items: G2A_CASE_ITEMS, category: 'regular' },
    { id: 'c32', name: 'Cyber Case', price: 12.00, image: 'https://media.csgo-skins.com/container/cyber-scifi-case.png', items: CYBER_CASE_ITEMS, category: 'regular' },
    { id: 'c33', name: 'Elegant Case', price: 15.00, image: 'https://media.csgo-skins.com/container/elegant-case.png', items: ELEGANT_CASE_ITEMS, category: 'regular' },
    { id: 'c34', name: 'Sunken Case', price: 16.00, image: 'https://media.csgo-skins.com/container/sunken-case.png', items: SUNKEN_CASE_ITEMS, category: 'regular' },
    { id: 'c35', name: 'Death Case', price: 21.00, image: 'https://media.csgo-skins.com/container/death-case.png', items: DEATH_CASE_ITEMS, category: 'regular' },
    { id: 'c36', name: 'Frostbite Case', price: 25.00, image: 'https://media.csgo-skins.com/container/frostbite-case.png', items: FROSTBITE_CASE_ITEMS, category: 'regular' },
    { id: 'c37', name: 'Beast Case', price: 30.00, image: 'https://media.csgo-skins.com/container/beast-case.png', items: BEAST_CASE_ITEMS, category: 'regular' },
    { id: 'c38', name: 'Lunar Case', price: 35.00, image: 'https://media.csgo-skins.com/container/chinese-snake.png', items: LUNAR_CASE_ITEMS, category: 'regular' },
    { id: 'c39', name: 'Vaporwave Case', price: 40.00, image: 'https://media.csgo-skins.com/container/vaporwave.png', items: VAPORWAVE_CASE_ITEMS, category: 'regular' },
    { id: 'c40', name: 'Anarchy Case', price: 50.00, image: 'https://media.csgo-skins.com/container/anarchy-case.png', items: ANARCHY_CASE_ITEMS, category: 'regular' },
    { id: 'c41', name: 'Radiation Case', price: 72.00, image: 'https://media.csgo-skins.com/container/toxic-case.png', items: RADIATION_CASE_ITEMS, category: 'regular' },
    { id: 'c42', name: 'Luxurious Case', price: 100.00, image: 'https://media.csgo-skins.com/container/luxurious-case.png', items: LUXURIOUS_CASE_ITEMS, category: 'regular' },
    { id: 'c43', name: 'Royal Case', price: 150.00, image: 'https://media.csgo-skins.com/container/royal-case.png', items: ROYAL_CASE_ITEMS, category: 'regular' },
    { id: 'c44', name: 'Howl Case', price: 175.00, image: 'https://media.csgo-skins.com/container/howl-case.png', items: HOWL_CASE_ITEMS, category: 'regular' },
    { id: 'c45', name: 'Amethyst Case', price: 200.00, image: 'https://media.csgo-skins.com/container/amethyst-case.png?v2', items: AMETHYST_CASE_ITEMS, category: 'regular' },
    { id: 'c46', name: 'Scarlet Case', price: 250.00, image: 'https://media.csgo-skins.com/container/scarlet-case.png', items: SCARLET_CASE_ITEMS, category: 'regular' },
    { id: 'c47', name: 'Porcelain Case', price: 300.00, image: 'https://media.csgo-skins.com/container/porcelain-case.png', items: PORCELAIN_CASE_ITEMS, category: 'regular' },
    { id: 'c48', name: 'Gemstone Case', price: 400.00, image: 'https://media.csgo-skins.com/container/gemstone-case.png?v2', items: GEMSTONE_CASE_ITEMS, category: 'regular' },
];


export const MOCK_WINNINGS: Winning[] = [
    { id: 1, userName: 'ZywOo', skin: SCARLET_CASE_ITEMS.find(s => s.id === 'sc-s1')!, caseName: 'Scarlet Case', time: 'now' },
    { id: 2, userName: 's1mple', skin: HOWL_CASE_ITEMS.find(s => s.id === 'hc-s1')!, caseName: 'Howl Case', time: '1 second ago' },
    { id: 3, userName: 'CaseKing', skin: PORCELAIN_CASE_ITEMS.find(s => s.id === 'pc-s1')!, caseName: 'Porcelain Case', time: '1 second ago' },
    { id: 4, userName: 'GamerGod', skin: VAPORWAVE_CASE_ITEMS.find(s => s.id === 'vwc-s1')!, caseName: 'Vaporwave Case', time: '2 seconds ago' },
    { id: 5, userName: 'NiKo', skin: SURPRISE_PARTY_CASE_ITEMS.find(s => s.id === 'spc-s2')!, caseName: 'Surprise Party Case', time: '3 seconds ago' },
    { id: 6, userName: 'ProPlayer', skin: SURPRISE_PARTY_CASE_ITEMS.find(s => s.id === 'spc-s4')!, caseName: 'Surprise Party Case', time: '4 seconds ago' },
    { id: 7, userName: 'xX_Sniper_Xx', skin: FAVOR_BOX_CASE_ITEMS.find(s => s.id === 'fb-s4')!, caseName: 'Favor Box Case', time: '4 seconds ago' },
    { id: 8, userName: 'Player123', skin: SURPRISE_PARTY_CASE_ITEMS.find(s => s.id === 'spc-s5')!, caseName: 'Surprise Party Case', time: '5 seconds ago' },
    { id: 9, userName: 'pashaBiceps', skin: FAVOR_BOX_CASE_ITEMS.find(s => s.id === 'fb-s6')!, caseName: 'Favor Box Case', time: '6 seconds ago' },
];

export const BOT_NAMES = [
  'CaseBot_Andy', 'SpinBot_9000', 'RNG_Guru', 'Pixel_Prowler', 
  'Bot_Bravo', 'Virtual_Victor', 'Silicon_S1mple', 'CPU_KennyS'
];

export const Logo = () => (
    <Link to="/" className="flex items-center text-3xl font-black tracking-tight text-white no-underline">
        <span>CSG</span>
        <div className="relative inline-block w-6 h-6 mx-0.5" title="CSGOSKINS">
            <div className="w-full h-full bg-blue-500 rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 bg-orange-500 rounded-full"></div>
        </div>
        <span>SKINS</span>
    </Link>
);