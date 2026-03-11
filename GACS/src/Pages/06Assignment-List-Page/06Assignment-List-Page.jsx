import styles from './06Assignment-List-Page.module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser, faHouse, faPlus } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from 'react'
import HomeContent from './HomeContent.jsx'
import MembersContent from './MembersContent.jsx'
import CreateContent from './CreateContent.jsx'
import Header from '../000Header/000Header.jsx'

function GroupPage(){

    const [selectedPage, setPage] = useState("home");

    const handleChange = (e) => {
        setPage(e.target.value);
    }



    return(
        <>
            <Header/>

            <nav className={styles.topNav}>
                           <input type="radio" name="bar" value="home" id="home" className={styles.homeIcon} checked={selectedPage === "home"} onChange={handleChange}/>
                              <label htmlFor="home">Assignments list
                                 <FontAwesomeIcon icon={faHouse} />
                              </label> 
                           {/* home icon and nothing in mind for now */}
                          
                           <input type="radio" name="bar" value="createAssignment" id="createAssignment" className={styles.createAssignment} checked={selectedPage === "createAssignment"} onChange={handleChange}/>
                              <label htmlFor="createAssignment">Create new assignment
                                 <FontAwesomeIcon icon={faPlus} />
                              </label>
                            <input type="radio" name="bar" value="members" id="members" className={styles.homeIcon} checked={selectedPage === "members"} onChange={handleChange}/>
                              <label htmlFor="members">Members
                                 <FontAwesomeIcon icon={faCircleUser} />
                              </label>
            </nav>

            <main>
               <div>
                  {selectedPage === "home" && <HomeContent/>}
                  {selectedPage === "createAssignment" && <CreateContent setPage={setPage}/>}
                  {selectedPage === "members" && <MembersContent setPage={setPage} />}
               </div>
            </main>
        </>
    );
}

export default GroupPage