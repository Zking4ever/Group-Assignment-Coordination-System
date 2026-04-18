import React, { useState, useEffect } from 'react';
import { fetchGroups, fetchGroupMembers, fetchUserData, kickMember } from '@services/authService';
import '../assets/css/MemberList.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faUserCircle, faUserMinus } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
import Modal from './Modal';

function MemberList({ groupId }) {
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [memberToKick, setMemberToKick] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadPeople = async () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      const { data: groupData } = await fetchGroups(groupId);
      const { data: members } = await fetchGroupMembers(groupId);

      if (groupData) {
        setIsOwner(groupData.creatorId === currentUser?.id);
        const creator = await fetchUserData(groupData?.creatorId);
        setTeachers(creator ? [creator] : []);
        setStudents(members.filter(m => m.id != groupData?.creatorId));
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPeople();
  }, [groupId]);

  const handleKickClick = (member) => {
    setMemberToKick(member);
    setIsModalOpen(true);
  };

  const confirmKick = async () => {
    if (!memberToKick) return;
    
    try {
      const { response, data } = await kickMember(groupId, memberToKick.id);
      if (response.ok) {
        toast.success(`${memberToKick.firstName} ${memberToKick.lastName} removed from group`);
        setIsModalOpen(false);
        setMemberToKick(null);
        loadPeople(); // Refresh list
      } else {
        toast.error(data.error || "Failed to kick member");
      }
    } catch (error) {
      toast.error("An error occurred while kicking the member");
    }
  };

  if (loading) return <div className="MemberList-loading">Loading members...</div>;

  return (
    <div className={"MemberList-peopleContainer"}>
      <div className={"MemberList-section"}>
        <div className={"MemberList-sectionHeader"}>
          <h2>Group Owner</h2>
          {isOwner && <FontAwesomeIcon icon={faUserPlus} className={"MemberList-addIcon"} />}
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
          {isOwner && <FontAwesomeIcon icon={faUserPlus} className={"MemberList-addIcon"} />}
        </div>
        <div className={"MemberList-divider"} />
        <div className={"MemberList-personList"}>
          {students.length === 0 ? (
            <p className={"MemberList-empty"}>No fellows joined yet.</p>
          ) : (
            students.map(s => (
              <div key={s.id} className={"MemberList-personRow MemberList-memberRow"}>
                <div className="MemberList-personInfo">
                  <FontAwesomeIcon icon={faUserCircle} className={"MemberList-avatarIcon"} />
                  <span>{s.firstName} {s.lastName}</span>
                </div>
                {isOwner && (
                  <button 
                    className="MemberList-kickBtn" 
                    onClick={() => handleKickClick(s)}
                    title="Kick member"
                  >
                    <FontAwesomeIcon icon={faUserMinus} />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Remove Member"
        footer={(
          <>
            <button className="Modal-btn Modal-btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button className="Modal-btn Modal-btn-danger" onClick={confirmKick}>Remove Member</button>
          </>
        )}
      >
        <p>Are you sure you want to remove <strong>{memberToKick?.firstName} {memberToKick?.lastName}</strong> from this group? They will lose access to all assignments and tasks.</p>
      </Modal>
    </div>
  );
}

export default MemberList;
