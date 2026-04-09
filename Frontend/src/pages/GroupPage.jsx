import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import GroupworkContent from '@components/AssignmentList.jsx'
import MemberList from '@components/MemberList.jsx'
import { fetchGroups } from '@services/authService.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardList } from '@fortawesome/free-solid-svg-icons';
import '../assets/css/GroupPage.css';

function GroupPage() {
    const { groupId } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('stream');
    const [group, setGroup] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("currentUser"));
        setCurrentUser(user);

        const loadGroup = async () => {
            try {
                const { response, data } = await fetchGroups(groupId);
                if (response.ok) {
                    setGroup(data);
                }
            } catch (error) {
                console.error("Failed to load group:", error);
            }
        };
        loadGroup();
    }, [groupId]);

    if (!group) return <div className={"GroupPage-loading"}>Loading group...</div>;

    const isOwner = group.creatorId === currentUser?.id;

    return (
        <div className={"GroupPage-groupPage"}>
            <div className={"GroupPage-banner"}>
                <div className={"GroupPage-bannerContent"}>
                    <h1>{group.groupName}</h1>
                    <p>{group.groupDescription}</p>
                    {isOwner && (
                        <div className={"GroupPage-inviteContainer"}>
                            <span className={"GroupPage-inviteLabel"}>Invite code:</span>
                            <span className={"GroupPage-inviteCode"}>{group.inviteCode}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className={"GroupPage-tabBar"}>
                <button
                    className={`${"GroupPage-tab"} ${activeTab === 'stream' ? "GroupPage-active" : ''}`}
                    onClick={() => setActiveTab('stream')}
                >
                    Stream
                </button>
                <button
                    className={`${"GroupPage-tab"} ${activeTab === 'groupwork' ? "GroupPage-active" : ''}`}
                    onClick={() => setActiveTab('groupwork')}
                >
                    Assignments
                </button>
                <button
                    className={`${"GroupPage-tab"} ${activeTab === 'people' ? "GroupPage-active" : ''}`}
                    onClick={() => setActiveTab('people')}
                >
                    People
                </button>
            </div>

            <div className={"GroupPage-tabContent"}>
                {activeTab === 'stream' && <div className={"GroupPage-stream"}>
                    <div className={"GroupPage-announcementBox"}>
                        <div className={"GroupPage-avatar"}>
                            {currentUser?.firstName?.[0]}
                        </div>
                        <span className='inputPlaceholder'>Announce something to your group</span>
                    </div>
                    <div className={"GroupPage-updates"}>
                        <div className={"GroupPage-updateCard"}>
                            <div className={"GroupPage-updateIcon"}>
                                <FontAwesomeIcon icon={faClipboardList} />
                            </div>
                            <div className={"GroupPage-updateText"}>
                                <p>Welcome to <strong>{group?.groupName || 'the group'}</strong>!</p>
                                <span className={"GroupPage-date"}>Just now</span>
                            </div>
                        </div>
                    </div>
                </div>}
                {activeTab === 'groupwork' && <GroupworkContent groupId={groupId} isOwner={isOwner} />}
                {activeTab === 'people' && <MemberList groupId={groupId} />}
            </div>
        </div>
    );
}

export default GroupPage;
