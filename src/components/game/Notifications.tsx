import { useGameStore } from '@/store/gameStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

const TYPE_COLORS = {
  harvest: '#FFD700',
  produce: '#22c55e',
  day: '#ffffff',
  info: '#93c5fd',
};

export const Notifications = () => {
  const { notifications, removeNotification } = useGameStore();

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      notifications.forEach(n => {
        if (now - n.createdAt > 3000) {
          removeNotification(n.id);
        }
      });
    }, 500);
    return () => clearInterval(timer);
  }, [notifications]);

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center gap-2 pointer-events-none">
      <AnimatePresence>
        {notifications.slice(-4).map(n => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 1.2 }}
            transition={{ duration: 0.4 }}
            className="px-4 py-2 rounded-xl shadow-xl"
            style={{
              background: 'rgba(20, 10, 5, 0.9)',
              border: '2px solid #7a5c2e',
              color: TYPE_COLORS[n.type] || '#ffffff',
              fontFamily: "'Press Start 2P', monospace",
              fontSize: '10px',
            }}
          >
            {n.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
