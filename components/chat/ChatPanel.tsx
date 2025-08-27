import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useUser } from '../../hooks/useUser';
import { ChatMessage } from '../../types';
import ChatMessageItem from './ChatMessageItem';
import { useSiteEvents } from '../../hooks/useSiteEvents';
import RainNotification from '../events/RainNotification';

const ChatPanel: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const { user, setAuthModalOpen } = useUser();
    const { chatClearedTimestamp } = useSiteEvents();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (chatClearedTimestamp) {
            setMessages([]);
        }
    }, [chatClearedTimestamp]);

    useEffect(() => {
        const fetchMessages = async () => {
            const { data, error } = await supabase
                .from('chat_messages')
                .select('*')
                .order('created_at', { ascending: true })
                .limit(50);
            if (!error && data) {
                setMessages(data);
            }
        };

        fetchMessages();
        
        const channel = supabase.channel('public:chat_messages')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, payload => {
                const newMessage = payload.new as ChatMessage;
                setMessages(currentMessages => {
                    if (currentMessages.some(msg => msg.id === newMessage.id)) {
                        return currentMessages;
                    }
                    return [...currentMessages, newMessage];
                });
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);
    
    useEffect(() => {
       if (isOpen) {
         setTimeout(scrollToBottom, 100);
       }
    }, [messages, isOpen]);


    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !newMessage.trim()) return;

        setLoading(true);
        let content = newMessage.trim();
        const originalMessage = content;
        setNewMessage('');

        if (content.toLowerCase() === '!bal' || content.toLowerCase() === '/bal') {
            content = `My current balance is ${user.balance.toFixed(2)}€`;
        }

        const { data, error } = await supabase
            .from('chat_messages')
            .insert({
                content: content,
                user_id: user.id,
                username: user.name,
                avatar_url: user.avatar,
            })
            .select()
            .single();

        if (error) {
            console.error('Error sending message:', error);
            setNewMessage(originalMessage); 
        } else if (data) {
            setMessages(currentMessages => [...currentMessages, data as ChatMessage]);
        }
        setLoading(false);
    };

    const isMuted = user?.is_muted && (user.mute_expires_at === null || new Date(user.mute_expires_at) > new Date());
    const muteExpires = user?.mute_expires_at ? new Date(user.mute_expires_at).toLocaleString() : 'permanently';


    return (
        <>
            <div className={`fixed top-1/2 -translate-y-1/2 left-0 z-40 transition-transform duration-300 ${isOpen ? 'translate-x-[320px]' : 'translate-x-0'}`}>
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="bg-[#1a2c47] p-2 rounded-r-lg border-y border-r border-blue-900/50"
                    aria-label={isOpen ? "Close Chat" : "Open Chat"}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 text-white transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            <div className={`fixed top-0 left-0 h-full w-80 bg-[#12233f] border-r border-blue-900/50 z-40 flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-4 border-b border-blue-900/50 flex-shrink-0">
                    <h3 className="font-bold text-lg text-white text-center">Global Chat</h3>
                </div>
                
                <RainNotification />

                <div className="flex-grow p-2 overflow-y-auto chat-scrollbar">
                    {messages.map(msg => <ChatMessageItem key={msg.id} message={msg} />)}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-3 border-t border-blue-900/50 flex-shrink-0">
                    {user ? (
                         isMuted ? (
                            <div className="text-center text-sm text-yellow-400 bg-yellow-500/10 p-2 rounded-md">
                                You are muted until {muteExpires}.
                            </div>
                        ) : (
                            <form onSubmit={handleSendMessage} className="flex gap-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    maxLength={280}
                                    disabled={loading}
                                    className="w-full bg-[#0d1a2f] border border-blue-800/50 rounded-md py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                                <button type="submit" disabled={loading || !newMessage.trim()} className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 text-white font-semibold px-4 rounded-md transition-colors">
                                    Send
                                </button>
                            </form>
                        )
                    ) : (
                        <div className="text-center text-sm text-gray-400">
                           <button onClick={() => setAuthModalOpen(true)} className="text-blue-400 font-semibold hover:underline">Login</button> to chat.
                        </div>
                    )}
                </div>
            </div>
             <style>{`
                .chat-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .chat-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .chat-scrollbar::-webkit-scrollbar-thumb {
                    background: #1e3a5f;
                    border-radius: 3px;
                }
                .chat-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #2b528a;
                }
            `}</style>
        </>
    );
};

export default ChatPanel;