import styles from './Task-Create-Component.module.css'
import { fetchUsers, createNewTask, fetchGroups } from '../../../services/authService';
import React, { useState, useEffect } from 'react'

function CreateTask({ setPage }){

    const [users, setUsers] = useState([]);
    const possibleState = ["YET", "PENDING", "REQUESTED" ,"EXPIRED", "DONE"];
    const [taskDetail, setDetail] = useState({
        taskName:"",
        taskDescription:"",
        responsibleMember:"",
        startDate: "",
        deadLine:"",
        parentAssignment:"",
        state:"",
        id:"",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setDetail(prev => ({
            ...prev,
            [name]: value
        }));
    }

    useEffect(() => {
        const loadMembers = async () => {
            const currentGroup = JSON.parse(localStorage.getItem("currentGroup"));

            try{
                const { response: groupsResponse, data: groupsData } = await fetchGroups();
                if(!groupsResponse.ok) return;

                const curGroup = groupsData.find(g => g.id === currentGroup.id);
                
                const { response: usersResponse, data: usersData } = await fetchUsers();
                if(!usersResponse.ok) return;

                const groupMembers = usersData.filter(u => curGroup.members.includes(u.id));

                setUsers(groupMembers);
            }
            catch(error){
                alert(error.message);
            }
    }; loadMembers();
    }, []);

    const createTask = async (e) => {
        e.preventDefault();

        if(taskDetail.startDate === taskDetail.deadLine){
            alert("Start date and deadline can not be the same date");
            return;
        }

        const currentAssignment = JSON.parse(localStorage.getItem("currentAssignment"));
        const newTask = {
            ...taskDetail,
            parentAssignment: currentAssignment.id,
            id: `${currentAssignment.id}${Date.now()}`
        }
        
        try{
            const { response, data } = await createNewTask(newTask);

            if(response.ok){
                alert("Task assigned successfully!");
                setPage("home");
            }
            else{
                alert(data.message);
            }
        }
        catch(error){
            alert("Unknown error: "+error.message);
        }
    }

    return(
        <>
            <form onSubmit={createTask} className={styles.formContainer}>
                <h1>Create task page</h1>
                <div className={styles.taskName}>
                    <label>Task Name: </label>
                    <input type="text" name="taskName" placeholder="Enter the task name" value={taskDetail.taskName} onChange={handleChange} required/>
                </div>
                <div className={styles.taskName}>
                    <label>Description: </label>
                    <textarea name="taskDescription" placeholder="Enter the description" value={taskDetail.taskDescription} onChange={handleChange}/>
                </div>
                <div className={styles.taskName}>
                    <label>Responsible member : </label>
                    <select name="responsibleMember" value={taskDetail.responsibleMember} onChange={handleChange} required>
                    <option value="">Select member</option>
                    {users.map(u => (<option key={u.id} value={u.id}>{u.firstName} {u.lastName}</option>))}
                </select>
                </div>
                <div className={styles.taskName}>
                    <label>Progress level/state: </label>
                    <select name="state" value={taskDetail.state} onChange={handleChange} required>
                    <option value="">Select state</option>
                    {possibleState.map(s => (<option key={s} value={s}>{s}</option>))}
                </select>
                </div>
                <div className={styles.taskName}>
                    <label>Start date: </label>
                   <input type="date" name="startDate" value={taskDetail.startDate} min={new Date().toISOString().split("T")[0]} onChange={handleChange} required/>
                </div>
                <div className={styles.taskName}>
                    <label>Deadline: </label>
                   <input type="date" name="deadLine" value={taskDetail.deadLine} onChange={handleChange} required/>
                </div>
                

                <button type="submit">Create task</button>
            </form>
        </>
    );
}

export default CreateTask