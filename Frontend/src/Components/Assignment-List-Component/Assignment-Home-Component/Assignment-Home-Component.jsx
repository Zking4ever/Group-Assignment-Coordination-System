import React, { useState, useEffect } from 'react';
import { fetchAssignments, fetchTasks, deleteAssignment } from '../../../services/authService';
import styles from './Assignment-Home-Component.module.css';
import AssignmentCard from '../Assignment-Card-Component/Assignment-Card-Component.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

function GroupworkContent() {
    const [assignments, setAssignments] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            try {
                const currentGroup = JSON.parse(localStorage.getItem("currentGroup"));
                const { data: assData } = await fetchAssignments();
                const { data: taskData } = await fetchTasks();

                const groupAssignments = assData.filter(a => a.parentGroup === currentGroup.id);
                setAssignments(groupAssignments);
                setTasks(taskData);
            } catch (error) {
                console.error("Error loading groupwork:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

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
            <div className={styles.actionBar}>
                <button className={styles.createButton} onClick={() => navigate('/addTask')}>
                    <FontAwesomeIcon icon={faPlus} style={{ marginRight: '8px' }} />
                    Create
                </button>
            </div>

            <div className={styles.assignmentList}>
                {assignments.length === 0 ? (
                    <div className={styles.empty}>No assignments yet</div>
                ) : (
                    assignments.map(ass => (
                        <AssignmentCard
                            key={ass.id}
                            assignment={ass}
                            tasks={tasks.filter(t => t.parentAssignment === ass.id)}
                            onDelete={() => handleDelete(ass.id)}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default GroupworkContent;