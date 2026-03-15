import styles from './06Assignment-List-Page.module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser, faHouse, faPlus } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from 'react'
import HomeContent from '../../Components/Assignment-List-Component/Assignment-Home-Component/Assignment-Home-Component.jsx'
import MembersContent from '../../Components/Assignment-List-Component/Member-List-Component/Member-List-Component.jsx'
import CreateContent from '../../Components/Assignment-List-Component/Assignment-Create-Component/Assignment-Create-Component.jsx'
import Header from '../../Components/Header-Component/Header-Component.jsx'

function GroupPage(){

    const [selectedPage, setPage] = useState("home");

    const handleChange = (e) => {
        setPage(e.target.value);
    }

    return(
        <>
           <div className={styles.assignmentListBody}>
             <div className={styles.assignmentListTopFixedBarAll}>
               <div className={styles.groupListHeader}>
                     <Header/>
               </div>

               <div className={styles.assignmentListNavContainerDiv}>
                  <nav className={styles.assignmentListNavContainer}>
                     <div className={styles.assignmentListIcon}>
                        <input type="radio" name="bar" value="home" id="home" className={styles.assignmentListHomeIcon} checked={selectedPage === "home"} onChange={handleChange}/>
                           <label htmlFor="home">
                              <FontAwesomeIcon icon={faHouse} />
                              <div className={styles.assignmentListIconLabel}>Assignments list</div>
                           </label>
                     </div>

                     <div className={styles.assignmentListIcon}>
                        <input type="radio" name="bar" value="createAssignment" id="createAssignment" className={styles.assignmentListCreateIcon} checked={selectedPage === "createAssignment"} onChange={handleChange}/>
                           <label htmlFor="createAssignment">
                              <FontAwesomeIcon icon={faPlus} />
                              <div className={styles.assignmentListIconLabel}>Create assignment</div>
                           </label>
                     </div>

                     <div className={styles.assignmentListIcon}>
                        <input type="radio" name="bar" value="members" id="members" className={styles.assignmentListMembersIcon} checked={selectedPage === "members"} onChange={handleChange}/>
                           <label htmlFor="members">
                              <FontAwesomeIcon icon={faCircleUser} />
                              <div className={styles.assignmentListIconLabel}>Members</div>
                           </label>
                     </div>
                  </nav>
               </div>
             </div>

               <main>
                  <div className={styles.assignmentListBodyBox}>
                     {selectedPage === "home" && <HomeContent/>}
                     {selectedPage === "createAssignment" && <CreateContent setPage={setPage}/>}
                     {selectedPage === "members" && <MembersContent setPage={setPage} />}
                  </div>
               </main>
           </div>
        </>
    );
}

export default GroupPage