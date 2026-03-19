import React, { useState, useEffect } from 'react'
import styles from './06Assignment-List-Page.module.css'
import GroupworkContent from '../../Components/Assignment-List-Component/Assignment-Home-Component/Assignment-Home-Component.jsx'
import PeopleContent from '../../Components/Assignment-List-Component/Member-List-Component/Member-List-Component.jsx'
import StreamContent from './StreamContent.jsx'; // We'll create this

function GroupPage() {
    const [activeTab, setActiveTab] = useState("stream");
    const [groupName, setGroupName] = useState("Loading...");

    useEffect(() => {
        const currentGroup = JSON.parse(localStorage.getItem("currentGroup"));
        if (currentGroup) {
            setGroupName(currentGroup.name || "Group View");
        }
    }, []);

    return (
        <div className={styles.groupContainer}>
            <div className={styles.groupHeader} style={{ backgroundColor: '#1a73e8' }}>
                <div className={styles.groupHeaderContent}>
                    <h1>{groupName}</h1>
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
                {activeTab === 'stream' && <StreamContent />}
                {activeTab === 'groupwork' && <GroupworkContent />}
                {activeTab === 'people' && <PeopleContent />}
            </div>
        </div>
    );
}

export default GroupPage;