import styles from './Assignment-Create-Component.module.css'
import React, { useState } from 'react'
import { createNewAss } from '../../../services/authService'

function CreateContent({ setPage }){

        const [assignmentName, setName] = useState("");
        const [description, setDescription] = useState("");
        const [loading, setLoading] = useState(false);

    const createAssignment = async (e) => {
        e.preventDefault();

        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        const currentGroup = JSON.parse(localStorage.getItem("currentGroup"));
        if (!currentUser) {
            alert("User not logged in!");
            return;
        }

        if (!currentGroup) {
            alert("No group selected!");
            return;
        }

        if(assignmentName === ""){
            alert("Assignment name can not be empty!");
            return;
        }

        if(loading) return;
        setLoading(true);

        const newAssignemnt = {
            assignmentName: assignmentName,
            assignmentDescription: description,
            creator: currentUser.username,
            creatorId: currentUser.id,
            parentGroup: currentGroup.id,
            id: `${currentGroup.id}${Date.now()}`
        }

        try{
            const { response, data } = await createNewAss(newAssignemnt);
            if(response.ok){
                
                alert("Assignment was created successfully");
                setPage("home");
            }
            else{
                alert(data.message || "Couldn't create the Assignment");
            }
        }
        catch(error){
            alert(error.message);
        }
        finally{
            setLoading(false);
        }

    }

    const handleName = (e) => {
        setName(e.target.value);
    }

    const handleDescription = (e) => {
        setDescription(e.target.value);
    }

    return (
        <>
            <h1>Create new assignment</h1>
            <form className={styles.formContainer} onSubmit={createAssignment}>
                <div>
                <label className={styles.lbl}>
                    Assignment name:
                </label>
                <input type="text" className={styles.inp} placeholder="Enter your new assignment name" onChange={handleName}/>
            </div>
            <div>
                <label className={styles.lbl}>
                    Description:
                </label>
                <textarea type="text" placeholder="Enter your description" onChange={handleDescription}/>
            </div>
            <button type="submit" className={styles.btn}>Create Assignment</button>
            </form>
        </>
    );
}

export default CreateContent