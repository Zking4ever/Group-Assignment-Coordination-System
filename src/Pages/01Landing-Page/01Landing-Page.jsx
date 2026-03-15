import styles from './01Landing-Page.module.css'
import { Link } from 'react-router-dom'

function LandingPage(){


    return(
        <>
         <div className={styles.landingBody}>
            <div className={styles.landingContainer}>
                <h1 className={styles.landingWelcome}>Welcome</h1>
                <div className={styles.landingDescription}>
                    From group projects to team assignments, GACS keeps everyone accountable and on schedule.<br/>
                    Create your group, assign responsibilities, and know exactly who's doing what and by when. <br/>
                    No more "I thought you were doing that part."</div>
                <Link to="/login">
                    <button className={styles.landingCTA}>Get Started</button>
                </Link>
         </div>
         </div>
        </>
    );
}

export default LandingPage