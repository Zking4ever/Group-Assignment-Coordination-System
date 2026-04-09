import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faPlus, faTh, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";
import '../assets/css/Header.css';

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
    <header className={"Header-header"}>
      <div className={"Header-left"}>
        <button className={"Header-menuButton"} onClick={toggleSidebar}>
          <FontAwesomeIcon icon={faBars} />
        </button>
        <div className={"Header-logo"} onClick={() => navigate('/home')}>
          <span className={"Header-logoText"}>Coordination</span>
        </div>
      </div>

      <div className={"Header-right"}>
        <div className={"Header-actionWrapper"}>
          <button className={"Header-iconButton"} onClick={() => setShowMenu(!showMenu)}>
            <FontAwesomeIcon icon={faPlus} />
          </button>
          {showMenu && (
            <div className={"Header-menu"}>
              <button onClick={() => handleAction('join')}>Join Group</button>
              <button onClick={() => handleAction('create')}>Create Group</button>
            </div>
          )}
        </div>
        <button className={"Header-iconButton"}>
          <FontAwesomeIcon icon={faTh} />
        </button>
        <div className={"Header-profile"} onClick={() => navigate('/profile')}>
          <FontAwesomeIcon icon={faUserCircle} className={"Header-profileIcon"} />
        </div>
      </div>
    </header>
  );
}

export default Header;
