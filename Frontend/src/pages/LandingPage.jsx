import '../assets/css/LandingPage.css';
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faTasks, faChartLine, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

function LandingPage() {
    return (
        <div className={"LandingPage-page"}>
            <nav className={"LandingPage-nav"}>
                <div className={"LandingPage-logo"}>
                    <div className={"LandingPage-logoIcon"}>GACS</div>
                    <span>Coordination</span>
                </div>
                <div className={"LandingPage-navLinks"}>
                    <Link to="/login" className={"LandingPage-loginLink"}>Sign in</Link>
                    <Link to="/register" className={"LandingPage-registerBtn"}>Create an account</Link>
                </div>
            </nav>

            <main className={"LandingPage-hero"}>
                <div className={"LandingPage-heroContent"}>
                    <h1>Managing group projects just got easier.</h1>
                    <p>
                        From classroom assignments to team projects, Coordination helps everyone stay accountable and on schedule.
                        Create groups, assign tasks, and track progress all in one place.
                    </p>
                    <div className={"LandingPage-ctaWrapper"}>
                        <Link to="/register" className={"LandingPage-mainCta"}>Get started for free</Link>
                        <span className={"LandingPage-subText"}>No credit card required</span>
                    </div>
                </div>
                <div className={"LandingPage-heroImage"}>
                    <div className={"LandingPage-floatingCard"}>
                        <FontAwesomeIcon icon={faUsers} className={"LandingPage-cardIcon"} />
                        <div className={"LandingPage-cardText"}>
                            <strong>Group Alpha</strong>
                            <span>12 members</span>
                        </div>
                    </div>
                    <div className={"LandingPage-floatingCard"} style={{ top: '40%', right: '-20px' }}>
                        <FontAwesomeIcon icon={faTasks} className={"LandingPage-cardIcon"} style={{ color: '#f9ab00' }} />
                        <div className={"LandingPage-cardText"}>
                            <strong>Project Beta</strong>
                            <span>85% complete</span>
                        </div>
                    </div>
                    <div className={"LandingPage-floatingCard"} style={{ bottom: '20%', left: '-40px' }}>
                        <FontAwesomeIcon icon={faCheckCircle} className={"LandingPage-cardIcon"} style={{ color: '#1ea450' }} />
                        <div className={"LandingPage-cardText"}>
                            <strong>Final Submission</strong>
                            <span>Done</span>
                        </div>
                    </div>
                </div>
            </main>

            <section className={"LandingPage-features"}>
                <div className={"LandingPage-feature"}>
                    <FontAwesomeIcon icon={faUsers} />
                    <h3>Group Coordination</h3>
                    <p>Easily invite members and manage team roles.</p>
                </div>
                <div className={"LandingPage-feature"}>
                    <FontAwesomeIcon icon={faTasks} />
                    <h3>Task Management</h3>
                    <p>Break down assignments into manageable tasks.</p>
                </div>
                <div className={"LandingPage-feature"}>
                    <FontAwesomeIcon icon={faChartLine} />
                    <h3>Progress Tracking</h3>
                    <p>Visual indicators for project health and deadlines.</p>
                </div>
            </section>
        </div>
    );
}

export default LandingPage;
