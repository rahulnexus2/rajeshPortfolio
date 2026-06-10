import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { FaLock, FaTimes, FaShieldAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLoginModal = ({ isOpen, onClose }) => {
  const { login } = useAdmin();
  const [secretKey, setSecretKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!secretKey.trim()) {
      setError('Please enter the secret key.');
      return;
    }
    
    setError('');
    setLoading(true);
    const result = await login(secretKey);
    setLoading(false);
    
    if (result.success) {
      setSecretKey('');
      onClose();
    } else {
      setError(result.message);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-sm p-6 glass-panel rounded-2xl shadow-2xl border border-white/5 bg-slate-950/90 overflow-hidden"
          >
            {/* Absolute accent border glow inside */}
            <div className="absolute inset-0 border border-white/5 pointer-events-none rounded-2xl" />
            
            {/* Close button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
            >
              <FaTimes size={14} />
            </button>

            {/* Shield Indicator */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-11 h-11 rounded-xl bg-slate-900/80 flex items-center justify-center text-indigo-400 mb-3 border border-white/5 shadow-glow-sm">
                <FaShieldAlt size={18} />
              </div>
              <h3 className="text-sm font-bold text-white font-display uppercase tracking-wider">CMS Verification</h3>
              <p className="text-[10px] text-slate-500 mt-1 max-w-[200px] font-sans">
                Submit your developer access key to authorize edit privileges.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                    <FaLock size={12} />
                  </span>
                  <input
                    type="password"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    placeholder="Enter Secret Key"
                    className="cyber-input pl-9.5 py-2.5 text-xs focus:border-indigo-500/50"
                    autoFocus
                  />
                </div>
                
                {error && (
                  <p className="text-rose-400 text-[10px] mt-2 bg-rose-950/15 py-1.5 px-3 rounded-xl border border-rose-900/30 font-sans">
                    {error}
                  </p>
                )}
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-2.5 flex items-center justify-center font-bold text-xs"
                whileHover={{ scale: 1.02, boxShadow: '0 0 15px rgba(255, 255, 255, 0.15)' }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? 'Verifying...' : 'Authorize CMS'}
              </motion.button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AdminLoginModal;
