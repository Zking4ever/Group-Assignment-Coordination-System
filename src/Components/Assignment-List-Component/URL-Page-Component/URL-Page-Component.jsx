import styles from './URL-Page-Component.module.css'

function URLPage(){

    const currentGroup = JSON.parse(localStorage.getItem("currentGroup"));

    return (
        <>
            <div className={styles.urlText}>
                {currentGroup.id}
            </div>
        </>
    );
}

export default URLPage