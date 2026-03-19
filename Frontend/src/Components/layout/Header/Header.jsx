import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faPlus, faTh, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";
import styles from './Header.module.css';

function Header({ toggleSidebar, setView }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);

  const isDashboard = location.pathname === '/home';

  const handleAction = (action) => {
    if (isDashboard && setView) {
      setView(action);
    } else {
      navigate('/home');
    }
    setShowMenu(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button className={styles.menuButton} onClick={toggleSidebar}>
          <FontAwesomeIcon icon={faBars} />
        </button>
        <div className={styles.logo} onClick={() => navigate('/home')}>
          <span className={styles.logoText}>Coordination</span>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.actionWrapper}>
          <button className={styles.iconButton} onClick={() => setShowMenu(!showMenu)}>
            <FontAwesomeIcon icon={faPlus} />
          </button>
          {showMenu && (
            <div className={styles.menu}>
              <button onClick={() => handleAction('join')}>Join Group</button>
              <button onClick={() => handleAction('create')}>Create Group</button>
            </div>
          )}
        </div>
        <button className={styles.iconButton}>
          <FontAwesomeIcon icon={faTh} />
        </button>
        <div className={styles.profile} onClick={() => navigate('/profile')}>
          <FontAwesomeIcon icon={faUserCircle} className={styles.profileIcon} />
        </div>
      </div>
    </header>
  );
}

export default Header;
