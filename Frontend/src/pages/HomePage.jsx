import '../assets/css/HomePage.css';
import GroupList from '@components/GroupList.jsx'
import GroupJoin from '@components/GroupJoin.jsx'
import GroupCreate from '@components/GroupCreate.jsx'

function HomePage({ view, setView }) {
   return (
      <div className={"HomePage-container"}>
         <div className={"HomePage-content"}>
            {view === "home" && <GroupList setView={setView} />}
            {view === "join" && <GroupJoin setView={setView} />}
            {view === "create" && <GroupCreate setView={setView} />}
         </div>
      </div>
   );
}

export default HomePage;
