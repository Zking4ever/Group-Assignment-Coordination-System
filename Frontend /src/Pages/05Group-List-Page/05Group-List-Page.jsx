import styles from './05Group-List-Page.module.css'
import React, { useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faPlus } from "@fortawesome/free-solid-svg-icons";
import HomeContent from '../../Components/Group-List-Component/Group-Home-Component/Group-Home-Component.jsx'
import JoinContent from '../../Components/Group-List-Component/Group-Join-Component/Group-Join-Component.jsx'
import CreateContent from '../../Components/Group-List-Component/Group-Create-Component/Group-Create-Component.jsx'
import Header from '../../Components/Header-Component/Header-Component.jsx'



function HomePage(){
   
   const [selectedPage, setPage] = useState("home");

   const handleChange = (e) => {
     setPage(e.target.value);
   }

     return(
        <>
            <div className={styles.groupListBody}>
               <div className={styles.groupListTopFixedBarAll}>
                  <div className={styles.groupListHeader}>
                     <Header/>
                  </div>
                  <div className={styles.groupListNavContainerDiv}>
                     <nav className={styles.groupListNavContainer}>
                        <div className={styles.groupListIcon}>
                           <input type="radio" name="bar" value="home" id="home" className={styles.groupListHomeIcon} checked={selectedPage === "home"} onChange={handleChange}/>
                           <label htmlFor="home">
                              <FontAwesomeIcon icon={faHouse}/>
                              <div className={styles.groupListIconLabel}>Home</div>
                           </label>
                        </div>
      
                        <div className={styles.groupListIcon}>
                           <input type="radio" name="bar" value="join" id="join" className={styles.groupListJoinIcon} checked={selectedPage === "join"} onChange={handleChange}/>
                           <label htmlFor="join">
                              <FontAwesomeIcon icon={faPlus} />
                              <div className={styles.groupListIconLabel}>Join group</div>
                           </label>   
                        </div>           
                     
                        <div className={styles.groupListIcon}>
                           <input type="radio" name="bar" value="create" id="create" className={styles.groupListCreateIcon} checked={selectedPage === "create"} onChange={handleChange}/>
                           <label htmlFor="create">
                              <FontAwesomeIcon icon={faPlus} />
                              <div className={styles.groupListIconLabel}>Create new group</div>
                           </label>
                        </div>
                     </nav>
                  </div>
               </div>

            <main>
               <div className={styles.groupListBodyBox}>
                  {selectedPage === "home" && <HomeContent/>}
                  {selectedPage === "join" && <JoinContent setPage={setPage}/>}
                  {selectedPage === "create" && <CreateContent setPage={setPage}/>}
               </div>
            </main>
            </div>
        </>
     );
}

export default HomePage