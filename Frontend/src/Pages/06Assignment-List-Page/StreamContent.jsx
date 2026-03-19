import React from 'react';
import styles from './StreamContent.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faClipboardList } from '@fortawesome/free-solid-svg-icons';

function StreamContent() {
  const currentGroup = JSON.parse(localStorage.getItem("currentGroup"));

  return (
    <div className={styles.stream}>
      <div className={styles.announceBox}>
        <FontAwesomeIcon icon={faUserCircle} className={styles.avatar} />
        <div className={styles.inputPlaceholder}>Announce something to your class</div>
      </div>


    </div>
  );
}

export default StreamContent;
