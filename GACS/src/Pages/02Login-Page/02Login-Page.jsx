import styles from './02Login-Page.module.css'
import { useNavigate, Link } from 'react-router-dom'
import React, { useState } from 'react'
import { checkAcc } from '../../services/authService'

function LoginPage(){

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleEmail = (e) => {
        setEmail(e.target.value);
    }

    const handlePassword = (e) => {
        setPassword(e.target.value);
    }

    const login = async (e) => {
        e.preventDefault();

        const loginInfo = {
            email: email.trim().toLowerCase(),
            password: password,
        };

        if(loading) return;
        setLoading(true);

        try{
            const { response, data } = await checkAcc(loginInfo);

            if (response.ok) {
                const user = data[0];

                localStorage.setItem("currentUser", JSON.stringify({
                    id: user.id,
                    username: user.username,
                    email: user.email
                }));

                navigate("/home");
            }

            else{
                alert(data.message || "Invalid email or password.");
            }
        }
        catch(error){
            alert("Couldn't login! " + error.message);
        }
        finally{
            setLoading(false);
        }
    }

    return(
        <>
            <div className={styles.container}>
                <h1 className={styles.welcome}>Login Page</h1>
                <form className={styles.formContainer} onSubmit={login}>
                    <label className={styles.lbl}>Email:</label>
                    <input type="email" value={email} placeholder="Enter your email" className={styles.inp} onChange={handleEmail} required/>
                    <label className={styles.lbl}>Password:</label>
                    <input type="password" value={password} placeholder="Enter your password" className={styles.inp} onChange={handlePassword} required/>
                    <button type="submit" className={styles.loginBtn}>
                        Login
                    </button>
                </form>
                <Link to="/register" className={styles.linkText}>Forgot password?</Link>
                <Link to="/register" className={styles.linkText}>Create new account</Link>
            </div>
        </>
    );

}

export default LoginPage