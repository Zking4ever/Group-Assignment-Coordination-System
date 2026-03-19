import React from 'react';
import styles from './Group-Card-Component.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV, faFolderOpen, faChartLine } from "@fortawesome/free-solid-svg-icons";

function GroupCard({ title, creator, onClick, onDelete, isCreator }) {
  // Generate a random pastel color for the header background
  const colors = ['#1a73e8', '#1e8e3e', '#f9ab00', '#d93025', '#8ab4f8'];
  const bgColor = colors[Math.floor(Math.random() * colors.length)];

  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.header} style={{ backgroundColor: bgColor }}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.creator}>{creator}</p>
        </div>
        <button
          className={styles.menuButton}
          onClick={(e) => {
            e.stopPropagation();
            if (isCreator && window.confirm('Delete this group?')) onDelete();
          }}
        >
          <FontAwesomeIcon icon={faEllipsisV} />
        </button>
      </div>

      <div className={styles.body}>
        <div className={styles.avatar}>
          {creator ? creator[0].toUpperCase() : 'U'}
        </div>
      </div>

      <div className={styles.footer}>
        <button className={styles.footerButton}>
          <FontAwesomeIcon icon={faChartLine} />
        </button>
        <button className={styles.footerButton}>
          <FontAwesomeIcon icon={faFolderOpen} />
        </button>
      </div>
    </div>
  );
}

export default GroupCard;