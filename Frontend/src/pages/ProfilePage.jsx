import '../assets/css/ProfilePage.css';
import { fetchUsers, editProfile } from '@services/authService'
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faCamera } from '@fortawesome/free-solid-svg-icons';

function ProfilePage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [confirmPass, setConfirm] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loaduser = async () => {
            const currentUser = JSON.parse(localStorage.getItem("currentUser"));
            if (!currentUser) return;
            try {
                const { data } = await fetchUsers();
                const userNow = data.find(d => d.id === currentUser.id);
                setUser(userNow);
            } catch (error) {
                console.error(error);
            }
        };
        loaduser();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(u => ({ ...u, [name]: value }));
    };

    const changeInfo = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (newPassword && newPassword !== confirmPass) {
            toast.error("Passwords do not match!");
            setLoading(false);
            return;
        }

        const updatedUser = {
            ...user,
            password: newPassword ? newPassword : user.password
        };

        try {
            const { response } = await editProfile(user.id, updatedUser);
            if (response.ok) {
                localStorage.setItem("currentUser", JSON.stringify(updatedUser));
                toast.success("Profile updated successfully!");
                navigate("/home");
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    if (!user) return <div className={"ProfilePage-loading"}>Loading profile...</div>;

    return (
        <div className={"ProfilePage-page"}>
            <div className={"ProfilePage-container"}>
                <div className={"ProfilePage-header"}>
                    <div className={"ProfilePage-avatarWrapper"}>
                        <FontAwesomeIcon icon={faUserCircle} className={"ProfilePage-avatar"} />
                        <div className={"ProfilePage-editAvatar"}>
                            <FontAwesomeIcon icon={faCamera} />
                        </div>
                    </div>
                    <h1>Personal info</h1>
                    <p>Info about you and your preferences across Coordination services</p>
                </div>

                <form className={"ProfilePage-form"} onSubmit={changeInfo}>
                    <section className={"ProfilePage-section"}>
                        <h3>Basic info</h3>
                        <div className={"ProfilePage-row"}>
                            <label>First name</label>
                            <input type="text" name="firstName" value={user.firstName} onChange={handleChange} required />
                        </div>
                        <div className={"ProfilePage-row"}>
                            <label>Last name</label>
                            <input type="text" name="lastName" value={user.lastName} onChange={handleChange} required />
                        </div>
                        <div className={"ProfilePage-row"}>
                            <label>Username</label>
                            <input type="text" value={user.username} readOnly className={"ProfilePage-readOnly"} />
                        </div>
                    </section>

                    <section className={"ProfilePage-section"}>
                        <h3>Contact info</h3>
                        <div className={"ProfilePage-row"}>
                            <label>Email</label>
                            <input type="email" name="email" value={user.email} onChange={handleChange} required />
                        </div>
                    </section>

                    <section className={"ProfilePage-section"}>
                        <h3>Security</h3>
                        <div className={"ProfilePage-row"}>
                            <label>New password</label>
                            <input
                                type="password"
                                placeholder="Leave blank to keep current"
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                        <div className={"ProfilePage-row"}>
                            <label>Confirm password</label>
                            <input
                                type="password"
                                onChange={(e) => setConfirm(e.target.value)}
                            />
                        </div>
                    </section>

                    <div className={"ProfilePage-footer"}>
                        <button type="button" className={"ProfilePage-cancelBtn"} onClick={() => navigate(-1)}>Cancel</button>
                        <button type="submit" className={"ProfilePage-saveBtn"} disabled={loading}>
                            {loading ? 'Saving...' : 'Save changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ProfilePage;
