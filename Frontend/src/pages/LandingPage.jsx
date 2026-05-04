import '../assets/css/LandingPage.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faTasks, faChartLine, faCheckCircle, faShieldHalved, faRocket, faLayerGroup, faBrain, faBolt, faCodeBranch, faCircleNodes } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

function LandingPage() {
    return (
        <div className="LandingPage-page">
            <nav className="LandingPage-nav">
                <div className="LandingPage-logo">
                    GACS
                </div>
                <div className="LandingPage-navLinks">
                    <Link to="/login" className="LandingPage-loginLink">Sign in</Link>
                    <Link to="/register" className="LandingPage-registerBtn">Get Started</Link>
                </div>
            </nav>

            <main className="LandingPage-hero">
                <motion.div
                    className="LandingPage-heroContent"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
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
                        className="LandingPage-ctaWrapper"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                    >
                        <Link to="/register" className="LandingPage-mainCta">Start for free <span className="LandingPage-arrow">&rarr;</span></Link>
                        <Link to="/contact" className="LandingPage-secondaryCta">Get in touch</Link>
                    </motion.div>
                </motion.div>

                <motion.div
                    className="LandingPage-heroVisual"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 1 }}
                >
                    <div className="LandingPage-terminal">
                        <div className="LandingPage-terminalHeader">
                            <span className="dot dot-red"></span>
                            <span className="dot dot-yellow"></span>
                            <span className="dot dot-green"></span>
                        </div>
                        <div className="LandingPage-terminalBody">
                            <p><span className="text-muted">$</span> ai-coordinator decompose --assignment "Q3 Marketing Strategy"</p>
                            <p className="text-success">&gt; Synthesizing requirements...</p>
                            <p className="text-success">&gt; Generating sub-tasks...</p>
                            <p>&gt; 4 balanced tasks created. Ready for assignment.</p>
                        </div>
                    </div>
                    <div className="LandingPage-dashboardCards">
                        <div className="LandingPage-dashCard">
                            <div className="dashCard-header">
                                <FontAwesomeIcon icon={faTasks} className="text-primary" />
                                <span>Content Drafting</span>
                                <span className="badge badge-pending">Pending</span>
                            </div>
                            <div className="dashCard-metrics">
                                <div className="metric-bar"><div className="metric-fill" style={{ width: '60%' }}></div></div>
                            </div>
                        </div>
                        <div className="LandingPage-dashCard">
                            <div className="dashCard-header">
                                <FontAwesomeIcon icon={faChartLine} className="text-primary" />
                                <span>SEO Optimization</span>
                                <span className="badge badge-active">Active</span>
                            </div>
                            <div className="dashCard-metrics">
                                <div className="metric-bar"><div className="metric-fill" style={{ width: '85%' }}></div></div>
                            </div>
                        </div>
                        <div className="LandingPage-dashCard">
                            <div className="dashCard-header">
                                <FontAwesomeIcon icon={faCheckCircle} className="text-success" />
                                <span>Visual Assets</span>
                                <span className="badge badge-success">Verified</span>
                            </div>
                            <div className="dashCard-metrics">
                                <div className="metric-bar"><div className="metric-fill" style={{ width: '100%' }}></div></div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </main>

            <section className="LandingPage-aboutGrid">
                <div className="LandingPage-gridContainer">
                    <motion.div
                        className="LandingPage-gridItem large-span"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="gridItem-content">
                            <FontAwesomeIcon icon={faBrain} className="gridItem-icon" />
                            <h3>Algorithmic Task Decomposition</h3>
                            <p>Leverage advanced large language models to instantly break down complex, multi-layered assignments into perfectly balanced, actionable tasks. Eliminate the cognitive load of project planning.</p>
                        </div>
                        <div className="gridItem-visual bg-gradient">
                            <FontAwesomeIcon icon={faCircleNodes} className="bg-icon" />
                        </div>
                    </motion.div>

                    <motion.div
                        className="LandingPage-gridItem"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div className="gridItem-content">
                            <FontAwesomeIcon icon={faShieldHalved} className="gridItem-icon" />
                            <h3>Synchronized Verification</h3>
                            <p>A rigorous, structured review pipeline ensures quality control. Submissions are verified before integration, maintaining strict project standards.</p>
                        </div>
                    </motion.div>

                    <motion.div
                        className="LandingPage-gridItem"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <div className="gridItem-content">
                            <FontAwesomeIcon icon={faBolt} className="gridItem-icon" />
                            <h3>Asynchronous Management</h3>
                            <p>Drag-and-drop distribution systems empower leaders to deploy tasks rapidly, tracking real-time progress through automated timers and metric analytics.</p>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}

export default LandingPage;
