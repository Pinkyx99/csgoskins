import { Skin, SkinRarity } from '../types';

const RARITY_CHANCES: { [key in SkinRarity]: number } = {
    [SkinRarity.Gold]: 0.26,
    [SkinRarity.Covert]: 0.64,
    [SkinRarity.Classified]: 3.2,
    [SkinRarity.Restricted]: 15.98,
    [SkinRarity.MilSpec]: 30,
    [SkinRarity.Industrial]: 25,
    [SkinRarity.Consumer]: 24.92,
};

export function getBalancedCaseItems(caseItems: Skin[]): Skin[] {
    const itemsByRarity: { [key in SkinRarity]?: Skin[] } = {};
    caseItems.forEach(item => {
        if (!itemsByRarity[item.rarity]) {
            itemsByRarity[item.rarity] = [];
        }
        itemsByRarity[item.rarity]!.push(item);
    });

    const availableRarities = Object.keys(itemsByRarity) as SkinRarity[];

    // Normalize rarity chances based on what's available in the case
    let totalRarityChanceAvailable = 0;
    availableRarities.forEach(rarity => {
        totalRarityChanceAvailable += RARITY_CHANCES[rarity] || 0;
    });

    if (totalRarityChanceAvailable === 0) {
        // Fallback for cases with unknown rarities or if something is wrong
        return caseItems;
    }

    const finalItemsWithChances: Skin[] = [];

    availableRarities.forEach(rarity => {
        const itemsInRarity = itemsByRarity[rarity]!;
        const baseRarityChance = RARITY_CHANCES[rarity] || 0;
        
        // Re-distribute chances proportionally
        const totalChanceForRarity = (baseRarityChance / totalRarityChanceAvailable) * 100;

        // Weight items within the same rarity inversely by price. Cheaper items are more common.
        let totalInversePrice = 0;
        itemsInRarity.forEach(item => {
            totalInversePrice += 1 / (item.price > 0 ? item.price : 0.01);
        });

        if (totalInversePrice > 0) {
            itemsInRarity.forEach(item => {
                const weight = (1 / (item.price > 0 ? item.price : 0.01)) / totalInversePrice;
                const finalChance = weight * totalChanceForRarity;
                finalItemsWithChances.push({ ...item, chance: finalChance });
            });
        } else { // Handle cases where all items have a price of 0 (e.g., daily case)
            const chancePerItem = totalChanceForRarity / itemsInRarity.length;
            itemsInRarity.forEach(item => {
                finalItemsWithChances.push({ ...item, chance: chancePerItem });
            });
        }
    });

    // Final normalization to ensure sum is exactly 100
    const finalTotalChance = finalItemsWithChances.reduce((sum, item) => sum + item.chance, 0);
    if (finalTotalChance > 0) {
        return finalItemsWithChances.map(item => ({...item, chance: (item.chance / finalTotalChance) * 100}));
    }

    return finalItemsWithChances;
}
