import styles from './05Group-List-Page.module.css'
import React, { useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faPlus } from "@fortawesome/free-solid-svg-icons";
import HomeContent from './HomeContent.jsx'
import JoinContent from './JoinContent.jsx'
import CreateContent from './CreateContent.jsx'
import Header from '../000Header/000Header.jsx'



function HomePage(){
   
   const [selectedPage, setPage] = useState("home");

   const handleChange = (e) => {
     setPage(e.target.value);
   }

     return(
        <>
            <Header/>
            <nav className={styles.topNav}>
               <input type="radio" name="bar" value="home" id="home" className={styles.homeIcon} checked={selectedPage === "home"} onChange={handleChange}/>
                  <label htmlFor="home"> Home
                     <FontAwesomeIcon icon={faHouse} />
                  </label> 
              
               <input type="radio" name="bar" value="join" id="join" className={styles.joinAss} checked={selectedPage === "join"} onChange={handleChange}/>
                  <label htmlFor="join">Join group
                     <FontAwesomeIcon icon={faPlus} />
                  </label>              
            
               <input type="radio" name="bar" value="create" id="create" className={styles.createAss} checked={selectedPage === "create"} onChange={handleChange}/>
                  <label htmlFor="create">Create new group
                     <FontAwesomeIcon icon={faPlus} />
                  </label>
               
            </nav>

            <main>
               <div>
                  {selectedPage === "home" && <HomeContent/>}
                  {selectedPage === "join" && <JoinContent setPage={setPage}/>}
                  {selectedPage === "create" && <CreateContent setPage={setPage}/>}
               </div>
            </main>
        </>
     );
}

export default HomePage