'use client';

import { FaStar } from 'react-icons/fa';
import Image from 'next/image';
import { motion } from 'framer-motion';

const testimonials = [
  {
    id: 1,
    name: 'John Doe',
    photo: '/clients/client-1.jpg',
    review: 'Absolutely love my new truck! The team was incredibly helpful and made the process seamless. Highly recommend!',
    rating: 5,
  },
  {
    id: 2,
    name: 'Jane Smith',
    photo: '/clients/client-2.jpg',
    review: 'Great selection of trucks and top-notch customer service. My purchase was smooth, and the truck is fantastic!',
    rating: 4,
  },
  {
    id: 3,
    name: 'Mike Johnson',
    photo: '/clients/client-3.jpg',
    review: 'The quality of the trucks here is unmatched. The staff was knowledgeable and guided me to the perfect vehicle.',
    rating: 5,
  },
];

export default function ClientReviews() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            What Our Clients Say
          </motion.h2>
          <motion.p
            className="sm:text-xl text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Hear from our satisfied customers about their experience with our trucks.
          </motion.p>
        </div>

        <div className="flex overflow-x-auto sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-4 sm:pb-0 snap-x snap-mandatory scrollbar scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col items-center text-center min-w-[280px] sm:min-w-0 snap-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: testimonial.id * 0.2 }}
            >
              <div className="relative w-20 h-20 mb-4">
                <Image
                  src={testimonial.photo}
                  alt={testimonial.name}
                  fill
                  className="rounded-full object-cover"
                  sizes="80px"
                  priority
                />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">{testimonial.name}</h3>
              <div className="flex mb-3">
                {[...Array(5)].map((_, index) => (
                  <FaStar
                    key={index}
                    className={`w-5 h-5 ${
                      index < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-600 text-sm">{testimonial.review}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}