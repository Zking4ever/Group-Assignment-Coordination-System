import styles from './01Landing-Page.module.css'
import { Link } from 'react-router-dom'

function LandingPage(){


    return(
        <>
         <div className={styles.container}>
            <h1 className={styles.welcome}>Welcome</h1>
                <div className={styles.description}>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quo vel consequuntur nostrum repellat, ea non praesentium, natus ab delectus odio quod officiis, atque ad in fugiat beatae architecto? Quas, velit?</div>
                <Link to="/login">
                    <button className={styles.CTA}>Get Started</button>
                </Link>
         </div>
        </>
    );
}

export default LandingPage