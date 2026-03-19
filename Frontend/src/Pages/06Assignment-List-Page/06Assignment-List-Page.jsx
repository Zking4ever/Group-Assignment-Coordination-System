import React, { useState, useEffect } from 'react'
import styles from './06Assignment-List-Page.module.css'
import GroupworkContent from '../../Components/Assignment-List-Component/Assignment-Home-Component/Assignment-Home-Component.jsx'
import PeopleContent from '../../Components/Assignment-List-Component/Member-List-Component/Member-List-Component.jsx'
import { useParams, useNavigate } from 'react-router-dom';
import { fetchGroups } from '../../services/authService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardList } from '@fortawesome/free-solid-svg-icons';

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

    if (!group) return <div className={styles.loading}>Loading group...</div>;

    const isOwner = group.creatorId === currentUser?.id;

    return (
        <div className={styles.groupPage}>
            <div className={styles.banner}>
                <div className={styles.bannerContent}>
                    <h1>{group.groupName}</h1>
                    <p>{group.groupDescription}</p>
                    {isOwner && (
                        <div className={styles.inviteContainer}>
                            <span className={styles.inviteLabel}>Invite code:</span>
                            <span className={styles.inviteCode}>{group.inviteCode}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.tabBar}>
                <button
                    className={`${styles.tab} ${activeTab === 'stream' ? styles.active : ''}`}
                    onClick={() => setActiveTab('stream')}
                >
                    Stream
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'groupwork' ? styles.active : ''}`}
                    onClick={() => setActiveTab('groupwork')}
                >
                    Groupwork
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'people' ? styles.active : ''}`}
                    onClick={() => setActiveTab('people')}
                >
                    People
                </button>
            </div>

            <div className={styles.tabContent}>
                {activeTab === 'stream' && <div className={styles.stream}>
                    <div className={styles.announcementBox}>
                        <div className={styles.avatar}>
                            {currentUser?.firstName?.[0]}
                        </div>
                        <span className='inputPlaceholder'>Announce something to your group</span>
                    </div>
                    <div className={styles.updates}>
                        <div className={styles.updateCard}>
                            <div className={styles.updateIcon}>
                                <FontAwesomeIcon icon={faClipboardList} />
                            </div>
                            <div className={styles.updateText}>
                                <p>Welcome to <strong>{group?.groupName || 'the group'}</strong>!</p>
                                <span className={styles.date}>Just now</span>
                            </div>
                        </div>
                    </div>
                </div>}
                {activeTab === 'groupwork' && <GroupworkContent groupId={groupId} isOwner={isOwner} />}
                {activeTab === 'people' && <PeopleContent groupId={groupId} />}
            </div>
        </div>
    );
}

export default GroupPage;