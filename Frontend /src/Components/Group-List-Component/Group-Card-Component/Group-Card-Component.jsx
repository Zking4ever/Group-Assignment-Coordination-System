import styles from './Group-Card-Component.module.css'

function GroupCard({ title, description }){

    return (
        <>
            <div className={styles.container} >
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

export default GroupCard