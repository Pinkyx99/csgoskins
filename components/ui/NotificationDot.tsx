import React from 'react';

const NotificationDot: React.FC = () => (
    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#1a2c47]">
        <div className="absolute inset-0 bg-red-500 rounded-full animate-ping"></div>
    </div>
);

export default NotificationDot;
