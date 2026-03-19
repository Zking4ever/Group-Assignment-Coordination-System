import React, { useState, useEffect } from 'react'
import { fetchGroups, deleteGroup, fetchUsers } from '../../../services/authService'
import styles from './Group-Home-Component.module.css'
import { useNavigate } from 'react-router-dom'
import GroupCard from '../Group-Card-Component/Group-Card-Component.jsx'

function HomeContent() {
    const navigate = useNavigate();
    const [groups, setGroups] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const { response: gResp, data: gData } = await fetchGroups();
                const { response: uResp, data: uData } = await fetchUsers();

                if (gResp.ok && uResp.ok) {
                    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
                    const userGroups = gData.filter(group => group.members.includes(currentUser.id));
                    setGroups(userGroups);
                    setUsers(uData);
                }
            } catch (error) {
                console.error("Failed to load dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const handleDelete = async (groupId) => {
        if (!window.confirm("Are you sure you want to delete this group?")) return;
        try {
            const { response } = await deleteGroup(groupId);
            if (response.ok) {
                setGroups(prev => prev.filter(group => group.id !== groupId));
            }
        } catch (error) {
            alert("Error deleting group: " + error.message);
        }
    };

    const getCreatorName = (creatorId) => {
        const user = users.find(u => u.id === creatorId);
        return user ? `${user.firstName} ${user.lastName}` : 'Unknown User';
    };

    if (loading) return <div className={styles.loading}>Loading classes...</div>;

    return (
        <div className={styles.gridContainer}>
            {groups.length === 0 ? (
                <div className={styles.emptyState}>
                    <h2>No Groups here</h2>
                    <p>Click the + button in the top right to create or join a class.</p>
                </div>
            ) : (
                <div className={styles.grid}>
                    {groups.map((group) => (
                        <GroupCard
                            key={group.id}
                            id={group.id}
                            title={group.groupName}
                            creator={getCreatorName(group.creatorId)}
                            onDelete={() => handleDelete(group.id)}
                            isCreator={group.creatorId === JSON.parse(localStorage.getItem("currentUser"))?.id}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default HomeContent;