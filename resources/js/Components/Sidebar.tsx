import React from 'react';

type SidebarProps = {
    user: User;
    setActiveComponent: React.Dispatch<React.SetStateAction<string>>;
};

const Sidebar: React.FC<SidebarProps> = ({ user, setActiveComponent }) => {
    return (
        <div className="sidebar">
            <button onClick={() => setActiveComponent('home')}>Home</button>
            <button onClick={() => setActiveComponent('settings')}>Settings</button>
            <button onClick={() => setActiveComponent('reports')}>Reports</button>
        </div>
    );
};

export default Sidebar;
