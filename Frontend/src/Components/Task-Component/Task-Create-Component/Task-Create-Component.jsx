import styles from './Task-Create-Component.module.css'
import { fetchUsers, createNewTask, fetchGroups } from '../../../services/authService';
import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faAlignLeft, faUserCircle, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

function CreateTask() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [taskDetail, setDetail] = useState({
        taskName: "",
        taskDescription: "",
        responsibleMember: "",
        startDate: new Date().toISOString().split("T")[0],
        deadLine: "",
        state: "YET",
    });

    useEffect(() => {
        const loadMembers = async () => {
            const currentGroup = JSON.parse(localStorage.getItem("currentGroup"));
            if (!currentGroup) return;

            try {
                const { data: groupsData } = await fetchGroups();
                const curGroup = groupsData.find(g => g.id === currentGroup.id);
                const { data: usersData } = await fetchUsers();
                const groupMembers = usersData.filter(u => curGroup?.members.includes(u.id));
                setUsers(groupMembers);
            } catch (error) {
                console.error(error);
            }
        }; 
        loadMembers();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDetail(prev => ({ ...prev, [name]: value }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;

        const currentAssignment = JSON.parse(localStorage.getItem("currentAssignment"));
        if (!currentAssignment) {
            alert("No assignment context found.");
            return;
        }

        setLoading(true);
        try {
            const newTask = {
                ...taskDetail,
                parentAssignment: currentAssignment.id
            };
            const { response } = await createNewTask(newTask);
            if (response.ok) {
                navigate(-1); // Go back to group page
            } else {
                alert("Failed to create task.");
            }
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <button className={styles.closeBtn} onClick={() => navigate(-1)}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                    <h2>Assignment detail</h2>
                </div>
                <button 
                    className={styles.assignBtn} 
                    onClick={handleSubmit}
                    disabled={loading || !taskDetail.taskName || !taskDetail.responsibleMember}
                >
                    {loading ? 'Assigning...' : 'Assign'}
                </button>
            </header>

            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.mainColumn}>
                    <div className={styles.inputGroup}>
                        <input 
                            type="text" 
                            name="taskName"
                            placeholder="Title" 
                            className={styles.titleInput}
                            value={taskDetail.taskName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <div className={styles.iconLabel}>
                            <FontAwesomeIcon icon={faAlignLeft} />
                            <span>Instructions (optional)</span>
                        </div>
                        <textarea 
                            name="taskDescription"
                            placeholder="Add instructions" 
                            className={styles.descriptionInput}
                            value={taskDetail.taskDescription}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className={styles.sideColumn}>
                    <div className={styles.settingsGroup}>
                        <div className={styles.setting}>
                            <label>For</label>
                            <div className={styles.selector}>All students</div>
                        </div>
                        
                        <div className={styles.setting}>
                            <label>Assignee</label>
                            <select 
                                name="responsibleMember" 
                                value={taskDetail.responsibleMember} 
                                onChange={handleChange} 
                                className={styles.select}
                                required
                            >
                                <option value="">Select member</option>
                                {users.map(u => (
                                    <option key={u.id} value={u.id}>{u.firstName} {u.lastName}</option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.setting}>
                            <label>Due</label>
                            <input 
                                type="date" 
                                name="deadLine"
                                className={styles.dateInput}
                                value={taskDetail.deadLine}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className={styles.setting}>
                            <label>Status</label>
                            <select 
                                name="state" 
                                value={taskDetail.state} 
                                onChange={handleChange} 
                                className={styles.select}
                            >
                                <option value="YET">Yet to start</option>
                                <option value="WORKING">Working</option>
                                <option value="DONE">Done</option>
                            </select>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default CreateTask;