"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaQuestionCircle } from 'react-icons/fa';

const FaqItem = ({ question, answer, isOpen, toggleOpen }) => {
  return (
    <motion.div
      className="border border-gray-200 rounded-xl mb-4 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
      whileHover={{ y: -2 }}
    >
      <button
        className="flex justify-between items-center w-full p-5 text-left bg-white hover:bg-blue-50/50 transition-colors duration-200"
        onClick={toggleOpen}
      >
        <span className="font-semibold text-gray-900 text-lg">{question}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <FaChevronDown className={`w-5 h-5 ${isOpen ? 'text-blue-600' : 'text-gray-400'}`} />
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-5 pt-0 border-t border-gray-100 bg-white">
              <p className="text-gray-600 text-base leading-relaxed">{answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function FaqSection() {
  const [openId, setOpenId] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/faq');
        
        if (!response.ok) {
          throw new Error('Failed to fetch FAQs');
        }
        
        const data = await response.json();
        setFaqs(data.faqs.filter(faq => faq.isActive));
        setLoading(false);
      } catch (err) {
        console.error('Error fetching FAQs:', err);
        setError('Unable to load FAQs. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchFaqs();
  }, []);

  const toggleFaq = (id) => {
    setOpenId(openId === id ? null : id);
  };

  if (loading) {
    return (
      <section className="w-full bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 py-16">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 text-lg">Loading FAQs...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 py-16">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-8 shadow-lg">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-red-900 text-center mb-2">Error Loading FAQs</h3>
              <p className="text-red-700 text-center">{error}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 py-16">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.div
            className="flex justify-center mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <FaQuestionCircle size={48} className="text-[#1A3760]" />
          </motion.div>
          <motion.h2 
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Your Questions, Answered
          </motion.h2>
          <motion.p 
            className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Explore answers to common queries about our automotive solutions
          </motion.p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.length > 0 ? (
            faqs.map(faq => (
              <FaqItem
                key={faq._id}
                question={faq.question}
                answer={faq.answer}
                isOpen={openId === faq._id}
                toggleOpen={() => toggleFaq(faq._id)}
              />
            ))
          ) : (
            <motion.div
              className="text-center p-8 bg-white rounded-2xl border border-gray-200 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-gray-600 text-lg">No FAQs are currently available. Please check back later.</p>
            </motion.div>
          )}
        </div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-gray-600 text-lg mb-4">Still have questions?</p>
          <a
            href="https://wa.me/923334928431"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-full text-[#1A3760] bg-transparent border-2 border-[#1A3760] hover:bg-[#1A3760] hover:text-white transition-all duration-300"
          >
            Contact Us on WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  );
}