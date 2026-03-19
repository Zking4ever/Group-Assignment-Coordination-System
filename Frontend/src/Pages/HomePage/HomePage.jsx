import React from 'react'
import styles from './HomePage.module.css'
import GroupList from '../../components/groups/GroupList/GroupList.jsx'
import GroupJoin from '../../components/groups/GroupJoin/GroupJoin.jsx'
import GroupCreate from '../../components/groups/GroupCreate/GroupCreate.jsx'

function HomePage({ view, setView }) {
   return (
      <div className={styles.container}>
         <div className={styles.content}>
            {view === "home" && <GroupList setView={setView} />}
            {view === "join" && <GroupJoin setView={setView} />}
            {view === "create" && <GroupCreate setView={setView} />}
         </div>
      </div>
   );
}

export default HomePage;
