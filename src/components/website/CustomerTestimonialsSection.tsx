import React from 'react';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';

const customerTestimonials = [
  {
    id: 1,
    name: 'Sarah Miller',
    position: 'CEO',
    company: 'TechFlow',
    avatar: 'SM',
    avatarColor: 'from-purple-500 to-pink-500',
    testimonial: 'StartBusiness transformed how we manage our operations. The CRM is intuitive and the analytics are incredibly powerful.',
    rating: 5
  },
  {
    id: 2,
    name: 'Robert Johnson',
    position: 'Founder',
    company: 'InnovateLab',
    avatar: 'RJ',
    avatarColor: 'from-green-500 to-teal-500',
    testimonial: 'The best investment we made for our startup. The platform scales with our business and the support is exceptional.',
    rating: 5
  },
  {
    id: 3,
    name: 'Anna Chen',
    position: 'Marketing Director',
    company: 'GrowthCo',
    avatar: 'AC',
    avatarColor: 'from-pink-500 to-purple-500',
    testimonial: 'Game-changer for our team productivity. We\'ve seen 40% improvement in lead conversion since switching to StartBusiness.',
    rating: 5
  }
];

export const CustomerTestimonialsSection: React.FC = () => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-400'
        }`}
      />
    ));
  };

  return (
    <div className="py-20 lg:py-32 bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-purple-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            <span className="text-white">
              What Our{' '}
            </span>
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Customers Say
            </span>
          </h2>
          <p className="text-lg text-purple-200 max-w-3xl mx-auto">
            Don't just take our word for it. See what business leaders are saying about 
            DreamCodex and how we've transformed their operations.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {customerTestimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              {/* Rating Stars */}
              <div className="flex justify-center mb-6">
                {renderStars(testimonial.rating)}
              </div>

              {/* Testimonial Text */}
              <blockquote className="text-purple-100 text-center leading-relaxed mb-8 text-base lg:text-lg">
                "{testimonial.testimonial}"
              </blockquote>

              {/* Customer Info */}
              <div className="flex flex-col items-center">
                {/* Avatar */}
                <div className={`w-16 h-16 bg-gradient-to-r ${testimonial.avatarColor} rounded-full flex items-center justify-center mb-4 shadow-lg`}>
                  <span className="text-white font-bold text-lg">
                    {testimonial.avatar}
                  </span>
                </div>

                {/* Name and Position */}
                <h4 className="text-white font-semibold text-lg mb-1">
                  {testimonial.name}
                </h4>
                <p className="text-purple-300 text-sm">
                  {testimonial.position}, {testimonial.company}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Decorative Element */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex justify-center mt-12"
        >
          <div className="flex items-center space-x-2">
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-purple-400"></div>
            <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
            <div className="w-24 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400"></div>
            <div className="w-3 h-3 bg-gradient-to-r from-pink-400 to-cyan-400 rounded-full"></div>
            <div className="w-12 h-0.5 bg-gradient-to-r from-cyan-400 to-transparent"></div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};