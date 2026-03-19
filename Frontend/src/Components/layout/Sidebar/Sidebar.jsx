import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faCalendarAlt, faCog, faUsers } from '@fortawesome/free-solid-svg-icons';
import styles from './Sidebar.module.css';

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
    <div className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
      <div className={styles.overlay} onClick={toggleSidebar} />
      <nav className={styles.nav}>
        <div className={styles.section}>
          {menuItems.map((item) => (
            <button
              key={item.name}
              className={`${styles.navItem} ${location.pathname === item.path ? styles.active : ''}`}
              onClick={() => {
                navigate(item.path);
                toggleSidebar();
              }}
            >
              <FontAwesomeIcon icon={item.icon} className={styles.icon} />
              <span>{item.name}</span>
            </button>
          ))}
        </div>
        <div className={styles.divider} />
        <div className={styles.sectionTitle}>ENROLLED</div>
        <div className={styles.section}>
           <button className={styles.navItem}>
             <FontAwesomeIcon icon={faUsers} className={styles.icon} />
             <span>My Groups</span>
           </button>
        </div>
      </nav>
    </div>
  );
}

export default Sidebar;
