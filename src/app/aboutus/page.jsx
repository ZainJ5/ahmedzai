"use client"



import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaGlobeAsia, FaCheck, FaHandshake, FaTruckMoving, FaUserTie, FaClock } from 'react-icons/fa';

const AboutUs = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      <div className="relative w-full h-[500px]">
        <Image
          src="/hero-1.png"
          alt="Japanese Vehicles Export"
          layout="fill"
          objectFit="cover"
          className="brightness-40"
          priority
        />
        <div className="absolute inset-0 bg-[#141e32]/70 flex items-center justify-center">
          <motion.div
            className="text-center text-white px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              About Ahmadzai Trading Co. Ltd
            </motion.h1>
            <motion.div
              className="h-1 w-24 bg-blue-500 mx-auto mb-6"
              initial={{ width: 0 }}
              animate={{ width: 96 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            />
            <motion.p
              className="text-xl md:text-2xl max-w-3xl mx-auto font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Trusted Japanese Vehicle Exporters Since 2001
            </motion.p>
          </motion.div>
        </div>
      </div>

      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <motion.div
            className="md:w-1/2"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-left mb-8">
              <motion.h2
                className="text-3xl sm:text-4xl font-bold text-[#141e32] mb-3"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                Company Introduction
              </motion.h2>
              <motion.div
                className="h-1 w-20 bg-blue-500 mb-6"
                initial={{ width: 0 }}
                whileInView={{ width: 80 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              />
              <motion.p
                className="text-lg text-gray-600"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Delivering excellence in Japanese vehicle exports
              </motion.p>
            </div>
            <motion.p
              className="text-gray-700 mb-6 leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Founded in 2001, Ahmadzai Trading Co. Ltd. is a trusted name in the export of used Japanese vehicles
              including cars, buses, trucks, vans, pickups, and more. Headquartered in Sakai Machi, Sashima Gun,
              Ibaraki Ken, Japan, we operate with a strong international presence through our offices in Pakistan,
              UAE, Afghanistan, and Japan.
            </motion.p>
            <motion.p
              className="text-gray-700 leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              We source vehicles from trusted Japanese auctions, local sellers, and our own exclusive stock. With
              over two decades of industry experience, our company proudly serves a wide range of clients including
              B2B buyers, contractors, dealers, and individual clients around the globe.
            </motion.p>
          </motion.div>
          <motion.div
            className="md:w-1/2 relative h-96 shadow-2xl rounded-lg overflow-hidden"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <video
              src="/about.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            ></video>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-[#141e32]/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <motion.h2
              className="text-3xl sm:text-4xl font-bold text-[#141e32] mb-3"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Our Mission
            </motion.h2>
            <motion.p
              className="text-lg text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Committed to excellence in every vehicle we deliver
            </motion.p>
          </div>

          <motion.div
            className="bg-white p-10 shadow-xl rounded-lg border-t-4 border-[#141e32]"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.p
              className="text-[#141e32] mb-10 text-center italic text-2xl leading-relaxed font-light"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              "To build strong relationships and provide authentic Japanese vehicles with transparent pricing and
              fastest delivery, while empowering our clients with market knowledge."
            </motion.p>

            <motion.div
              className="grid md:grid-cols-2 gap-8 mt-12"
              variants={staggerChildren}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div className="flex items-start" variants={fadeIn}>
                <div className="bg-[#141e32]/10 p-4 rounded-full mr-5">
                  <FaHandshake className="text-[#141e32] text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#141e32] mb-3">
                    Build Long-Term Relationships
                  </h3>
                  <p className="text-gray-600">
                    Fostering strong and lasting business relationships with buyers worldwide
                  </p>
                </div>
              </motion.div>

              <motion.div className="flex items-start" variants={fadeIn}>
                <div className="bg-[#141e32]/10 p-4 rounded-full mr-5">
                  <FaCheck className="text-[#141e32] text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#141e32] mb-3">
                    Provide Authentic Vehicles
                  </h3>
                  <p className="text-gray-600">
                    Delivering thoroughly inspected, quality Japanese vehicles
                  </p>
                </div>
              </motion.div>

              <motion.div className="flex items-start" variants={fadeIn}>
                <div className="bg-[#141e32]/10 p-4 rounded-full mr-5">
                  <FaTruckMoving className="text-[#141e32] text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#141e32] mb-3">
                    Ensure Transparent Pricing & Fast Delivery
                  </h3>
                  <p className="text-gray-600">
                    Maintaining clear pricing structures and optimizing logistics for quick delivery
                  </p>
                </div>
              </motion.div>

              <motion.div className="flex items-start" variants={fadeIn}>
                <div className="bg-[#141e32]/10 p-4 rounded-full mr-5">
                  <FaUserTie className="text-[#141e32] text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#141e32] mb-3">
                    Educate Our Clients
                  </h3>
                  <p className="text-gray-600">
                    Helping clients understand the Japanese vehicle market from an insider's perspective
                  </p>
                </div>
              </motion.div>
            </motion.div>

            <motion.p
              className="text-gray-700 mt-12 text-center font-medium"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              We strive to become more than just an exporter — we aim to be your reliable partner and advisor in the Japanese automobile trade.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold text-[#141e32] mb-3"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Why Choose Us
          </motion.h2>
          <motion.div
            className="h-1 w-20 bg-blue-500 mx-auto mb-6"
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          />
          <motion.p
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Decades of experience and a dedication to excellence
          </motion.p>
        </div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div
            className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 border-t-4 border-[#141e32] group"
            variants={fadeIn}
          >
            <div className="flex items-center mb-5">
              <div className="bg-[#141e32]/10 p-4 rounded-full mr-4 group-hover:bg-[#141e32] transition-colors duration-300">
                <FaClock className="text-[#141e32] text-2xl group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold text-[#141e32]">
                Over 20 Years of Experience
              </h3>
            </div>
            <p className="text-gray-600 ml-[72px]">
              We've been active in Japan's vehicle export industry since 2001, building trust with thousands of satisfied customers worldwide.
            </p>
          </motion.div>

          <motion.div
            className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 border-t-4 border-[#141e32] group"
            variants={fadeIn}
          >
            <div className="flex items-center mb-5">
              <div className="bg-[#141e32]/10 p-4 rounded-full mr-4 group-hover:bg-[#141e32] transition-colors duration-300">
                <FaGlobeAsia className="text-[#141e32] text-2xl group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold text-[#141e32]">
                Global Reach, Local Service
              </h3>
            </div>
            <p className="text-gray-600 ml-[72px]">
              With offices in Japan, Pakistan, UAE, and Afghanistan, we provide support tailored to each client's region and needs.
            </p>
          </motion.div>

          <motion.div
            className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 border-t-4 border-[#141e32] group"
            variants={fadeIn}
          >
            <div className="flex items-center mb-5">
              <div className="bg-[#141e32]/10 p-4 rounded-full mr-4 group-hover:bg-[#141e32] transition-colors duration-300">
                <FaCheck className="text-[#141e32] text-2xl group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold text-[#141e32]">
                Verified Sources & In-House Stock
              </h3>
            </div>
            <p className="text-gray-600 ml-[72px]">
              We source from leading auctions across Japan and maintain our own curated stock to ensure variety, availability, and transparency.
            </p>
          </motion.div>

          <motion.div
            className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 border-t-4 border-[#141e32] group"
            variants={fadeIn}
          >
            <div className="flex items-center mb-5">
              <div className="bg-[#141e32]/10 p-4 rounded-full mr-4 group-hover:bg-[#141e32] transition-colors duration-300">
                <FaUserTie className="text-[#141e32] text-2xl group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold text-[#141e32]">
                Focused on B2B & Contractors
              </h3>
            </div>
            <p className="text-gray-600 ml-[72px]">
              We understand the commercial needs of bulk buyers and contractors, offering them cost-effective and reliable solutions.
            </p>
          </motion.div>

          <motion.div
            className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 border-t-4 border-[#141e32] group"
            variants={fadeIn}
          >
            <div className="flex items-center mb-5">
              <div className="bg-[#141e32]/10 p-4 rounded-full mr-4 group-hover:bg-[#141e32] transition-colors duration-300">
                <FaHandshake className="text-[#141e32] text-2xl group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold text-[#141e32]">
                Client-Centric Philosophy
              </h3>
            </div>
            <p className="text-gray-600 ml-[72px]">
              Our success is built on relationships, education, and empowerment. We guide our clients like insiders of the Japanese market.
            </p>
          </motion.div>

          <motion.div
            className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 border-t-4 border-[#141e32] group"
            variants={fadeIn}
          >
            <div className="flex items-center mb-5">
              <div className="bg-[#141e32]/10 p-4 rounded-full mr-4 group-hover:bg-[#141e32] transition-colors duration-300">
                <FaTruckMoving className="text-[#141e32] text-2xl group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold text-[#141e32]">
                Quality & Timely Delivery
              </h3>
            </div>
            <p className="text-gray-600 ml-[72px]">
              Every vehicle undergoes thorough inspection, with logistics handled to ensure safe, timely delivery across the globe.
            </p>
          </motion.div>
        </motion.div>
      </section>

      <section className="py-20 px-4 bg-[#141e32] text-white">
        <motion.div
          className="max-w-7xl mx-auto text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-3xl sm:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Ready to Partner with Us?
          </motion.h2>
          <motion.div
            className="h-1 w-20 bg-blue-500 mx-auto mb-6"
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          />
          <motion.p
            className="text-xl mb-10 max-w-3xl mx-auto font-light"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Join thousands of satisfied customers worldwide who trust Ahmadzai Trading Co. Ltd.
            for quality Japanese vehicles and exceptional service.
          </motion.p>
          <motion.a
            href="https://wa.me/+819027801563"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-[#141e32] font-bold py-4 px-10 rounded-lg hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl"
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Contact Us Today
          </motion.a>

        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;