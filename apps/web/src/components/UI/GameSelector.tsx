import * as Select from '@radix-ui/react-select';
import { ChevronDown, Check } from 'lucide-react';
import { GAMES } from '@/constants';

export const GameSelector = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => {
    return (
        <Select.Root value={value} onValueChange={onChange}>
            <Select.Trigger className="game-select-trigger">
                <div>
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
                <Select.Content className="game-select-content">
                    <Select.Viewport className="p-2">
                        {GAMES.map((game) => (
                            <Select.Item
                                key={game.id}
                                value={game.id}
                                className="game-select-item"
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