import styles from './LoginPage.module.css'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { checkAcc } from '../../services/authService'

function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { response, data } = await checkAcc(email, password);
            if (response.ok && data.length > 0) {
                const user = data[0];
                localStorage.setItem("currentUser", JSON.stringify(user));
                navigate("/home");
            } else {
                alert("Invalid email or password!");
            }
        } catch (error) {
            alert("Login failed: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <div className={styles.logo}>G</div>
                    <h1>Sign in</h1>
                    <p>Use your Coordination Account</p>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <input
                            type="email"
                            required
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <input
                            type="password"
                            required
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className={styles.helpText}>
                        <Link to="/register">Create account</Link>
                    </div>

                    <div className={styles.footer}>
                        <button type="submit" className={styles.nextBtn} disabled={loading}>
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>
                </form>
            </div>

            <div className={styles.bottomLinks}>
                <span>English (United States)</span>
                <div className={styles.extra}>
                    <a href="#">Help</a>
                    <a href="#">Privacy</a>
                    <a href="#">Terms</a>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
