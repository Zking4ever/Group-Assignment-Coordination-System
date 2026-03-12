import styles from './Member-List-Component.module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import URLPage from '../URL-Page-Component/URL-Page-Component.jsx'
import React, { useState, useEffect } from 'react'
import MemberCard from '../Member-Card-Component/Member-Card-Component.jsx'
import { fetchGroups, fetchUsers } from '../../../services/authService'

function MembersContent(){

    const [toggleURL, setToggle] = useState(false);
    const [members, setMembers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [isOwner, setOwner] = useState(false);
    

    const addIcon = () => {
        setToggle(!toggleURL);
    }

    useEffect(() => {
        const loadData = async () => {
            try {
                const { response: groupRes, data: groups } = await fetchGroups();
                const { response: userRes, data: users } = await fetchUsers();

                if(groupRes.ok && userRes.ok){
                    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

                    const currentGroup = JSON.parse(localStorage.getItem("currentGroup"));

                   const group = groups.find(g => g.id === currentGroup.id);

                   if(currentUser.id === group.creatorId){
                    setOwner(true);
                   }
                   else{
                    setOwner(false);
                   }

                    if(group){
                        setMembers(group.members || []);
                    }
                }
                setAllUsers(users);
            } 
            catch(error){
                console.error(error);
            }
        };

        loadData();
    }, []);
    

    return (
        <>
            <div className={styles.container}>
                {members.map(id => {
                    const user = allUsers.find(u => u.id === id);

                    if(!user) return null;

                    return <MemberCard key={id} user={user}/>
                })}
            </div>
           {
            isOwner && (
                 <div className={styles.urlbox}>
                <FontAwesomeIcon icon={faPlus} className={styles.addMember} onClick={addIcon}/>
                { toggleURL && <URLPage className={styles.urlbox}/> }
            </div>
            )
           }
        </>
    );
}

export default MembersContent