import React, { useState, useEffect } from 'react';
import { fetchGroups, fetchGroupMembers, fetchUserData } from '@services/authService';
import '../assets/css/MemberList.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faUserCircle } from '@fortawesome/free-solid-svg-icons';

function MemberList({ groupId }) {
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

  if (loading) return <div>Loading members...</div>;

  return (
    <div className={"MemberList-peopleContainer"}>
      <div className={"MemberList-section"}>
        <div className={"MemberList-sectionHeader"}>
          <h2>Group Owner</h2>
          <FontAwesomeIcon icon={faUserPlus} className={"MemberList-addIcon"} />
        </div>
        <div className={"MemberList-divider"} />
        <div className={"MemberList-personList"}>
          {teachers.map(t => (
            <div key={t.id} className={"MemberList-personRow"}>
              <FontAwesomeIcon icon={faUserCircle} className={"MemberList-avatarIcon"} />
              <span>{t.firstName} {t.lastName} (Owner)</span>
            </div>
          ))}
        </div>
      </div>

      <div className={"MemberList-section"}>
        <div className={"MemberList-sectionHeader"}>
          <h2>Fellows</h2>
          <FontAwesomeIcon icon={faUserPlus} className={"MemberList-addIcon"} />
        </div>
        <div className={"MemberList-divider"} />
        <div className={"MemberList-personList"}>
          {students.length === 0 ? (
            <p className={"MemberList-empty"}>No fellows joined yet.</p>
          ) : (
            students.map(s => (
              <div key={s.id} className={"MemberList-personRow"}>
                <FontAwesomeIcon icon={faUserCircle} className={"MemberList-avatarIcon"} />
                <span>{s.firstName} {s.lastName}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default MemberList;
