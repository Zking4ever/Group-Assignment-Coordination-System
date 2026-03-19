import React from 'react'
import styles from './05Group-List-Page.module.css'
import HomeContent from '../../Components/Group-List-Component/Group-Home-Component/Group-Home-Component.jsx'
import JoinContent from '../../Components/Group-List-Component/Group-Join-Component/Group-Join-Component.jsx'
import CreateContent from '../../Components/Group-List-Component/Group-Create-Component/Group-Create-Component.jsx'

function HomePage({ view, setView }) {
   return (
      <div className={styles.container}>
         <div className={styles.content}>
            {view === "home" && <HomeContent setView={setView} />}
            {view === "join" && <JoinContent setView={setView} />}
            {view === "create" && <CreateContent setView={setView} />}
         </div>
      </div>
   );
}

export default HomePage;