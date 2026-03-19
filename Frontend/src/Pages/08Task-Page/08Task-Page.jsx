import styles from './08Task-Page.module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser, faHouse, faPlus } from "@fortawesome/free-solid-svg-icons";
import MembersPage from '../../Components/Assignment-List-Component/Member-List-Component/Member-List-Component.jsx'
import React, { useState, useEffect } from 'react'
import Home from '../../Components/Task-Component/Task-Home-Component/Task-Home-Component.jsx'
import AssignTask from '../../Components/Task-Component/Task-Create-Component/Task-Create-Component.jsx'
import { fetchAssignments } from '../../services/authService.js'
import Header from '../../Components/Header-Component/Header-Component.jsx'

function AddTaskPage(){

   const [selectedPage, setPage] = useState("home");
   const [isOwner, setOwner] = useState(false);

   useEffect(() => {
           const loadData = async () => {
               try {
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
   };


   return (
      <>
         <div className={styles.taskPageBody}>
            <div className={styles.taskPageTopFixedBarAll}>
               <div className={styles.taskPageHeader}>
                  <Header/>
               </div>
               
               <div className={styles.assignmentListNavContainerDiv}>
                  <nav className={styles.assignmentListNavContainer}>
                     <div className={styles.taskPageIcon}>
                        <input type="radio" name="bar" value="home" id="home" className={styles.homeIcon} checked={selectedPage === "home"} onChange={handleChange}/>
                           <label htmlFor="home">
                              <FontAwesomeIcon icon={faHouse} />
                              <div className={styles.taskPageIconLabel}>Tasks list</div>
                           </label> 
                     </div>


                     {
                     isOwner && (
                        <div className={styles.taskPageIcon}>
                           <input type="radio" name="bar" value="assignTask" id="assignTask" className={styles.createAssignment} checked={selectedPage === "assignTask"} onChange={handleChange}/>
                              <label htmlFor="assignTask">
                                 <FontAwesomeIcon icon={faPlus} />
                                 <div className={styles.taskPageIconLabel}>Create task</div>
                              </label>
                        </div>
                     )
                  }
                     <div className={styles.taskPageIcon}>
                        <input type="radio" name="bar" value="members" id="members" className={styles.homeIcon} checked={selectedPage === "members"} onChange={handleChange}/>
                           <label htmlFor="members">
                              <FontAwesomeIcon icon={faCircleUser} />
                              <div className={styles.taskPageIconLabel}>Members</div>
                           </label>
                     </div>
                  </nav>
               </div>
            </div>

            <main>
               <div className={styles.taskPageBodyBox}>
                  {selectedPage === "home" && <Home />}
                  {selectedPage === "assignTask" && <AssignTask setPage={setPage}/>}
                  {selectedPage === "members" && <MembersPage setPage={setPage}/>}
               </div>
            </main>
         </div>
      </>
   );
}

export default AddTaskPage