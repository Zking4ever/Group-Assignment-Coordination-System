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
                     Group Coordination.
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
                    </motion.div>
                </motion.div>

                <motion.div 
                    className={"LandingPage-heroImage"}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 1 }}
                >
                   
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
