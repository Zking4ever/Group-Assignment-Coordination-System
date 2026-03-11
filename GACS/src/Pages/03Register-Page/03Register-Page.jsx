import styles from './03Register-Page.module.css'
import { useNavigate ,Link } from 'react-router-dom'
import React, { useState } from 'react'

function RegisterPage(){

    const navigate = useNavigate();

    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [loading, setLoading] = useState(false);

    const handleFname = (e) => {
        setFname(e.target.value);
    }

    const handleLname = (e) => {
        setLname(e.target.value);
    }

    const handleEmail = (e) => {
        setEmail(e.target.value);
    }

    const handlePassword = (e) => {
        setPassword(e.target.value);
    }

    const confirmPassword = (e) => {
        setConfirmPass(e.target.value);
    }

    const addPerson = async (e) => {
        e.preventDefault();

        if(password.length < 6){
            alert("Passwords must be at least 6 character!");
            return;
         }

        if(password !== confirmPass){
            alert("Passwords do not match!");
            return;
         }

        if (loading) return;
        setLoading(true);

        navigate("/confirm", {
          state: { firstName: fname, lastName: lname, email, password }
        });
    };

     return(
        <>
            
            <form className={styles.container} onSubmit={addPerson}>
                <h1 className={styles.welcome}>Create new account</h1>
                <label className={styles.lbl}>First name:</label>
                <input type="text" value={fname} placeholder='Enter first name' className={styles.inp} onChange={handleFname} required/>
                <label className={styles.lbl}>Last name:</label>
                <input type="text" value={lname} placeholder='Enter last name' className={styles.inp} onChange={handleLname} required/>
                <label className={styles.lbl}>Email:</label>
                <input type="email" value={email} placeholder="Enter email" className={styles.inp} onChange={handleEmail} required/>
                <label className={styles.lbl}>Password:</label>
                <input type="password" value={password} placeholder="Enter password" className={styles.inp} onChange={handlePassword} required/>
                <label className={styles.lbl}>Confirm Password:</label>
                <input type="password" value={confirmPass} placeholder="Enter password" className={styles.inp} onChange={confirmPassword} required/>
                <button type="submit" className={styles.submitBtn} disabled={loading}>
                    {loading ? "Creating..." : "Create account"}
                </button>
            </form>

            <Link to="/login" className={styles.textLink}>Already have an account?</Link>
        </>
    );


}

export default RegisterPage