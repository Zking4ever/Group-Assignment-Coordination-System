import styles from './Group-Create-Component.module.css'
import React, { useState } from 'react'
import { createNewGroup } from '../../../services/authService'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

function CreateContent({ setView }) {
    const [groupName, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    const createGroup = async (e) => {
        e.preventDefault();
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));

        if (!groupName.trim()) {
            alert("Group name is required.");
            return;
        }

        setLoading(true);
        try {
            const newGroup = {
                groupName: groupName,
                groupDescription: description,
                creatorId: currentUser.id,
                members: [currentUser.id]
            };
            const { response } = await createNewGroup(newGroup);
            if (response.ok) {
                setView("home");
            } else {
                alert("Failed to create group.");
            }
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2>Create Group</h2>
                    <button className={styles.closeBtn} onClick={() => setView("home")}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>
                <form className={styles.form} onSubmit={createGroup}>
                    <div className={styles.inputGroup}>
                        <input
                            type="text"
                            required
                            placeholder="Group name (required)"
                            className={styles.input}
                            value={groupName}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <input
                            type="text"
                            placeholder="Section"
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <input
                            type="text"
                            placeholder="Subject"
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <textarea
                            placeholder="Description"
                            className={styles.textarea}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div className={styles.footer}>
                        <button type="button" className={styles.cancelBtn} onClick={() => setView("home")}>Cancel</button>
                        <button type="submit" className={styles.createBtn} disabled={loading || !groupName}>Create</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateContent;