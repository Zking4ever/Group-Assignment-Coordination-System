import GroupCard from '../Group-Card-Component/Group-Card-Component.jsx'
import React, { useState, useEffect } from 'react'
import { fetchGroups, deleteGroup } from '../../../services/authService'
import styles from './Group-Home-Component.module.css'
import { useNavigate  } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";


function HomeContent(){

    const navigate = useNavigate();

    const [groups, setGroups] = useState([]);

    useEffect(
        () => {
            const loadGroups = async () => {
                try{
                    const { response, data } = await fetchGroups();

                    if(response.ok){
                        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
                        const userGroups = data.filter(group => group.members.includes(currentUser.id));
                        setGroups(userGroups);
                    }
                }
                catch (error){
                    alert(error);
                }
            };

            loadGroups();
        }, []);

        const handleClick = (group) => {
           localStorage.setItem("currentGroup", JSON.stringify({
                    id: group.id
                }));
        navigate("/group");
    }

        const handleDelete = async (groupId) => {
            try{
                const { response, data } = await deleteGroup(groupId);
                if(response.ok){
                    alert("Group deleted successfully!");
                    setGroups(prev => prev.filter(group => group.id !== groupId));
                }
                else{
                    alert(data.message || "Failed to delete group");
                }
            }
            catch(error){
                alert(error.message);
            }
        };

    return(
        <>
            <div className={styles.container}>
                {groups.length === 0 ? 
                    (<h2>No groups yet</h2>) : 
                    (groups.map((group) => (
                        <>
                            <div key={group.id}>
                            <div onClick={() => handleClick(group)}>
                                <GroupCard title={group.groupName} description={group.groupDescription}/>
                            </div>
                            <div className={styles.trash} onClick={() => handleDelete(group.id)}>
                                <FontAwesomeIcon icon={faTrash} />
                            </div>
                            </div>
                        </>
                    )))}
            </div>
        </>
    );
}

export default HomeContent