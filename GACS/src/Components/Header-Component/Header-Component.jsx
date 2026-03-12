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
      <header className={styles.topContainer}>

         <div className={styles.title}>
            Group Assignment Coordination
         </div>

          <button className={styles.profileEdit} onClick={goToProfile}>
            <FontAwesomeIcon icon={faCircleUser} />
         </button>

         {/* <button className={styles.setting}>
            <FontAwesomeIcon icon={faBars} />
         </button> */}

      </header>
   );
}

export default Header;