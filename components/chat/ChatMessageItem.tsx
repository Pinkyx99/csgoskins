
import React from 'react';
import { Link } from 'react-router-dom';
import { ChatMessage } from '../../types';

interface ChatMessageItemProps {
    message: ChatMessage;
}

const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message }) => {
    const avatarUrl = message.avatar_url || `https://api.dicebear.com/8.x/bottts/svg?seed=${message.username}`;

    return (
        <div className="flex items-start gap-3 p-2.5 rounded-md hover:bg-white/5">
            <img src={avatarUrl} alt={message.username} className="w-8 h-8 rounded-md flex-shrink-0 object-cover" />
            <div className="flex-grow">
                 <Link to={`/user/${message.username}`} className="font-semibold text-blue-300 text-sm hover:underline">{message.username}</Link>
                <p className="text-gray-200 text-sm break-words">{message.content}</p>
            </div>
        </div>
    );
};

export default ChatMessageItem;