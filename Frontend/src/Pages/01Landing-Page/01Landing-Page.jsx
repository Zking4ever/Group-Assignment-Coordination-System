import styles from './01Landing-Page.module.css'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faTasks, faChartLine, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

function LandingPage() {
    return (
        <div className={styles.page}>
            <nav className={styles.nav}>
                <div className={styles.logo}>
                    <div className={styles.logoIcon}>G</div>
                    <span>Coordination</span>
                </div>
                <div className={styles.navLinks}>
                    <Link to="/login" className={styles.loginLink}>Sign in</Link>
                    <Link to="/register" className={styles.registerBtn}>Create an account</Link>
                </div>
            </nav>

            <main className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1>Managing group projects just got easier.</h1>
                    <p>
                        From classroom assignments to team projects, Coordination helps everyone stay accountable and on schedule. 
                        Create groups, assign tasks, and track progress all in one place.
                    </p>
                    <div className={styles.ctaWrapper}>
                        <Link to="/register" className={styles.mainCta}>Get started for free</Link>
                        <span className={styles.subText}>No credit card required</span>
                    </div>
                </div>
                <div className={styles.heroImage}>
                    <div className={styles.floatingCard}>
                        <FontAwesomeIcon icon={faUsers} className={styles.cardIcon} />
                        <div className={styles.cardText}>
                            <strong>Group Alpha</strong>
                            <span>12 members</span>
                        </div>
                    </div>
                    <div className={styles.floatingCard} style={{ top: '40%', right: '-20px' }}>
                        <FontAwesomeIcon icon={faTasks} className={styles.cardIcon} style={{ color: '#f9ab00' }} />
                        <div className={styles.cardText}>
                            <strong>Project Beta</strong>
                            <span>85% complete</span>
                        </div>
                    </div>
                    <div className={styles.floatingCard} style={{ bottom: '20%', left: '-40px' }}>
                        <FontAwesomeIcon icon={faCheckCircle} className={styles.cardIcon} style={{ color: '#1ea450' }} />
                        <div className={styles.cardText}>
                            <strong>Final Submission</strong>
                            <span>Done</span>
                        </div>
                    </div>
                </div>
            </main>

            <section className={styles.features}>
                <div className={styles.feature}>
                    <FontAwesomeIcon icon={faUsers} />
                    <h3>Group Coordination</h3>
                    <p>Easily invite members and manage team roles.</p>
                </div>
                <div className={styles.feature}>
                    <FontAwesomeIcon icon={faTasks} />
                    <h3>Task Management</h3>
                    <p>Break down assignments into manageable tasks.</p>
                </div>
                <div className={styles.feature}>
                    <FontAwesomeIcon icon={faChartLine} />
                    <h3>Progress Tracking</h3>
                    <p>Visual indicators for project health and deadlines.</p>
                </div>
            </section>
        </div>
    );
}

export default LandingPage;