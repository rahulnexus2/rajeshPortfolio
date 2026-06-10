import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { contactAPI } from '../utils/api';
import { FaPaperPlane, FaSpinner, FaCheckCircle, FaExclamationCircle, FaMapMarkerAlt, FaEnvelope, FaPhone } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Contact = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');

  const onSubmit = async (data) => {
    setSubmitting(true);
    setSubmitStatus(null);
    setStatusMessage('');

    try {
      const response = await contactAPI.submit(data);
      setSubmitStatus('success');
      setStatusMessage(response.message || 'Your message has been sent successfully!');
      reset();
    } catch (error) {
      setSubmitStatus('error');
      setStatusMessage(error.response?.data?.message || 'Error sending message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-28 relative overflow-hidden bg-transparent border-t border-white/5">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div 
          className="text-left mb-16"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 font-display">05 / Contact</span>
          <h2 className="section-heading mt-1 font-display tracking-tight text-white">Let's Build Something Great Together</h2>
          <div className="h-[1px] w-full bg-white/5 mt-4" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Contact details info */}
          <motion.div 
            className="lg:col-span-5 space-y-6 flex flex-col justify-center"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="sub-heading text-white font-display font-semibold text-lg sm:text-xl">Get In Touch</h3>
            <p className="body-text max-w-sm text-slate-300">
              If you have any questions, role requirements, or project opportunities, fill out the form or reach out directly.
            </p>

            <div className="space-y-4 pt-6 border-t border-white/5 max-w-sm">
              <div className="flex items-center gap-3.5 group">
                <span className="text-slate-500 group-hover:text-indigo-400 transition-colors"><FaMapMarkerAlt size={12} /></span>
                <span className="text-xs text-slate-400 font-sans font-medium">New Delhi, India</span>
              </div>
              <div className="flex items-center gap-3.5 group">
                <span className="text-slate-500 group-hover:text-indigo-400 transition-colors"><FaEnvelope size={12} /></span>
                <span className="text-xs text-slate-400 font-sans font-medium">
                  <a href="mailto:rajesh@example.com" className="hover:text-indigo-300 transition-colors hover:underline">rajesh@example.com</a>
                </span>
              </div>
              <div className="flex items-center gap-3.5 group">
                <span className="text-slate-500 group-hover:text-indigo-400 transition-colors"><FaPhone size={12} /></span>
                <span className="text-xs text-slate-400 font-sans font-medium">+91 9876543210</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Premium Contact Form */}
          <motion.div 
            className="lg:col-span-7 w-full"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="premium-card p-6 sm:p-8 border-white/5 bg-slate-900/40 shadow-xl rounded-2xl relative overflow-hidden group hover:border-indigo-500/10 transition-colors duration-300">
              {/* Internal absolute background glow */}
              <div className="absolute -left-20 -bottom-20 w-40 h-40 rounded-full bg-indigo-500/5 blur-xl pointer-events-none" />
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative z-10">
                
                {/* Status messages with AnimatePresence */}
                <AnimatePresence mode="popLayout">
                  {submitStatus === 'success' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0, y: -10 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -10 }}
                      className="flex items-center gap-2.5 p-3.5 rounded-xl bg-emerald-950/15 border border-emerald-900/30 text-emerald-400 text-xs font-sans overflow-hidden"
                    >
                      <FaCheckCircle size={14} className="flex-shrink-0" />
                      <span>{statusMessage}</span>
                    </motion.div>
                  )}
                  {submitStatus === 'error' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0, y: -10 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -10 }}
                      className="flex items-center gap-2.5 p-3.5 rounded-xl bg-rose-950/15 border border-rose-900/30 text-rose-400 text-xs font-sans overflow-hidden"
                    >
                      <FaExclamationCircle size={14} className="flex-shrink-0" />
                      <span>{statusMessage}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Name Input */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 font-display">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      placeholder="e.g. John Doe"
                      {...register('name', { 
                        required: 'Name is required', 
                        minLength: { value: 2, message: 'Name must be at least 2 characters' } 
                      })}
                      className={`cyber-input py-2.5 ${
                        errors.name 
                          ? 'border-rose-950/50 focus:border-rose-900/60 focus:ring-rose-900/10' 
                          : 'focus:border-indigo-500/50'
                      }`}
                    />
                    {errors.name && (
                      <p className="text-rose-400 text-[10px] mt-1 font-sans">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Email Input */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 font-display">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      placeholder="john@example.com"
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address format'
                        }
                      })}
                      className={`cyber-input py-2.5 ${
                        errors.email 
                          ? 'border-rose-950/50 focus:border-rose-900/60 focus:ring-rose-900/10' 
                          : 'focus:border-indigo-500/50'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-rose-400 text-[10px] mt-1 font-sans">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                {/* Subject Input */}
                <div className="space-y-2">
                  <label htmlFor="subject" className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 font-display">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    placeholder="Project Inquiry"
                    {...register('subject')}
                    className="cyber-input py-2.5 focus:border-indigo-500/50"
                  />
                </div>

                {/* Message Input */}
                <div className="space-y-2">
                  <label htmlFor="message" className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 font-display">
                    Message
                  </label>
                  <textarea
                    id="message"
                    placeholder="Describe your inquiry details..."
                    rows="5"
                    {...register('message', { 
                      required: 'Message is required',
                      minLength: { value: 10, message: 'Message must be at least 10 characters long' }
                    })}
                    className={`cyber-input resize-none py-2.5 ${
                      errors.message 
                        ? 'border-rose-950/50 focus:border-rose-900/60 focus:ring-rose-900/10' 
                        : 'focus:border-indigo-500/50'
                    }`}
                  />
                  {errors.message && (
                    <p className="text-rose-400 text-[10px] mt-1 font-sans">{errors.message.message}</p>
                  )}
                </div>

                {/* Submit Action Button */}
                <div className="flex justify-end pt-2">
                  <motion.button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary py-2.5 px-6 flex items-center justify-center gap-2 font-bold text-xs w-full sm:w-auto"
                    whileHover={{ scale: 1.02, boxShadow: '0 0 15px rgba(255, 255, 255, 0.15)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {submitting ? (
                      <>
                        <FaSpinner className="animate-spin text-slate-900" size={11} /> Sending...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane size={10} /> Send Message
                      </>
                    )}
                  </motion.button>
                </div>

              </form>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default Contact;
