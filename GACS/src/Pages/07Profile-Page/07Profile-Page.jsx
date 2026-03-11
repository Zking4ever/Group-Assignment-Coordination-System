import styles from './07Profile-Page.module.css'
import { fetchUsers, editProfile } from '../services/authService'
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
           <form className={styles.formContainer} onSubmit={changeInfo}>
             <h3 className={styles.myh3}>Edit your profile</h3>
             <div>
                <label>First Name:</label>
                <input type="text" name="firstName" value={user?.firstName} onChange={handleChange} required/>
             </div>

             <div>
                <label>Last Name</label>
                <input type="text" name="lastName" value={user?.lastName} onChange={handleChange} required/>
             </div>

             <div>
                <label>Username <small>(CAN NOT BE EDITED)</small></label>
                <input type="text" name="username" value={user?.username} readOnly/>
             </div>

             <div>
                <label>Email address: </label>
                <input type="email" name="email" value={user?.email} onChange={handleChange} required/>
             </div>

             <div>
                <label>New password: </label>
                 <input type="password" placeholder="enter new password" onChange={(e) => setNewPassword(e.target.value)}/>
             </div>

              <div>
                <label>Confirm password: </label>
                 <input type="password" name="confirmpassword" placeholder="Confirm new password" onChange={handlePassword}/>
             </div>

             <button type="submit">Apply changes</button>
           </form>
        </>
     );

}

export default ProfileEdit