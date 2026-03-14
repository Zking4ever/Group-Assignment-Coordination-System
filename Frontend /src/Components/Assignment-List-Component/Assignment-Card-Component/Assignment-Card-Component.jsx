import styles from './Assignment-Card-Component.module.css'
import { useNavigate } from 'react-router-dom'

function AssignmentCard({ title, description }){

    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/group");
    }

    return (
        <>
            <div className={styles.container} onClick={handleClick}>
                <div className={styles.groupTitle}>
                    {title.toUpperCase()}
                </div>
                <div className={styles.description}>
                    <pre>
                       {description}
                    </pre>
                </div>
            </div>
        </>
    );
}

export default AssignmentCard