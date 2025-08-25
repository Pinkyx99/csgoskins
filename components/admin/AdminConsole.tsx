
import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

interface AdminConsoleProps {
    onClose: () => void;
}

interface LogEntry {
    type: 'success' | 'error' | 'info' | 'help';
    message: string | React.ReactNode;
    timestamp: string;
}

const helpContent = [
    { cmd: '/help', desc: 'Shows this list of commands.' },
    { cmd: '/ban [user] [duration] [reason]', desc: 'Bans a user. Duration: 1m, 2h, 3d, 1M, 1y, or perm.' },
    { cmd: '/unban [user]', desc: 'Unbans a user.' },
    { cmd: '/mute [user] [duration] [reason]', desc: 'Mutes a user. Duration is same as ban.' },
    { cmd: '/unmute [user]', desc: 'Unmutes a user.' },
    { cmd: '/set_balance [user] [amount]', desc: 'Sets a user\'s balance to a specific amount.' },
    { cmd: '/rain [amount] [claims] [mins]', desc: 'Starts a rain event for all users.' },
    { cmd: '/announce [message]', desc: 'Broadcasts a message to all users.' },
    { cmd: '/clear_chat', desc: 'Clears the global chat for everyone.' },
];

const AdminConsole: React.FC<AdminConsoleProps> = ({ onClose }) => {
    const [command, setCommand] = useState('');
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const logsEndRef = useRef<HTMLDivElement>(null);

    const addLog = (type: LogEntry['type'], message: string | React.ReactNode) => {
        const timestamp = new Date().toLocaleTimeString();
        setLogs(prev => [...prev, { type, message, timestamp }]);
    };
    
    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    const handleCommandSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedCommand = command.trim();
        if (!trimmedCommand) return;
        
        addLog('info', `> ${trimmedCommand}`);
        setCommand('');
        
        if (trimmedCommand.toLowerCase() === '/help') {
            const helpJsx = (
                <div className="space-y-1">
                    <p className="font-bold text-blue-300">Available Commands:</p>
                    {helpContent.map(item => (
                        <div key={item.cmd}>
                            <span className="text-gray-200">{item.cmd}</span>
                            <span className="text-gray-500"> - {item.desc}</span>
                        </div>
                    ))}
                </div>
            );
            addLog('help', helpJsx);
            return;
        }

        setIsLoading(true);
        try {
            const { data, error } = await supabase.rpc('execute_admin_command', {
                command: trimmedCommand
            });
            
            if (error) throw error;

            addLog('success', data);

        } catch (err: any) {
            addLog('error', err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const getLogColor = (type: LogEntry['type']) => {
        switch (type) {
            case 'success': return 'text-green-400';
            case 'error': return 'text-red-400';
            case 'info': return 'text-gray-400';
            case 'help': return 'text-gray-300';
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100] p-4" onClick={onClose}>
            <div 
                className="bg-[#0d1a2f] border-2 border-blue-500/50 rounded-lg w-full max-w-3xl h-[80vh] flex flex-col font-mono shadow-2xl shadow-blue-500/20" 
                onClick={e => e.stopPropagation()}
            >
                <div className="p-3 bg-slate-900/50 border-b-2 border-blue-500/50 flex justify-between items-center flex-shrink-0">
                    <h3 className="font-bold text-blue-300">[ADMIN CONSOLE]</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white font-sans text-xl">&times;</button>
                </div>
                
                <div className="p-4 flex-grow overflow-y-auto text-sm">
                    {logs.map((log, index) => (
                        <div key={index} className="flex items-start">
                            <span className="text-gray-600 mr-2 flex-shrink-0">{log.timestamp}</span>
                            <div className={`${getLogColor(log.type)} break-words w-full`}>{log.message}</div>
                        </div>
                    ))}
                    <div ref={logsEndRef} />
                </div>

                <div className="p-2 border-t-2 border-blue-500/50 flex-shrink-0">
                    <form onSubmit={handleCommandSubmit} className="flex gap-2">
                        <input
                            type="text"
                            value={command}
                            onChange={e => setCommand(e.target.value)}
                            placeholder="Type /help for a list of commands..."
                            disabled={isLoading}
                            autoFocus
                            className="w-full bg-[#12233f] border border-blue-800/50 rounded-md py-2 px-3 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                         <button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 text-white font-semibold px-4 rounded-md transition-colors">
                            {isLoading ? '...' : 'EXEC'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminConsole;
