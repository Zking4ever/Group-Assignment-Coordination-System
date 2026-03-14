import styles from './Group-Create-Component.module.css'
import React, { useState } from 'react'
import { createNewGroup } from '../../../services/authService'

function CreateContent({ setPage }){

        const [groupName, setName] = useState("");
        const [description, setDescription] = useState("");
        const [loading, setLoading] = useState(false);

    const createGroup = async (e) => {
        e.preventDefault();

        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (!currentUser) {
            alert("User not logged in!");
            return;
        }

        if(groupName === ""){
            alert("group name can not be empty!");
            return;
        }

        if(loading) return;
        setLoading(true);

        const newGroup = {
            groupName: groupName,
            groupDescription: description,
            creator: currentUser.username,
            creatorId: currentUser.id,
            id: `${currentUser.username}${Date.now()}`,
            members: [currentUser.id]
        }

        try{
            const { response, data } = await createNewGroup(newGroup);
            if(response.ok){
              
                alert("Group was created successfully");
                setPage("home");
            }
            else{
                alert(data.message || "Couldn't create a group");
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
            <h1>Create new group</h1>
            <form className={styles.formContainer} onSubmit={createGroup}>
                <div>
                <label className={styles.lbl}>
                    group name:
                </label>
                <input type="text" className={styles.inp} placeholder="Enter your new group name" onChange={handleName}/>
            </div>
            <div>
                <label className={styles.lbl}>
                    description:
                </label>
                <textarea type="text" placeholder="Enter your description" onChange={handleDescription}/>
            </div>
            <button type="submit" className={styles.btn}>Create group</button>
            </form>
        </>
    );
}

export default CreateContent