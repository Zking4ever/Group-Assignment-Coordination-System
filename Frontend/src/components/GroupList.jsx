import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast';
import { getMyGroups, deleteGroup } from '@services/Service.js'
import GroupCard from '@components/GroupCard.jsx'
import '../assets/css/GroupList.css';

function GroupList() {
    const navigate = useNavigate();
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const {data: userGroups} = await getMyGroups();
                setGroups(userGroups);
            } catch (error) {
                console.error("Failed to load group data:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleDelete = async (groupId) => {
        if (!window.confirm("Are you sure you want to delete this group?")) return;
        try {
            const response  = await deleteGroup(groupId);
            if (response.ok) {
                setGroups(prev => prev.filter(group => group.id !== groupId));
                toast.success("Group deleted successfully");
            } else {
                toast.error("Failed to delete group");
            }
        } catch (error) {
            toast.error("Error deleting group: " + error.message);
        }
    };

    if (loading) return <div className={"GroupList-loading"}>Loading classes...</div>;

    return (
        <div className={"GroupList-gridContainer"}>
            {groups.length === 0 ? (
                <div className={"GroupList-emptyState"}>
                    <h2>No Groups here</h2>
                    <p>Click the + button in the top right to create or join a class.</p>
                </div>
            ) : (
                <div className={"GroupList-grid"}>
                    {groups.map((group) => (
                        <GroupCard
                            key={group.id}
                            id={group.id}
                            title={group.groupName}
                            creatorId={group.creatorId}
                            onDelete={() => handleDelete(group.id)}
                            isCreator={group.creatorId === JSON.parse(localStorage.getItem("currentUser"))?.id}
                        />)
                    )}
                </div>
            )}
        </div>
    );
}

export default GroupList;
