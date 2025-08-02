'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success('Message sent successfully!');
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        toast.error(result.message || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id='contact' className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <Toaster position="top-right" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <motion.h2
            className="text-3xl text-nowrap sm:text-4xl font-bold text-gray-900 mb-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Contact Our Team
          </motion.h2>
          <motion.p
            className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Discover premium automotive solutions tailored to your needs
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="rounded-xl overflow-hidden shadow-lg border border-gray-100 transform hover:scale-[1.01] transition-transform duration-300">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3244.733!2d139.833!3d36.058!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzbCsDAzJzI4LjgiTiAxMznCsDUwJzAwLjAiRQ!5e0!3m2!1sen!2sjp!4v1631234567890!5m2!1sen!2sjp" width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Business Location"
              ></iframe>
            </div>

            <div className="space-y-6 bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900">Our Location</h3>
              <p className="text-gray-600 leading-relaxed">
                381-1 KANEOKA, Koga-shi, Ibaraki, Japan
              </p>
              <div>
                <h4 className="text-lg font-medium text-gray-800">Email</h4>
                <p className="text-gray-600 mt-1">
                  <a href="mailto:ahmedzai.trading@gmail.com" className="text-blue-600 hover:text-blue-800 transition-colors">
                    ahmedzai.trading@gmail.com
                  </a>
                </p>
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-800">Phone</h4>
                <p className="text-gray-600 mt-1">
                  <a href="tel:+819027801563" className="text-blue-600 hover:text-blue-800 transition-colors">
                    +81 90-2780-1563
                  </a>
                </p>
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-800">Follow Us</h4>
                <div className="flex space-x-4 mt-2">
                  {[
                    {
                      icon: FaFacebook,
                      href: 'https://www.facebook.com/search/top?q=ahmedzai%20trading%20japan%20co%20ltd',
                      label: 'Facebook'
                    },
                    {
                      icon: FaYoutube,
                      href: 'https://www.youtube.com/@AlmashriqTradingJapanCoLtd',
                      label: 'YouTube'
                    },
                    {
                      icon: FaInstagram,
                      href: 'https://www.instagram.com/ahmedzaitradingjapan/',
                      label: 'Instagram'
                    },
                  ].map(({ href, icon: Icon, label }) => (
                    <Link key={label} href={href} aria-label={label} className="text-gray-600 hover:text-blue-600 transform hover:scale-110 transition-all duration-200">
                      <Icon className="w-6 h-6" />
                    </Link>
                  ))}

                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl shadow-lg border border-gray-100 p-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Send Us a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              {[
                { id: "name", label: "Name", type: "text", required: true },
                { id: "email", label: "Email", type: "email", required: true },
                { id: "phone", label: "Phone", type: "tel", required: false },
              ].map(({ id, label, type, required }) => (
                <div key={id}>
                  <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                    {label} {required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type={type}
                    id={id}
                    name={id}
                    value={formData[id]}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring focus:ring-blue-600 focus:ring-opacity-50 py-2 px-3 transition-all duration-200"
                    required={required}
                  />
                </div>
              ))}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="5"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring focus:ring-blue-600 focus:ring-opacity-50 py-2 px-3 transition-all duration-200"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium py-3 px-4 rounded-md hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
                  }`}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}