import styles from './GroupJoin.module.css'
import React, { useState, useEffect } from 'react'
import { joinGroupByCode } from '../../../services/authService'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

function GroupJoin({ setView }) {
    const navigate = useNavigate();
    const [classCode, setClassCode] = useState("");
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("currentUser"));
        setCurrentUser(user);
    }, []);

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        if (!classCode.trim()) return;
        
        setLoading(true);
        try {
            const { response, data } = await joinGroupByCode(classCode, currentUser.id);
            if (response.ok) {
                navigate(`/group/${data.groupId}`);
            } else {
                alert(data.error || "Failed to join group. Please check the code.");
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
                            <button className={styles.switchBtn} onClick={() => navigate('/login')}>Switch account</button>
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
                        <h4>To join with a group code</h4>
                        <ul>
                            <li>Use an authorized account</li>
                            <li>Use a group code with 6-7 letters or numbers, and no spaces or symbols</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GroupJoin;
