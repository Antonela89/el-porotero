import * as Select from '@radix-ui/react-select';
import { ChevronDown, Check } from 'lucide-react';
import { GAMES } from '@/constants/games';

export const GameSelector = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => {
    return (
        <Select.Root value={value} onValueChange={onChange}>
            <Select.Trigger className="w-full bg-surface border border-white/10 p-4 rounded-2xl flex items-center justify-between text-text-main outline-none focus:border-primary transition-all">
                <div className="flex items-center gap-3">
                    <span className="text-primary">
                        {GAMES.find(g => g.id === value)?.icon}
                    </span>
                    <Select.Value />
                </div>
                <Select.Icon>
                    <ChevronDown size={20} className="text-text-muted" />
                </Select.Icon>
            </Select.Trigger>

            <Select.Portal>
                <Select.Content className="bg-surface border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
                    <Select.Viewport className="p-2">
                        {GAMES.map((game) => (
                            <Select.Item
                                key={game.id}
                                value={game.id}
                                className="flex items-center gap-3 p-3 rounded-xl outline-none cursor-pointer hover:bg-primary/10 data-[state=checked]:text-primary transition-colors"
                            >
                                <span className="opacity-70">{game.icon}</span>
                                <Select.ItemText className="font-bold">{game.id}</Select.ItemText>
                                <Select.ItemIndicator className="ml-auto">
                                    <Check size={16} />
                                </Select.ItemIndicator>
                            </Select.Item>
                        ))}
                    </Select.Viewport>
                </Select.Content>
            </Select.Portal>
        </Select.Root>
    );
};