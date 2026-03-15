import styles from './Header-Component.module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router-dom";

function Header(){

   const navigate = useNavigate();

   const goToProfile = () => {
      navigate("/profileEdit");
   }

   return(
      <>
         <div className={styles.headerComponentTopBar}>
            <header className={styles.topContainer}>

               <div className={styles.headerComponentTitleLbl}>
                  Group Assignment Coordination
               </div>

               <div className={styles.headerComponentProfileIcon} onClick={goToProfile}>
                  <FontAwesomeIcon icon={faCircleUser} />
               </div>

               {/* <button className={styles.headerComponentBarsIcon}>
                  <FontAwesomeIcon icon={faBars} />
               </button> */}

            </header>
         </div>
      </>
   );
}

export default Header