import styles from './GroupCard.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faFolderOpen, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const GROUP_COLORS = ['#1a73e8', '#1e8e3e', '#f9ab00', '#d93025', '#8ab4f8'];

function GroupCard({ id, title, section, creator, isCreator, onDelete }) {
  const navigate = useNavigate();
  const bgColor = GROUP_COLORS[id ? id.charCodeAt(0) % GROUP_COLORS.length : 0];

  return (
    <div className={styles.card} onClick={() => navigate(`/group/${id}`)}>
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
