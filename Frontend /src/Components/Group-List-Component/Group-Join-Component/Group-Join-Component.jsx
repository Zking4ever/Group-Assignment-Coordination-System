import styles from './Group-Join-Component.module.css'
import React, { useState } from 'react'
import { fetchGroups, joinGroup } from '../../../services/authService'

function JoinContent({ setPage }){

    const [referral, setReferral] = useState("");

    const handleChange = (e) => {
        setReferral(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const currentUser = JSON.parse(localStorage.getItem("currentUser"));

        const { response, data } = await fetchGroups();

        if(response.ok){
            const group = data.find(g => g.id === referral);

            if(!group){
                alert("Group not found");
                return;
            }

            if(group.members.includes(currentUser.id)){
                alert("Already member of the group!");
                return;
            }

            const updateMembers = [...group.members, currentUser.id];

            const result = await joinGroup(group.id, updateMembers);

            if(result.response.ok){
                alert("Joined group successfully!");
                setPage("home");
            }
        }
    };

    return(
        <>
            <form onSubmit={handleSubmit} className={styles.container}>
                <input type="text" value={referral} placeholder="Please enter refferal code from the creator of the group owner" className={styles.inp} onChange={handleChange}/>
                <button type="submit" className={styles.btn}>Join</button>
            </form>
        </>
    );
}

export default JoinContent