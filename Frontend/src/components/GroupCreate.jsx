import '../assets/css/GroupCreate.css';
import React, { useState } from 'react'
import { createNewGroup } from '@services/authService'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';

function GroupCreate({ setView }) {
    const [groupName, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    const createGroup = async (e) => {
        e.preventDefault();
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));

        if (!groupName.trim()) {
            toast.error("Group name is required.");
            return;
        }

        setLoading(true);
        try {
            const newGroup = {
                groupName,
                groupDescription: description,
                creatorId: currentUser.id,
                members: [currentUser.id]
            };
            const { response } = await createNewGroup(newGroup);
            if (response.ok) {
                setView("home");
            } else {
                toast.error("Failed to create group.");
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={"GroupCreate-overlay"}>
            <div className={"GroupCreate-modal"}>
                <div className={"GroupCreate-header"}>
                    <h2>Create Group</h2>
                    <button className={"GroupCreate-closeBtn"} onClick={() => setView("home")}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>
                <form className={"GroupCreate-form"} onSubmit={createGroup}>
                    <div className={"GroupCreate-inputGroup"}>
                        <input
                            type="text"
                            required
                            placeholder="Group name (required)"
                            className={"GroupCreate-input"}
                            value={groupName}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className={"GroupCreate-inputGroup"}>
                        <textarea
                            placeholder="Description"
                            className={"GroupCreate-textarea"}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div className={"GroupCreate-footer"}>
                        <button type="button" className={"GroupCreate-cancelBtn"} onClick={() => setView("home")}>Cancel</button>
                        <button type="submit" className={"GroupCreate-createBtn"} disabled={loading || !groupName}>Create</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default GroupCreate;
