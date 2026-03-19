import styles from './AssignmentCard.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardList, faEllipsisV } from '@fortawesome/free-solid-svg-icons';

function AssignmentCard({ assignment, onClick, onDelete }) {
  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.iconContainer}>
        <FontAwesomeIcon icon={faClipboardList} className={styles.icon} />
      </div>
      <div className={styles.content}>
        <div className={styles.info}>
          <h3 className={styles.title}>{assignment.assignmentName}</h3>
          <p className={styles.description}>{assignment.assignmentDescription}</p>
        </div>
        {onDelete && (
          <button
            className={styles.menuBtn}
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <FontAwesomeIcon icon={faEllipsisV} />
          </button>
        )}
      </div>
    </div>
  );
}

export default AssignmentCard;
