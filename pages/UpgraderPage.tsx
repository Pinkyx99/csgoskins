import React, { useState, useMemo, useEffect } from 'react';
import { Skin } from '../types';
import { useUser } from '../hooks/useUser';
import { MOCK_CASES } from '../constants';
import Button from '../components/ui/Button';
import UpgradeChanceDisplay from '../components/upgrader/UpgradeChanceDisplay';
import InventoryPanel from '../components/upgrader/InventoryPanel';
import TargetItemsPanel from '../components/upgrader/TargetItemsPanel';

const HexButton = ({ children, active, onClick }: { children: React.ReactNode, active: boolean, onClick: () => void }) => (
    <button onClick={onClick} className={`relative w-12 h-14 flex items-center justify-center font-semibold transition-colors text-sm ${active ? 'text-white' : 'text-gray-400 hover:text-white'}`}
        style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
        <div className={`absolute inset-0.5 transition-colors ${active ? 'bg-blue-600' : 'bg-[#1a2c47] group-hover:bg-[#253d63]'}`} style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}></div>
        <span className="relative z-10">{children}</span>
    </button>
);

const ChevronAnimation = () => (
    <div className="w-full h-full relative overflow-hidden hidden md:block">
        <div className="absolute top-0 left-0 h-full w-[200%] flex items-center animate-chevron-scroll">
            {[...Array(10)].map((_, i) => (
                <svg key={i} className="w-12 h-12 text-blue-900/50 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
            ))}
        </div>
        <style>{`
            @keyframes chevron-scroll {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
            }
            .animate-chevron-scroll {
                animation: chevron-scroll 10s linear infinite;
            }
        `}</style>
    </div>
);

const SelectionPlaceholder = () => (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
        <img src="https://i.imgur.com/J2vRAk4.png" alt="Select items placeholder" className="w-28 h-28 object-contain opacity-50 mb-2"/>
        <p className="text-sm mt-2 font-semibold">Select items</p>
    </div>
);

const ItemSelectionPanel = ({ title, subtext, value1, value2, children }: { title: string, subtext: string, value1: React.ReactNode, value2: React.ReactNode, children: React.ReactNode }) => (
    <div className="flex flex-col items-center justify-between p-4 bg-[#0d1a2f]/50 border border-blue-900/50 rounded-lg relative overflow-hidden min-h-[420px]">
        <div className="relative z-10 flex flex-col items-center justify-between h-full w-full">
            <div className="text-center">
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="text-sm text-gray-500">{subtext}</p>
            </div>
            <div className="flex-grow flex items-center justify-center my-4 w-full">
                {children}
            </div>
            <div className="flex items-center gap-2">
                <div className="bg-[#0d1a2f] border border-slate-700 rounded-md px-4 py-1.5 text-center min-w-[100px]">
                    {value1}
                </div>
                {value2 && (
                    <div className="bg-[#0d1a2f] border border-slate-700 rounded-md px-3 py-1.5 text-center">
                         {value2}
                    </div>
                )}
            </div>
        </div>
    </div>
);


const ROLLER_ANIMATION_DURATION = 5000;
const RESULT_DISPLAY_DURATION = 2000;

const SelectedItemsGrid = ({ skins }: { skins: Skin[] }) => {
    const count = skins.length;

    let gridContainerClasses = 'w-full h-full p-2';
    let itemContainerClasses = 'relative aspect-square bg-[#12233f] rounded-md p-1 border border-slate-700 flex items-center justify-center';
    
    if (count === 1) {
        gridContainerClasses += ' flex justify-center items-center';
        itemContainerClasses += ' w-32 h-32';
    } else if (count <= 4) {
        gridContainerClasses += ' grid grid-cols-2 gap-2 place-items-center';
        itemContainerClasses += ' w-24 h-24';
    } else if (count <= 9) {
        gridContainerClasses += ' grid grid-cols-3 gap-2 place-items-center';
        itemContainerClasses += ' w-20 h-20';
    } else { // 10 items
        gridContainerClasses += ' grid grid-cols-5 gap-1 place-items-center';
        itemContainerClasses += ' w-16 h-16';
    }

    return (
        <div className={gridContainerClasses}>
            {skins.map(skin => (
                <div key={skin.instance_id} className={itemContainerClasses}>
                    <img src={skin.image} alt={skin.name} className="max-w-full max-h-full object-contain drop-shadow-lg" />
                </div>
            ))}
        </div>
    );
};

