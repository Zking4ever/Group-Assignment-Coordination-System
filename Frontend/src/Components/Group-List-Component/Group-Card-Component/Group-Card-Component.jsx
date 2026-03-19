import styles from './Group-Card-Component.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faFolderOpen, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

function GroupCard({ id, title, section, creator, isCreator, onDelete }) {
  const navigate = useNavigate();
  const colors = ['#1a73e8', '#1e8e3e', '#f9ab00', '#d93025', '#8ab4f8'];
  const bgColor = colors[Math.floor(Math.random() * colors.length)];

  const handleCardClick = () => {
    navigate(`/group/${id}`);
  };

  return (
    <div className={styles.card} onClick={handleCardClick}>
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
        <button className={styles.footerBtn} title="Open assignments">
          <FontAwesomeIcon icon={faFolderOpen} />
        </button>
        <button className={styles.footerBtn} title="View progress">
          <FontAwesomeIcon icon={faChartLine} />
        </button>
      </div>
    </div>
  );
}

export default GroupCard;