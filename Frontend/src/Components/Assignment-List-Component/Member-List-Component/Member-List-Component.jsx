import React, { useState, useEffect } from 'react';
import { fetchUsers, fetchGroups, fetchGroupMembers, fetchUserData } from '../../../services/authService';
import styles from './Member-List-Component.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faUserCircle } from '@fortawesome/free-solid-svg-icons';

function PeopleContent({ groupId }) {
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPeople = async () => {
      try {
        const { data: groupData } = await fetchGroups(groupId);
        const { data: members } = await fetchGroupMembers(groupId);

        if (groupData) {
          const creator = await fetchUserData(groupData?.creatorId);
          setTeachers(creator ? [creator] : []);
          setStudents(members.filter(m => m.id != groupData?.creatorId));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadPeople();
  }, [groupId]);

  if (loading) return <div>Loading people...</div>;

  return (
    <div className={styles.peopleContainer}>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Group Owner</h2>
          <FontAwesomeIcon icon={faUserPlus} className={styles.addIcon} />
        </div>
        <div className={styles.divider} />
        <div className={styles.personList}>
          {teachers.map(t => (
            <div key={t.id} className={styles.personRow}>
              <FontAwesomeIcon icon={faUserCircle} className={styles.avatarIcon} />
              <span>{t.firstName} {t.lastName} (Owner)</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Fellows</h2>
          <FontAwesomeIcon icon={faUserPlus} className={styles.addIcon} />
        </div>
        <div className={styles.divider} />
        <div className={styles.personList}>
          {students.length === 0 ? (
            <p className={styles.empty}>No fellows joined yet.</p>
          ) : (
            students.map(s => (
              <div key={s.id} className={styles.personRow}>
                <FontAwesomeIcon icon={faUserCircle} className={styles.avatarIcon} />
                <span>{s.firstName} {s.lastName}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default PeopleContent;