import '../assets/css/RegisterPage.css';
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createUsername } from '@services/authService'

function RegisterPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validatePassword = (pass) => {
        const hasNumber = /\d/.test(pass);
        const hasUpper = /[A-Z]/.test(pass);
        const isLongEnough = pass.length >= 8;
        return hasNumber && hasUpper && isLongEnough;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (!validatePassword(formData.password)) {
            setMessage({ type: 'error', text: "Password must be at least 8 characters long and contain both numbers and uppercase letters." });
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setMessage({ type: 'error', text: "Passwords do not match!" });
            return;
        }

        setLoading(true);
        try {
            const { password, confirmPassword, ...userData } = formData;
            const newUser = { ...userData, password };
            const { response } = await createUsername(newUser);
            if (response.ok) {
                setMessage({ type: 'success', text: "Account created successfully! Redirecting to login..." });
                setTimeout(() => navigate("/login"), 1500);
            } else {
                const data = await response.json();
                setMessage({ type: 'error', text: data.error || "Registration failed" });
            }
        } catch (error) {
            setMessage({ type: 'error', text: "Registration failed: " + error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={"RegisterPage-page"}>
            <div className={"RegisterPage-card"}>
                <div className={"RegisterPage-main"}>
                    <div className={"RegisterPage-header"}>
                        <div className={"RegisterPage-logo"}>GACS</div>
                        <h1>Create your Account</h1>
                        <p>to continue to Coordination</p>
                    </div>

                    {message.text && (
                        <div className={`form-message form-message-${message.type}`}>
                            {message.text}
                        </div>
                    )}

                    <form className={"RegisterPage-form"} onSubmit={handleSubmit}>
                        <div className={"RegisterPage-row"}>
                            <input name="firstName" placeholder="First name" onChange={handleChange} required />
                            <input name="lastName" placeholder="Last name" onChange={handleChange} required />
                        </div>
                        <input name="username" placeholder="Username" onChange={handleChange} required className={"RegisterPage-full"} />
                        <input name="email" type="email" placeholder="Email address" onChange={handleChange} required className={"RegisterPage-full"} />
                        
                        <div className={"RegisterPage-row"}>
                            <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
                            <input name="confirmPassword" type="password" placeholder="Confirm" onChange={handleChange} required />
                        </div>

                        <div className={"RegisterPage-footer"}>
                            <Link to="/login" className={"RegisterPage-link"}>Sign in instead</Link>
                            <button type="submit" className={"RegisterPage-nextBtn"} disabled={loading}>
                                {loading ? 'Creating...' : 'Create account'}
                            </button>
                        </div>
                    </form>
                </div>

                <div className={"RegisterPage-side"}>
                    <div className={"RegisterPage-illustration"}>
                        <div className={"RegisterPage-circle"}>
                            <div className={"RegisterPage-innerCircle"}></div>
                        </div>
                        <p>One account. All of Coordination working for you.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
