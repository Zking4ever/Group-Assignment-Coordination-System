import styles from './09Task-Detail-Page.module.css'
import React, { useEffect, useState } from 'react'
import { fetchAssignments, fetchTasks, fetchUsers, updateTask } from '../../services/authService'
import Header from '../../Components/Header-Component/Header-Component.jsx'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

function TaskDetail() {

    const [task, setTask] = useState(null);
    const [user, setUser] = useState(null);
    const [isResponsible, setResponsible] = useState(false);
    const [isLeader, setLeader] = useState(false);
    const [hasRequest, setRequest] = useState(false);
    const [expired, setexpired] = useState(false);


    useEffect(() => {
        const loadTasks = async () => {
            try{
                const currentUser = JSON.parse(localStorage.getItem("currentUser"));
                if(!currentUser) return;
                const currentTask = JSON.parse(localStorage.getItem("currentTask"));
                if(!currentTask) return;
                const currentAssignment = JSON.parse(localStorage.getItem("currentAssignment"));
                if(!currentAssignment) return;

                const { response: taskResponse, data: taskData } = await fetchTasks();
                if(!taskResponse.ok) return;

                const newTask = taskData.find(t => t.id === currentTask.id);

                if(!newTask) return;

                setTask(newTask);

                if(currentUser.id === newTask.responsibleMember){
                    setResponsible(true);
                }

                const { response: assignmentResponse, data: assignmentData } = await fetchAssignments();
                if(!assignmentResponse.ok) return;

                const assignment = assignmentData.find(a => a.creatorId === currentUser.id);

                if(!assignment) return;

                if(assignment.creatorId === currentUser.id){
                    setLeader(true);
                }

                if(newTask.state === "REQUESTED"){
                    setRequest(true);
                }

                if(new Date().toISOString().split("T")[0] > newTask.deadLine)
                {
                    setexpired(true);
                }
            }
            catch(error){
                alert(error.message);
            }
        }; loadTasks();
    }, []);


     useEffect(() => {
            const loadUser = async () => {
                try{
                    const { response, data } = await fetchUsers();
                    if(!response.ok) return;
                    if(!task) return;
                    const responsible = data.find(u => u.id === task.responsibleMember);
                    if (responsible){
                        setUser(responsible);
                    }
                }
                catch(error){
                    alert(error.message);
                }
            }; loadUser();
        }, [task]);


        const submitTask = async () => {

            const updatedTask = {
                ...task,
                state: "REQUESTED",
            };
            setTask(updatedTask);

            try{
                const { response, data } = await updateTask(task.id, updatedTask);

                if(response.ok){
                    alert("Task submission requested to the group leader");
                }
                else{
                    alert(data.message);
                }
            }
            catch(error){
                alert("Submission request failed, pls try again!"+error.message);
            }
        };


        const approve = async () => {

            const updatedTask = {
                ...task,
                state: "DONE",
            };
            setTask(updatedTask);
            
            try{
                const { response, data } = await updateTask(task.id, updatedTask);
                if(response.ok){
                    alert("Task is completed!");
                    setRequest(false);
                }
                else{
                    alert(data.message || "UNKNOWN ERROR");
                }
            }
            catch(error){
                alert(error.message);
            }
        };


        const decline = async () => {
            
            const updatedTask = {
                ...task,
                state: "YET",
            };
            setTask(updatedTask);
            
             try{
                const { response, data } = await updateTask(task.id, updatedTask);
                if(response.ok){
                    alert("Task is not completed!");
                    setRequest(false);
                }
                else{
                    alert(data.message || "UNKNOWN ERROR");
                }
            }
            catch(error){
                alert(error.message);
            }
        };
        

    return (
        <>
            <Header/>
            <h1 className={styles.myh1}>Task Detail</h1>
            <div className={styles.detailPart}>
                <p>Task Name: {task?.taskName}</p>
                <p>Description: {task?.taskDescription}</p>
                <p>Assigned to:{user?.firstName} {user?.lastName}</p>
                <p> User username: {user?.username} </p>
                <p>DeadLine: {task?.deadLine}</p>
                <p>Task state: {task?.state}</p>
                { isLeader && hasRequest && (
                    <>
                        <div className={styles.request}>
                            <h3>The reponsible member claims that he/she has completed this task. Do you approve or not?</h3>
                            <button className={styles.approve} onClick={approve}>Approve</button>
                            <button className={styles.decline} onClick={decline}>NOT YET</button>
                        </div>
                    </>
                )}
                
            </div>
            {
                expired && (
                    <>
                        <h3>This task has passed it's submission date</h3>
                    </>
                )
            }
            { isResponsible && task?.state !== "DONE" && (
                <><div className={styles.submitTask} onClick={submitTask}>
                    <FontAwesomeIcon icon={faCheck}/>
                </div>
                </>
            )}
            {
                task?.state === "DONE" && (
                    <>
                        <h3 className={styles.completedTask}>This task is completed!</h3>
                    </>
                )
            }
        </>
    );
}

export default TaskDetail