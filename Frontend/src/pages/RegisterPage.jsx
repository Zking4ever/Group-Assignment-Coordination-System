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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        setLoading(true);
        try {
            const { password, confirmPassword, ...userData } = formData;
            const newUser = { ...userData, password };
            const { response } = await createUsername(newUser);
            if (response.ok) {
                alert("Account created successfully!");
                navigate("/login");
            }
        } catch (error) {
            alert("Registration failed: " + error.message);
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