const UpgraderPage: React.FC = () => {
    const { user, processUpgrade } = useUser();
    
    const [selectedInventorySkins, setSelectedInventorySkins] = useState<Skin[]>([]);
    const [selectedTargetSkin, setSelectedTargetSkin] = useState<Skin | null>(null);
    const [balanceToAdd, setBalanceToAdd] = useState(0);
    const [upgradeChance, setUpgradeChance] = useState(0);
    const [activeMultiplier, setActiveMultiplier] = useState<number | null>(null);
    
    const [isUpgrading, setIsUpgrading] = useState(false);
    const [upgradeResult, setUpgradeResult] = useState<'win' | 'loss' | null>(null);

    const inventoryValue = useMemo(() => selectedInventorySkins.reduce((sum, skin) => sum + skin.price, 0), [selectedInventorySkins]);
    const totalInputValue = inventoryValue + balanceToAdd;

    const allSkins = useMemo(() => MOCK_CASES.flatMap(c => c.items).filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i).sort((a,b) => a.price - b.price), []);
    const totalUniqueSkins = allSkins.length;

    useEffect(() => {
        if (totalInputValue > 0 && selectedTargetSkin) {
            if (selectedTargetSkin.price > totalInputValue) {
                const chance = (totalInputValue / selectedTargetSkin.price) * 95; // Chance logic
                setUpgradeChance(Math.min(chance, 95));
            } else {
                setUpgradeChance(0);
            }
        } else {
            setUpgradeChance(0);
        }
    }, [totalInputValue, selectedTargetSkin]);

    const handleMultiplierSelect = (multiplier: number) => {
        if (totalInputValue === 0) return;
        setActiveMultiplier(multiplier);
        const targetPrice = totalInputValue * multiplier;
        const closestSkin = allSkins
            .filter(s => s.price > totalInputValue)
            .reduce((prev, curr) => 
                Math.abs(curr.price - targetPrice) < Math.abs(prev.price - targetPrice) ? curr : prev
            );
        setSelectedTargetSkin(closestSkin);
    };
    
    const handleToggleInventorySkin = (skin: Skin) => {
        setSelectedInventorySkins(prev => prev.some(s => s.instance_id === skin.instance_id) ? prev.filter(s => s.instance_id !== skin.instance_id) : [...prev, skin].slice(0, 10));
        setSelectedTargetSkin(null);
        setActiveMultiplier(null);
    };

    const handleUpgrade = async () => {
        if (selectedInventorySkins.length === 0 || !selectedTargetSkin || isUpgrading || upgradeResult) return;
        
        const roll = Math.random() * 100;
        const result = roll < upgradeChance ? 'win' : 'loss';

        setIsUpgrading(true);
        setUpgradeResult(result);

        const instanceIds = selectedInventorySkins.map(s => s.instance_id!);
        const skinToAddOnWin = result === 'win' ? selectedTargetSkin : null;

        setTimeout(async () => {
            await processUpgrade(instanceIds, balanceToAdd, skinToAddOnWin);
            setIsUpgrading(false);

            setTimeout(() => {
                setSelectedInventorySkins([]);
                setSelectedTargetSkin(null);
                setUpgradeResult(null);
                setActiveMultiplier(null);
                setBalanceToAdd(0);
            }, RESULT_DISPLAY_DURATION);
        }, ROLLER_ANIMATION_DURATION);
    };
    
     const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Number(e.target.value);
        setBalanceToAdd(val);
        const target = e.target;
        const progress = (val / (user?.balance || 1)) * 100;
        target.style.setProperty('--range-progress', `${progress}%`);
    };

    return (
        <div className="container mx-auto px-4 py-8 fade-in-up">
            <div className="bg-[#12233f] border border-blue-900/50 rounded-lg p-6 mb-8">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] items-center gap-6">
                    <ItemSelectionPanel 
                        title="Select your items" 
                        subtext={`Items to upgrade (${selectedInventorySkins.length}/10)`}
                        value1={<><span className="text-white font-bold text-lg">{inventoryValue.toFixed(2)}€</span>{balanceToAdd > 0 && <span className="text-sm text-green-400"> +{balanceToAdd.toFixed(2)}€</span>}</>}
                        value2={null}
                    >
                       {selectedInventorySkins.length > 0 ? (
                           <SelectedItemsGrid skins={selectedInventorySkins} />
                       ) : (
                           <SelectionPlaceholder />
                       )}
                    </ItemSelectionPanel>

                    <UpgradeChanceDisplay chance={upgradeChance} isUpgrading={isUpgrading} result={upgradeResult} />

                    <ItemSelectionPanel 
                        title="Select items" 
                        subtext="You want to get"
                        value1={<span className="text-white font-bold text-lg">{selectedTargetSkin?.price.toFixed(2) || '0.00'}€</span>}
                        value2={<span className="text-blue-400 font-semibold text-sm">{totalInputValue > 0 && selectedTargetSkin ? (selectedTargetSkin.price / totalInputValue).toFixed(2) : '0.00'}x</span>}
                    >
                         {selectedTargetSkin ? (
                            <div className="w-full h-full flex justify-center items-center">
                                <div className="relative aspect-square w-40 h-40 bg-[#12233f] rounded-md p-1 border border-slate-700 flex items-center justify-center">
                                    <img src={selectedTargetSkin.image} alt={selectedTargetSkin.name} className="max-w-full max-h-full object-contain drop-shadow-lg"/>
                                </div>
                            </div>
                       ) : (
                           <SelectionPlaceholder />
                       )}
                    </ItemSelectionPanel>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 mt-8">
                    <div className="flex flex-col gap-1 justify-center md:justify-start">
                        <div className="flex justify-between items-center text-sm font-medium text-gray-400 px-1">
                           <span>Use balance</span>
                           <span>{balanceToAdd.toFixed(2)}€ / {user?.balance.toFixed(2) ?? '0.00'}€</span>
                        </div>
                        <input type="range" min="0" max={user?.balance || 0} step="0.01" value={balanceToAdd} onChange={handleBalanceChange} disabled={!user || isUpgrading || !!upgradeResult} />
                    </div>

                    <div className="flex items-center justify-center h-12">
                        <div className="w-full"><ChevronAnimation /></div>
                        <Button variant='glow' onClick={handleUpgrade} disabled={selectedInventorySkins.length === 0 || !selectedTargetSkin || isUpgrading || upgradeResult !== null} className="w-48 text-lg py-3 flex-shrink-0">
                            {isUpgrading || upgradeResult ? '...' : 'Upgrade'}
                        </Button>
                        <div className="w-full transform -scale-x-100"><ChevronAnimation /></div>
                    </div>

                    <div className="flex items-center gap-2 justify-center md:justify-end">
                        <div className="group"><HexButton active={activeMultiplier === 1.2} onClick={() => handleMultiplierSelect(1.2)}>1.2x</HexButton></div>
                        <div className="group"><HexButton active={activeMultiplier === 1.5} onClick={() => handleMultiplierSelect(1.5)}>1.5x</HexButton></div>
                        <div className="group"><HexButton active={activeMultiplier === 2} onClick={() => handleMultiplierSelect(2)}>2x</HexButton></div>
                        <div className="group"><HexButton active={activeMultiplier === 5} onClick={() => handleMultiplierSelect(5)}>5x</HexButton></div>
                        <div className="group"><HexButton active={activeMultiplier === 10} onClick={() => handleMultiplierSelect(10)}>10x</HexButton></div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <InventoryPanel 
                    inventory={user?.inventory || []}
                    selectedSkinIds={selectedInventorySkins.map(s => s.instance_id!)}
                    onToggleSkin={handleToggleInventorySkin}
                />
                <TargetItemsPanel
                    skins={allSkins.filter(s => totalInputValue > 0 ? s.price > totalInputValue : true)}
                    selectedSkinId={selectedTargetSkin?.id}
                    onSelectSkin={(skin) => {setSelectedTargetSkin(skin); setActiveMultiplier(null);}}
                    inventorySkinPrice={totalInputValue}
                    totalUniqueSkins={totalUniqueSkins}
                />
            </div>
        </div>
    );
};

export default UpgraderPage;