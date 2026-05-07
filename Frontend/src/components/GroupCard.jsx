import '../assets/css/GroupCard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faFolderOpen, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { use } from 'react';
import { getUserDetail } from '@services/Service.js';
import { useState, useEffect } from 'react';

const GROUP_COLORS = ['#1a73e8', '#1e8e3e', '#f9ab00', '#d93025', '#8ab4f8'];

function GroupCard({ id, title, section, creatorId, isCreator, onDelete }) {
  const navigate = useNavigate();
  const bgColor = GROUP_COLORS[id ? id.charCodeAt(0) % GROUP_COLORS.length : 0];
  const [creator, setCreator] = useState(null);
  useEffect(() => {
         const LoadCreator = async () => {
           const creator =  await getUserDetail(creatorId);
          setCreator(creator ? creator.firstName + " " + creator.lastName : "Unknown Creator");
          };
          LoadCreator();
  }, []);
  return (
    <div className={"GroupCard-card"} onClick={() => navigate(`/group/${id}`)}>
      <div className={"GroupCard-header"} style={{ backgroundColor: bgColor }}>
        <div className={"GroupCard-headerContent"}>
          <h2 className={"GroupCard-title"}>{title}</h2>
          <p className={"GroupCard-creator"}>{creator}</p>
        </div>
        <button 
          className={"GroupCard-menuButton"} 
          onClick={(e) => {
            e.stopPropagation();
            if (isCreator && window.confirm('Delete this group?')) onDelete();
          }}
        >
          <FontAwesomeIcon icon={faEllipsisV} />
        </button>
      </div>
      
      <div className={"GroupCard-body"}>
        <div className={"GroupCard-avatar"}>
          {creator ? creator[0].toUpperCase() : 'U'}
        </div>
      </div>

      <div className={"GroupCard-footer"}>
        <button className={"GroupCard-footerBtn"} title="Open assignments">
          <FontAwesomeIcon icon={faFolderOpen} />
        </button>
        <button className={"GroupCard-footerBtn"} title="View progress">
          <FontAwesomeIcon icon={faChartLine} />
        </button>
      </div>
    </div>
  );
}

export default GroupCard;
