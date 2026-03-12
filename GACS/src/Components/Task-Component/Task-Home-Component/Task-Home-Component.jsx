import styles from './Task-Home-Component.module.css'
import TaskCard from '../Task-Card-Component/Task-Card-Component.jsx'
import React, { useState, useEffect } from 'react'
import { fetchTasks, fetchAssignments, fetchUsers, deleteTask } from '../../../services/authService'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

function HomeContent(){

    const navigate = useNavigate();

    const [tasks, setTasks] = useState([]);
    const [allTasks, setAll] = useState(true);
    const [myTasks, setMyTasks] = useState([]);
    const [leader, setLeader] = useState(null);
    const [users, setUser] = useState([]);

    useEffect(() => {
        const loadTasks = async () => {
            try{
                const { response: tasksResponse, data: tasksData } = await fetchTasks();
                if(!tasksResponse.ok) return;
                const { response: assignmentsResponse, data: assignmentsData } = await fetchAssignments();
                if(!assignmentsResponse.ok) return;
                const { response: userResponse, data: userData } = await fetchUsers();
                if(!userResponse.ok) return;
                const currentAssignment = JSON.parse(localStorage.getItem("currentAssignment"));
                if(!currentAssignment) return;
                const currentUser = JSON.parse(localStorage.getItem("currentUser"));
                if(!currentUser) return;
                const currentAss = assignmentsData.find(a => a.id === currentAssignment.id);
                if(!currentAss) return;
                        
                setUser(userData);  

                const leaderAcc = userData.find(u => u.id === currentAss.creatorId);
                
                if(leaderAcc){
                    setLeader(leaderAcc);
                }

                const currentTasks = tasksData.filter(t => t.parentAssignment === currentAssignment.id);
                setTasks(currentTasks);

                const thisUserTasks = tasksData.filter(d => d.responsibleMember === currentUser.id);
                setMyTasks(thisUserTasks);
            }
            catch(error){
                alert(error.message);
            }
        }; loadTasks();
    },[]);

    const goToDetail = (task) => {
        localStorage.setItem("currentTask", JSON.stringify({
            id: task.id
        }));
        navigate("/taskDetail");
    }

    const allTasksOn = () => {
        setAll(true);
    };

    const allTasksOff = () => {
        setAll(false);
    };

    const handleDelete = async (taskId) => {
        try{
            const { response, data } = await deleteTask(taskId);
            if(response.ok){
                alert("task deleted successfully!");
                setTasks(prev => prev.filter(task => task.id !== taskId));
                setMyTasks(prev => prev.filter(task => task.id !== taskId));
            }
            else{
                alert(data.message || "Failed to delete task");
            }
        }
        catch(error){
            alert(error.message);
        }
    }


    

    return (
        <>
            <div className={styles.topics}>
                <label className={`${allTasks ? styles.selected : styles.topicLabels}`} onClick={allTasksOn}>Tasks</label>
                <label className={`${!allTasks ? styles.selected : styles.topicLabels}`} onClick={allTasksOff}>My tasks</label>
            </div>
            <div>
                ASSIGNMENT LEADER: {leader?.firstName} {leader?.lastName}
            </div>

            {
                allTasks && (
                    <> 
                    {tasks.length === 0 ? 
                        (<h3 className={styles.nullTask}>NO TASKS!</h3>) : 
                        (tasks.map(task => (
                            
                                <div key={task.id}>
                                    <div onClick={() => goToDetail(task)}>
                                        <TaskCard passedTask={task} user={users.find(u => u.id === task.responsibleMember)} leader={leader}/>
                                    </div>
                                    <div className={styles.trash} onClick={() => handleDelete(task.id)}>
                                        <FontAwesomeIcon icon={faTrash}/>
                                    </div>
                                </div>
                            
                                )))
                    }
                    </>
                )
            }

            {
                !allTasks && (
                    <>
                        {myTasks.length === 0 ? 
                        (<h3 className={styles.nullTask}>NO TASK FOR YOU!</h3>) : 
                        (myTasks.map(task => (
                            
                                <div key={task.id}>
                                    <div onClick={() => goToDetail(task)}>
                                        <TaskCard passedTask={task} user={users.find(u => u.id === task.responsibleMember)}/>
                                    </div>
                                    <div className={styles.trash} onClick={() => handleDelete(task.id)}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </div>
                                </div>
                            
                        )))
                            }
                    </>
                )
            }
        </>
    );
}

export default HomeContent