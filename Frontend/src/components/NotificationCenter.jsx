import { useState, useEffect } from 'react';
import { fetchNotifications } from '@services/authService';
import '../assets/css/NotificationCenter.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faBell } from '@fortawesome/free-solid-svg-icons';

function NotificationCenter({ groupId, onClose }) {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadNotifications = async () => {
            if (!groupId) return;
            try {
                const { data } = await fetchNotifications(groupId);
                setNotifications(data);
            } catch (error) {
                console.error("Failed to load notifications:", error);
            } finally {
                setLoading(false);
            }
        };

        loadNotifications();
        // Poll for new notifications every 10 seconds
        const interval = setInterval(loadNotifications, 10000);
        return () => clearInterval(interval);
    }, [groupId]);

    return (
        <div className="NotificationCenter-panel">
            <div className="NotificationCenter-header">
                <h3><FontAwesomeIcon icon={faBell} style={{ marginRight: '8px' }} /> Activity</h3>
                <button onClick={onClose} className="btn-icon">
                    <FontAwesomeIcon icon={faTimes} />
                </button>
            </div>
            <div className="NotificationCenter-list">
                {loading ? (
                    <div className="Notification-empty">Loading activity...</div>
                ) : notifications.length === 0 ? (
                    <div className="Notification-empty">No recent activity</div>
                ) : (
                    notifications.map(notif => (
                        <div key={notif.id} className="Notification-item">
                            <p>{notif.message}</p>
                            <span className="Notification-time">
                                {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default NotificationCenter;
