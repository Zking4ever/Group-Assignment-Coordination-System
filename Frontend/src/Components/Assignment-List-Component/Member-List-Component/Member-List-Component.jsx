import React, { useState, useEffect } from 'react';
import { fetchUsers, fetchGroups } from '../../../services/authService';
import styles from './Member-List-Component.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faUserPlus } from '@fortawesome/free-solid-svg-icons';

function MemberList() {
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [group, setGroup] = useState(null);

  useEffect(() => {
    const loadMembers = async () => {
      const currentGroup = JSON.parse(localStorage.getItem("currentGroup"));
      const { data: allUsers } = await fetchUsers();
      const { data: allGroups } = await fetchGroups();

      const groupData = allGroups.find(g => g.id === currentGroup.id);
      if (groupData) {
        setGroup(groupData);
        const creator = allUsers.find(u => u.id === groupData.creatorId);
        const members = allUsers.filter(u =>
          groupData.members.includes(u.id) && u.id !== groupData.creatorId
        );

        setTeachers(creator ? [creator] : []);
        setStudents(members);
      }
    };
    loadMembers();
  }, []);

  const UserItem = ({ user }) => (
    <div className={styles.userItem}>
      <FontAwesomeIcon icon={faUserCircle} className={styles.userIcon} />
      <span>{user.firstName} {user.lastName}</span>
    </div>
  );

  return (
    <div className={styles.peopleContainer}>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Group Owner</h2>
          <FontAwesomeIcon icon={faUserPlus} className={styles.addIcon} />
        </div>
        <div className={styles.divider} />
        {teachers.map(u => <UserItem key={u.id} user={u} />)}
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Students</h2>
          <div className={styles.studentStats}>
            <span>{students.length} students</span>
            <FontAwesomeIcon icon={faUserPlus} className={styles.addIcon} />
          </div>
        </div>
        <div className={styles.divider} />
        {students.length === 0 ? (
          <p className={styles.empty}>No students joined yet.</p>
        ) : (
          students.map(u => <UserItem key={u.id} user={u} />)
        )}
      </div>
    </div>
  );
}

export default MemberList;