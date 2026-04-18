import '../assets/css/LandingPage.css';
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faTasks, faChartLine, faCheckCircle, faShieldHalved, faRocket, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

function LandingPage() {
    return (
        <div className={"LandingPage-page"}>
            <nav className={"LandingPage-nav"}>
                <div className={"LandingPage-logo"}>
                    <div className={"LandingPage-logoIcon"}>G</div>
                    <span>Coordination</span>
                </div>
                <div className={"LandingPage-navLinks"}>
                    <Link to="/login" className={"LandingPage-loginLink"}>Sign in</Link>
                    <Link to="/register" className={"LandingPage-registerBtn"}>Get Started</Link>
                </div>
            </nav>

            <main className={"LandingPage-hero"}>
                <motion.div 
                    className={"LandingPage-heroContent"}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                    >
                        The OS for<br />Group Coordination.
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                    >
                        Stop the chaos of spreadsheets and lost messages. Coordination provides the tools teams need to stay aligned, accountable, and ahead of schedule.
                    </motion.p>
                    <motion.div 
                        className={"LandingPage-ctaWrapper"}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                    >
                        <Link to="/register" className={"LandingPage-mainCta"}>Create an Account</Link>
                        <span className={"LandingPage-subText"}>Free for solo students & small teams</span>
                    </motion.div>
                </motion.div>

                <motion.div 
                    className={"LandingPage-heroImage"}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 1 }}
                >
                    <div className="LandingPage-mockup">
                        <motion.div 
                            className={"LandingPage-floatingCard"}
                            style={{ top: '10%', left: '-10%' }}
                            animate={{ y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        >
                            <FontAwesomeIcon icon={faUsers} className={"LandingPage-cardIcon"} />
                            <div className={"LandingPage-cardText"}>
                                <strong>Team Coordination</strong>
                                <span>12 active members</span>
                            </div>
                        </motion.div>

                        <motion.div 
                            className={"LandingPage-floatingCard"}
                            style={{ bottom: '15%', right: '-5%' }}
                            animate={{ y: [0, 10, 0] }}
                            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.5 }}
                        >
                            <FontAwesomeIcon icon={faCheckCircle} className={"LandingPage-cardIcon"} style={{ color: '#10b981' }} />
                            <div className={"LandingPage-cardText"}>
                                <strong>Project Milestone</strong>
                                <span>85% complete</span>
                            </div>
                        </motion.div>

                        <div className="Mockup-content">
                            {/* Visual representation of an app UI */}
                            <div className="Mockup-line" style={{ width: '60%' }}></div>
                            <div className="Mockup-line" style={{ width: '40%' }}></div>
                            <div className="Mockup-grid">
                                <div className="Mockup-box"></div>
                                <div className="Mockup-box"></div>
                                <div className="Mockup-box"></div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </main>

            <section className={"LandingPage-features"}>
                <motion.div 
                    className={"LandingPage-feature"}
                    whileHover={{ scale: 1.02 }}
                >
                    <FontAwesomeIcon icon={faLayerGroup} />
                    <h3>AI-Powered Scaling</h3>
                    <p>Decompose complex assignments into balanced tasks instantly using advanced LLMs.</p>
                </motion.div>
                <motion.div 
                    className={"LandingPage-feature"}
                    whileHover={{ scale: 1.02 }}
                >
                    <FontAwesomeIcon icon={faRocket} />
                    <h3>Rapid Assignment</h3>
                    <p>Drag-and-drop tasks to members and track real-time progress with automated timers.</p>
                </motion.div>
                <motion.div 
                    className={"LandingPage-feature"}
                    whileHover={{ scale: 1.02 }}
                >
                    <FontAwesomeIcon icon={faShieldHalved} />
                    <h3>Verification Flow</h3>
                    <p>A structured review system for task submissions ensures quality across the board.</p>
                </motion.div>
            </section>
        </div>
    );
}

export default LandingPage;
