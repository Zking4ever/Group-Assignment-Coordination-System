import styles from './Group-Join-Component.module.css'
import React, { useState, useEffect } from 'react'
import { fetchGroups, joinGroup } from '../../../services/authService'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faTimes } from '@fortawesome/free-solid-svg-icons';

function JoinContent({ setView }) {
    const [classCode, setClassCode] = useState("");
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("currentUser"));
        setCurrentUser(user);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { response, data } = await fetchGroups();

            if (response.ok) {
                // In our new backend, inviteCode is what we should use for joining
                const group = data.find(g => g.inviteCode === classCode || g.id === classCode);

                if (!group) {
                    alert("No Group found with that code.");
                    return;
                }

                if (group.members.includes(currentUser.id)) {
                    alert("You are already a member of this Group.");
                    setView("home");
                    return;
                }

                const updatedMembers = [...group.members, currentUser.id];
                const result = await joinGroup(group.id, updatedMembers);

                if (result.response.ok) {
                    setView("home");
                }
            }
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <button className={styles.closeBtn} onClick={() => setView("home")}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                    <h2>Join Group</h2>
                    <button
                        className={styles.joinBtn}
                        onClick={handleSubmit}
                        disabled={loading || !classCode}
                    >
                        Join
                    </button>
                </div>

                <div className={styles.content}>
                    <div className={styles.userCard}>
                        <p>You're currently signed in as</p>
                        <div className={styles.userInfo}>
                            <FontAwesomeIcon icon={faUserCircle} className={styles.userIcon} />
                            <div className={styles.userText}>
                                <strong>{currentUser?.firstName} {currentUser?.lastName}</strong>
                                <span>{currentUser?.email}</span>
                            </div>
                            <button className={styles.switchBtn}>Switch account</button>
                        </div>
                    </div>

                    <div className={styles.codeCard}>
                        <h3>Group code</h3>
                        <p>Ask your fellows for the group code, then enter it here.</p>
                        <input
                            type="text"
                            value={classCode}
                            placeholder="Group code"
                            className={styles.input}
                            onChange={(e) => setClassCode(e.target.value)}
                        />
                    </div>

                    <div className={styles.infoSection}>
                        <h4>To sign in with a group code</h4>
                        <ul>
                            <li>Use an authorized account</li>
                            <li>Use a group code with 6-7 letters or numbers, and no spaces or symbols</li>
                        </ul>
                        <p>If you have trouble joining the group, go to the <a href="#">Help Center article</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default JoinContent;