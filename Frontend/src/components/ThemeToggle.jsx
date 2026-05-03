import React from 'react';
import { useTheme } from './ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <motion.button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
                position: 'fixed',
                bottom: '24px',
                right: '24px',
                width: '48px',
                height: '48px',
                borderRadius: '5px',
                backgroundColor: 'var(--surface-color)',
                border: '1px solid var(--text-primary)',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 9999,
            }}
        >
            <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} size="lg" />
        </motion.button>
    );
}
