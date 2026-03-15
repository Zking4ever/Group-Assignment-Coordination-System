import styles from './Member-Card-Component.module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons"


function MemberCard({ user }){

   return(
        <div className={styles.memberIcon}>
            <FontAwesomeIcon icon={faCircleUser}/>
            <label className={styles.name}>
                {user.firstName} {user.lastName}
            </label>
        </div>
    );
}

export default MemberCard