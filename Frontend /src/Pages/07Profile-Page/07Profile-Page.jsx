import styles from './07Profile-Page.module.css'
import { fetchUsers, editProfile } from '../../services/authService'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function ProfileEdit(){

    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [confirmPass, setConfirm] = useState("");
    const [newPassword, setNewPassword] = useState("");
    

    useEffect(() => {
        const loaduser = async () => {
            const currentUser = JSON.parse(localStorage.getItem("currentUser"));
            try{
                const { response, data } = await fetchUsers();
                if(!response.ok) return;

                const userNow = data.find(d => d.id === currentUser.id);
                
                setUser(userNow);
            }
            catch(error){
                alert(error.message);
            }
        }; loaduser();
    },[]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setUser(u => ({...u,
            [name]: value
        }));
    };

    const handlePassword = (e) => {
         setConfirm(e.target.value);
    }

    const changeInfo = async (e) => {
        e.preventDefault();

        if (newPassword) {
            if (newPassword.length < 6) {
                alert("Password must be at least 6 characters!");
                return;
            }

            if (newPassword !== confirmPass) {
                alert("Passwords do not match!");
                return;
            }
        }

        const updatedUser = {
            ...user,
            password: newPassword ? newPassword : user.password
        };


        try{
            const { response, data } = await editProfile(user.id, updatedUser);

            if(response.ok){
                alert("Profile information changed successfully!");
                navigate("/home");
            }
            else{
                alert(data.message || "Please try again!");
            }
        }
        catch(error){
            alert(error.message);
        }
    }

    if (!user) {
    return <p>Loading profile...</p>;
}

     return(
        <>
           <div className={styles.profilePageBody}>
            <div className={styles.profilePageContainer}>
                 <h1 className={styles.profilePageHeaderTitle}>Edit your profile</h1>
                <form className={styles.profilePageFormContainer} onSubmit={changeInfo}>
                    <div className={styles.profilePageInpSpace}>
                        <label className={styles.profilePageInpLbl}>First Name:</label>
                        <input type="text" name="firstName" value={user?.firstName} onChange={handleChange} className={styles.profilePageInp} required/>
                    </div>

                    <div className={styles.profilePageInpSpace}>
                        <label className={styles.profilePageInpLbl}>Last Name</label>
                        <input type="text" name="lastName" value={user?.lastName} onChange={handleChange} className={styles.profilePageInp} required/>
                    </div>

                    <div className={styles.profilePageInpSpace}>
                        <label className={styles.profilePageInpLbl}>Username <br/> <small className={styles.smallLabel}>(CAN NOT BE EDITED)</small></label>
                        <input type="text" name="username" value={user?.username} className={styles.profilePageInp} readOnly/>
                    </div>

                    <div className={styles.profilePageInpSpace}>
                        <label className={styles.profilePageInpLbl}>Email address: </label>
                        <input type="email" name="email" value={user?.email} onChange={handleChange} className={styles.profilePageInp} required/>
                    </div>

                    <div className={styles.profilePageInpSpace}>
                        <label className={styles.profilePageInpLbl}>New password: </label>
                        <input type="password" placeholder="enter new password" onChange={(e) => setNewPassword(e.target.value)} className={styles.profilePageInp}/>
                    </div>

                    <div className={styles.profilePageInpSpace}>
                        <label className={styles.profilePageInpLbl}>Confirm password: </label>
                        <input type="password" name="confirmpassword" placeholder="Confirm new password" onChange={handlePassword} className={styles.profilePageInp}/>
                    </div>

                    <button type="submit" className={styles.profilePageSubmitBtn}>Apply changes</button>
                </form>
            </div>
           </div>
        </>
     );

}

export default ProfileEdit