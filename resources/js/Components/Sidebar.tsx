import React from 'react';

type SidebarProps = {
    user: User;
    setActiveComponent: React.Dispatch<React.SetStateAction<string>>;
};

const Sidebar: React.FC<SidebarProps> = ({ user, setActiveComponent }) => {
    return (
        <div className="sidebar dark-mode">
            <button onClick={() => setActiveComponent('home')} className="dark:text-white">Home</button>
            <button onClick={() => setActiveComponent('settings')} className="dark:text-white">Settings</button>
            <button onClick={() => setActiveComponent('reports')} className="dark:text-white">Reports</button>
        </div>
    );
};

export default Sidebar;
