import React, { useState, useEffect } from 'react';
import { fetchAssignments, deleteAssignment } from '../../../services/authService';
import styles from './Assignment-Home-Component.module.css';
import AssignmentCard from '../Assignment-Card-Component/Assignment-Card-Component.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

function GroupworkContent({ groupId, isOwner }) {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            try {
                const { data: assData } = await fetchAssignments();
                const groupAssignments = assData.filter(a => a.parentGroup === groupId);
                setAssignments(groupAssignments);
            } catch (error) {
                console.error("Error loading groupwork:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [groupId]);

    const handleDelete = async (id) => {
        if (!window.confirm("Delete assignment and all its tasks?")) return;
        try {
            await deleteAssignment(id);
            setAssignments(prev => prev.filter(a => a.id !== id));
        } catch (error) {
            alert(error.message);
        }
    };

    if (loading) return <div>Loading groupwork...</div>;

    return (
        <div className={styles.classwork}>
            {isOwner && (
                <div className={styles.actionBar}>
                    <button 
                        className={styles.createButton} 
                        onClick={() => navigate(`/group/${groupId}/createAssignment`)}
                    >
                        <FontAwesomeIcon icon={faPlus} style={{ marginRight: '8px' }} />
                    Create
                    </button>
                </div>
            )}

            <div className={styles.assignmentList}>
                {assignments.length === 0 ? (
                    <div className={styles.empty}>No assignments yet</div>
                ) : (
                    assignments.map(ass => (
                        <AssignmentCard
                            key={ass.id}
                            assignment={ass}
                            // We don't render tasks here anymore; clicking the card goes to detail
                            onClick={() => navigate(`/group/${groupId}/assignment/${ass.id}`)}
                            onDelete={isOwner ? () => handleDelete(ass.id) : null}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default GroupworkContent;