import '../assets/css/LoginPage.css';
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { checkAcc } from '@services/authService'
import toast from 'react-hot-toast';

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
                toast.success("Welcome back, " + user.firstName + "!");
                navigate("/home");
            } else {
                toast.error("Invalid email or password!");
            }
        } catch (error) {
            toast.error("Login failed: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={"LoginPage-page"}>
            <div className={"LoginPage-card"}>
                <div className={"LoginPage-header"}>
                    <div className={"LoginPage-logo"}>GACS</div>
                    <h1>Sign in</h1>
                    <p>Use your Coordination Account</p>
                </div>

                <form className={"LoginPage-form"} onSubmit={handleSubmit}>
                    <div className={"LoginPage-inputGroup"}>
                        <input
                            type="email"
                            required
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className={"LoginPage-inputGroup"}>
                        <input
                            type="password"
                            required
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className={"LoginPage-helpText"}>
                        <Link to="/register">Create account</Link>
                    </div>

                    <div className={"LoginPage-footer"}>
                        <button type="submit" className={"LoginPage-nextBtn"} disabled={loading}>
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>
                </form>
            </div>

            <div className={"LoginPage-bottomLinks"}>
                <span>English (United States)</span>
                <div className={"LoginPage-extra"}>
                    <a href="#">Help</a>
                    <a href="#">Privacy</a>
                    <a href="#">Terms</a>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
