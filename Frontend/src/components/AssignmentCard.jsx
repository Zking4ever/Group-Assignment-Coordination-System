import '../assets/css/AssignmentCard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardList, faEllipsisV } from '@fortawesome/free-solid-svg-icons';

function AssignmentCard({ assignment, onClick, onDelete }) {
  return (
    <div className={"AssignmentCard-card"} onClick={onClick}>
      <div className={"AssignmentCard-iconContainer"}>
        <FontAwesomeIcon icon={faClipboardList} className={"AssignmentCard-icon"} />
      </div>
      <div className={"AssignmentCard-content"}>
        <div className={"AssignmentCard-info"}>
          <h3 className={"AssignmentCard-title"}>{assignment.assignmentName}</h3>
          <p className={"AssignmentCard-description"}>{assignment.assignmentDescription}</p>
        </div>
        {onDelete && (
          <button
            className={"AssignmentCard-menuBtn"}
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
