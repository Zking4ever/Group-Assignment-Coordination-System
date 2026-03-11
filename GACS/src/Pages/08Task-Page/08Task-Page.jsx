import styles from './08Task-Page.module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser, faHouse, faPlus } from "@fortawesome/free-solid-svg-icons";
import MembersPage from '../006GroupPage/MembersContent.jsx'
import React, { useState, useEffect } from 'react'
import Home from './HomeContent.jsx'
import AssignTask from './CreateTask.jsx'
import { fetchAssignments } from '../services/authService.js'
import Header from '../000Header/000Header.jsx'

function AddTaskPage(){

   const [selectedPage, setPage] = useState("home");
   const [isOwner, setOwner] = useState(false);

   useEffect(() => {
           const loadData = async () => {
               try {
                  //  const { response: groupRes, data: groups } = await fetchGroups();
                     
                  //  if(groupRes.ok){
                  //      const currentUser = JSON.parse(localStorage.getItem("currentUser"));

                  //      const currentGroup = JSON.parse(localStorage.getItem("currentGroup"));
   
                  //     const group = groups.find(g => g.id === currentGroup.id);
   
                  //     if(currentUser.id === ggg.creatorId){
                  //      setOwner(true);
                  //     }
                  //     else{
                  //      setOwner(false);
                  //     }
                  //  }

                  const { response: assignmentRes, data: assignments } = await fetchAssignments();
                     
                   if(assignmentRes.ok){
                       const currentUser = JSON.parse(localStorage.getItem("currentUser"));

                       const currentAssignment = JSON.parse(localStorage.getItem("currentAssignment"));
   
                      const assignment = assignments.find(g => g.id === currentAssignment.id);
   
                      if(currentUser.id === assignment.creatorId){
                       setOwner(true);
                      }
                      else{
                       setOwner(false);
                      }
                   }
               } 
               catch(error){
                   console.error(error);
               }
           };
   
           loadData();
       }, []);

   const handleChange = (e) => {
      setPage(e.target.value);
   }

   return (
      <>
          <Header/>
         
         <nav className={styles.topNav}>
            <input type="radio" name="bar" value="home" id="home" className={styles.homeIcon} checked={selectedPage === "home"} onChange={handleChange}/>
               <label htmlFor="home">Tasks list
                  <FontAwesomeIcon icon={faHouse} />
               </label> 
            {/* home icon and nothing in mind for now */}

            {
            isOwner && (
                 <>
                  <input type="radio" name="bar" value="assignTask" id="assignTask" className={styles.createAssignment} checked={selectedPage === "assignTask"} onChange={handleChange}/>
                  <label htmlFor="assignTask">Create new task
                     <FontAwesomeIcon icon={faPlus} />
                  </label>
                 </>
            )
           }

            
             <input type="radio" name="bar" value="members" id="members" className={styles.homeIcon} checked={selectedPage === "members"} onChange={handleChange}/>
               <label htmlFor="members">Members
                  <FontAwesomeIcon icon={faCircleUser} />
               </label>
         </nav>

         <main className={styles.mainContainer}>
            {selectedPage === "home" && <Home />}
            {selectedPage === "assignTask" && <AssignTask setPage={setPage}/>}
            {selectedPage === "members" && <MembersPage setPage={setPage}/>}
         </main>
      </>
   );
}

export default AddTaskPage





{/* <nav className={styles.topNav}>
                           <input type="radio" name="bar" value="home" id="home" className={styles.homeIcon} checked={selectedPage === "home"} onChange={handleChange}/>
                              <label htmlFor="home">
                                 <FontAwesomeIcon icon={faHouse} />
                              </label> 
                           {/* home icon and nothing in mind for now */}
                          
            //                <input type="radio" name="bar" value="createAssignment" id="createAssignment" className={styles.createAssignment} checked={selectedPage === "createAssignment"} onChange={handleChange}/>
            //                   <label htmlFor="createAssignment">
            //                      <FontAwesomeIcon icon={faPlus} />
            //                   </label>
            //                 <input type="radio" name="bar" value="members" id="members" className={styles.homeIcon} checked={selectedPage === "members"} onChange={handleChange}/>
            //                   <label htmlFor="members">
            //                      <FontAwesomeIcon icon={faCircleUser} />
            //                   </label>
            // </nav> */}