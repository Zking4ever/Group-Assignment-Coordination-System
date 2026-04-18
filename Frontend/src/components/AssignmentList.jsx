import { useState, useEffect } from 'react';
import { fetchAssignments, deleteAssignment } from '@services/authService';
import '../assets/css/AssignmentList.css';
import AssignmentCard from '@components/AssignmentCard.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Modal from './Modal';

function AssignmentList({ groupId, isOwner }) {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [assToDelete, setAssToDelete] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            try {
                const { data: assData } = await fetchAssignments();
                const groupAssignments = assData.filter(a => a.parentGroup === groupId);
                setAssignments(groupAssignments);
            } catch (error) {
                console.error("Error loading assignments:", error);
                toast.error("Failed to load assignments");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [groupId]);

    const handleDeleteClick = (id) => {
        setAssToDelete(id);
        setIsModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!assToDelete) return;
        try {
            await deleteAssignment(assToDelete);
            setAssignments(prev => prev.filter(a => a.id !== assToDelete));
            toast.success("Assignment deleted");
            setIsModalOpen(false);
            setAssToDelete(null);
        } catch (error) {
            toast.error(error.message);
        }
    };

    if (loading) return <div>Loading assignments...</div>;

    return (
        <div className={"AssignmentList-classwork"}>
            {isOwner && (
                <div className={"AssignmentList-actionBar"}>
                    <button 
                        className={"AssignmentList-createButton"} 
                        onClick={() => navigate(`/group/${groupId}/createAssignment`)}
                    >
                        <FontAwesomeIcon icon={faPlus} style={{ marginRight: '8px' }} />
                        Create
                    </button>
                </div>
            )}

            <div className={"AssignmentList-assignmentList"}>
                {assignments.length === 0 ? (
                    <div className={"AssignmentList-empty"}>No assignments yet</div>
                ) : (
                    assignments.map(ass => (
                        <AssignmentCard
                            key={ass.id}
                            assignment={ass}
                            onClick={() => navigate(`/group/${groupId}/assignment/${ass.id}`)}
                            onDelete={isOwner ? () => handleDeleteClick(ass.id) : null}
                        />
                    ))
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Delete Assignment"
                footer={(
                    <>
                        <button className="Modal-btn Modal-btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                        <button className="Modal-btn Modal-btn-danger" onClick={confirmDelete}>Delete</button>
                    </>
                )}
            >
                <p>Are you sure you want to delete this assignment and all its tasks? This action cannot be undone.</p>
            </Modal>
        </div>
    );
}

export default AssignmentList;
