import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faCalendarAlt, faCog, faUsers } from '@fortawesome/free-solid-svg-icons';
import '../assets/css/Sidebar.css';

function Sidebar({ isOpen, toggleSidebar }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: 'Classes', icon: faHome, path: '/home' },
    { name: 'Profile', icon: faUser, path: '/profile' },
    { name: 'Calendar', icon: faCalendarAlt, path: '#' },
    { name: 'Settings', icon: faCog, path: '#' },
  ];

  return (
    <div className={`${"Sidebar-sidebar"} ${isOpen ? "Sidebar-open" : "Sidebar-closed"}`}>
      <div className={"Sidebar-overlay"} onClick={toggleSidebar} />
      <nav className={"Sidebar-nav"}>
        <div className={"Sidebar-section"}>
          {menuItems.map((item) => (
            <button
              key={item.name}
              className={`${"Sidebar-navItem"} ${location.pathname === item.path ? "Sidebar-active" : ''}`}
              onClick={() => {
                navigate(item.path);
                toggleSidebar();
              }}
            >
              <FontAwesomeIcon icon={item.icon} className={"Sidebar-icon"} />
              <span>{item.name}</span>
            </button>
          ))}
        </div>
        <div className={"Sidebar-divider"} />
        <div className={"Sidebar-sectionTitle"}>ENROLLED</div>
        <div className={"Sidebar-section"}>
           <button className={"Sidebar-navItem"}>
             <FontAwesomeIcon icon={faUsers} className={"Sidebar-icon"} />
             <span>My Groups</span>
           </button>
        </div>
      </nav>
    </div>
  );
}

export default Sidebar;
