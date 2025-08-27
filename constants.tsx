

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

export const JESTER_MODE_DATA: { [caseId: string]: { price: number } } = {
    'c51': { price: 6.95 },
    'c52': { price: 6.30 },
    'c53': { price: 52.65 },
    'c54': { price: 86.35 },
    'c55': { price: 325.85 },
    'c5': { price: 2.95 },
    'c6': { price: 6.60 },
    'c7': { price: 20.10 },
    'c8': { price: 37.60 },
    'c9': { price: 33.15 },
    'c10': { price: 37.10 },
    'c11': { price: 39.30 },
    'c12': { price: 60.60 },
    'c13': { price: 45.70 },
    'c14': { price: 36.90 },
    'c15': { price: 59.25 },
    'c16': { price: 89.60 },
    'c17': { price: 39.85 },
    'c18': { price: 81.90 },
    'c19': { price: 263.75 },
    'c20': { price: 157.30 },
    'c21': { price: 475.90 },
    'c22': { price: 147.00 },
    'c23': { price: 145.40 },
    'c24': { price: 121.80 },
    'c25': { price: 90.35 },
    'c26': { price: 283.85 },
    'c27': { price: 225.90 },
    'c28': { price: 366.00 },
    'c29': { price: 344.25 },
    'c30': { price: 271.40 },
    'c31': { price: 249.75 },
    'c32': { price: 192.75 },
    'c33': { price: 398.60 },
    'c34': { price: 514.45 },
    'c35': { price: 434.70 },
    'c36': { price: 683.35 },
    'c37': { price: 878.25 },
    'c38': { price: 412.95 },
    'c39': { price: 825.20 },
    'c40': { price: 533.20 },
    'c41': { price: 739.45 },
    'c42': { price: 971.40 },
    'c43': { price: 1832.25 },
    'c44': { price: 1231.25 },
    'c45': { price: 2111.10 },
    'c46': { price: 2210.80 },
    'c47': { price: 3008.30 },
    'c48': { price: 5284.75 },
};

// FIX: Add MINES_MULTIPLIERS constant.
// Multipliers for the Mines game. Key is the number of mines, value is an array of multipliers for each gem picked.
// MINES_MULTIPLIERS[minesCount][gemsPicked - 1]
export const MINES_MULTIPLIERS: { [key: number]: number[] } = {
  "1": [1.03, 1.12, 1.23, 1.34, 1.47, 1.62, 1.78, 1.96, 2.16, 2.38, 2.63, 2.91, 3.22, 3.56, 3.96, 4.4, 4.9, 5.46, 6.1, 6.83, 7.67, 8.64, 9.77, 11.11],
  "2": [1.08, 1.23, 1.4, 1.6, 1.83, 2.1, 2.4, 2.76, 3.18, 3.67, 4.25, 4.93, 5.73, 6.69, 7.84, 9.22, 10.9, 12.96, 15.55, 18.89, 23.3, 29.12, 37.15],
  "3": [1.13, 1.35, 1.59, 1.88, 2.22, 2.62, 3.1, 3.67, 4.35, 5.17, 6.18, 7.42, 8.95, 10.86, 13.26, 16.32, 20.31, 25.68, 32.93, 42.91, 56.66, 76.0],
  "4": [1.19, 1.48, 1.83, 2.26, 2.78, 3.43, 4.23, 5.24, 6.51, 8.11, 10.14, 12.78, 16.19, 20.62, 26.56, 34.63, 45.71, 61.21, 83.15, 115.35, 164.78],
  "5": [1.25, 1.62, 2.08, 2.67, 3.42, 4.39, 5.66, 7.31, 9.47, 12.31, 16.11, 21.28, 28.37, 38.16, 51.98, 71.74, 100.44, 143.48, 209.4, 314.1],
  "6": [1.32, 1.77, 2.37, 3.16, 4.21, 5.61, 7.48, 9.98, 13.3, 17.86, 24.11, 32.88, 45.37, 63.52, 90.74, 132.08, 196.53, 299.89, 470.25],
  "7": [1.39, 1.94, 2.7, 3.73, 5.1, 7.02, 9.71, 13.51, 18.91, 26.75, 38.21, 55.3, 80.93, 120.35, 182.35, 281.42, 444.8, 720.65, 1201.08],
  "8": [1.47, 2.14, 3.1, 4.45, 6.31, 8.94, 12.83, 18.57, 27.2, 40.35, 60.52, 92.14, 142.3, 224.2, 359.87, 589.28, 990.1, 1716.14],
  "9": [1.55, 2.38, 3.56, 5.35, 7.84, 11.64, 17.46, 26.54, 40.96, 64.31, 102.34, 165.55, 273.14, 459.78, 792.64, 1409.13, 2609.5],
  "10": [1.64, 2.64, 4.12, 6.45, 9.87, 15.2, 23.75, 37.6, 60.32, 98.02, 162.38, 273.98, 471.25, 831.93, 1512.6, 2836.13],
  "11": [1.74, 2.93, 4.8, 7.82, 12.48, 19.96, 32.44, 53.53, 89.93, 154.16, 269.78, 485.6, 900.2, 1719.43, 3381.9],
  "12": [1.84, 3.28, 5.64, 9.58, 15.97, 26.62, 45.25, 78.49, 138.92, 251.34, 467.3, 897.22, 1783.05, 3655.25],
  "13": [1.96, 3.67, 6.69, 11.9, 20.82, 36.44, 65.02, 118.96, 224.2, 434.6, 869.2, 1797.55, 3851.9],
  "14": [2.09, 4.14, 7.97, 14.94, 27.39, 50.11, 94.62, 184.55, 369.1, 762.5, 1628.78, 3619.5, 8352.7],
  "15": [2.24, 4.7, 9.58, 18.95, 36.38, 71.74, 147.2, 311.65, 680.1, 1530.23, 3570.53, 8692.65],
  "16": [2.41, 5.39, 11.64, 24.31, 49.33, 103.59, 224.45, 505.01, 1178.36, 2828.06, 7070.15],
  "17": [2.6, 6.23, 14.35, 31.88, 69.31, 157.97, 373.25, 919.23, 2346.03, 6256.08],
  "18": [2.82, 7.27, 17.98, 42.91, 100.12, 245.3, 627.98, 1674.6, 4655.53],
  "19": [3.07, 8.57, 22.99, 59.78, 150.3, 396.8, 1091.2, 3117.73],
  "20": [3.36, 10.26, 29.99, 85.68, 235.61, 683.28, 2049.83],
  "21": [3.7, 12.54, 40.45, 129.43, 398.05, 1326.83],
  "22": [4.11, 15.71, 56.76, 208.13, 763.15],
  "23": [4.6, 20.31, 84.63, 390.38],
  "24": [5.2, 28.22, 141.08]
};

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
    <Link to="/" className="flex items-center text-3xl font-black tracking-tight text-white no-underline group" title="SkArena">
        <div className="relative w-8 h-9 mr-2 flex items-center justify-center transition-transform group-hover:scale-110" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
            <div className="absolute inset-0 bg-blue-500 group-hover:bg-orange-500 transition-colors duration-300"></div>
            <span className="relative z-10 text-white font-bold text-xl">A</span>
        </div>
        <span className="text-blue-400 transition-colors duration-300 group-hover:text-white">Sk</span><span className="text-white transition-colors duration-300 group-hover:text-orange-400">Arena</span>
    </Link>
);