import AssignmentCard from '../Assignment-Card-Component/Assignment-Card-Component.jsx'
import React, { useState, useEffect } from 'react'
import { fetchAssignments, deleteAssignment } from '../../../services/authService'
import styles from './Assignment-Home-Component.module.css'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

function HomeContent(){

    const navigate = useNavigate();

    const [assignments, setGroups] = useState([]);

    useEffect(
        () => {
            const loadGroups = async () => {
                try{
                    const { response, data } = await fetchAssignments();
                   
                    if(response.ok){
                        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
                        const currentGroup = JSON.parse(localStorage.getItem("currentGroup"));
                        if (!currentUser || !currentGroup) return;
                        const userAssignments = data.filter(assignment => assignment.parentGroup === currentGroup.id);
                        setGroups(userAssignments);
                    }
                }
                catch (error){
                    alert(error);
                }
            };

            loadGroups();
        }, []);

        const handleClick = (assignment) => {
            localStorage.setItem("currentAssignment", JSON.stringify({
                assignmentName: assignment.assignmentName,
                assignmentDescription: assignment.assignmentDescription,
                id: assignment.id,
                parentGroup: assignment.parentGroup
            }));

            navigate("/addTask");
        }

        const handleDelete = async (assignmentId) => {
            try{
                const { response, data } = await deleteAssignment(assignmentId);
                if(response.ok){
                    alert("assignment deleted successfully!");
                    setGroups(prev => prev.filter(assignment => assignment.id !== assignmentId));
                }
                else{
                    alert(data.message || "Failed to delete assignment");
                }
            }
            catch(error){
                alert(error.message);
            }
        };

    return(
        <>
            <div className={styles.container}>
                {assignments.length === 0 ? 
                    (<h2>No assignment yet</h2>) : 
                    (assignments.map((assignment) => (
                        <>
                            <div key={assignment.id}>
                                <div onClick={() => handleClick(assignment)}>
                                    <AssignmentCard title={assignment.assignmentName} description={assignment.assignmentDescription} groupId={assignment.id}/>
                                </div>

                                {assignment.creatorId === JSON.parse(localStorage.getItem("currentUser"))?.id &&
                                    (
                                    
                                     <div className={styles.trash} onClick={() => handleDelete(assignment.id)}>
                                         <FontAwesomeIcon icon={faTrash} />
                                     </div>
                                        
                                    )
                                }
                            </div>
                        </>
                    )))}
            </div>
        </>
    );
}

export default HomeContent