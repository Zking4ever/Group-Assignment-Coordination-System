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