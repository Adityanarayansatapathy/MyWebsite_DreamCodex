import React from 'react';
import { motion } from 'motion/react';
import { Target, Eye, Heart, Award, Users, Rocket } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

const values = [
  {
    icon: Target,
    title: 'Our Mission',
    description: 'To empower businesses with innovative software solutions that drive growth and efficiency.',
    color: 'from-blue-500 to-blue-600'
  },
  {
    icon: Eye,
    title: 'Our Vision',
    description: 'To be the leading technology partner for businesses seeking digital transformation.',
    color: 'from-purple-500 to-purple-600'
  },
  {
    icon: Heart,
    title: 'Our Values',
    description: 'Excellence, Innovation, Integrity, and Customer Success guide everything we do.',
    color: 'from-cyan-500 to-cyan-600'
  }
];

const achievements = [
  { icon: Award, count: '120+', label: 'Awards Won' },
  { icon: Users, count: '480+', label: 'Happy Clients' },
  { icon: Rocket, count: '720+', label: 'Projects Delivered' }
];

export const AboutSection: React.FC = () => {
  return (
    <div className="py-20 lg:py-32 bg-gradient-to-br from-white/98 via-gray-50/95 to-slate-100/98 dark:from-gray-900/98 dark:via-slate-950/95 dark:to-gray-950/98 relative overflow-hidden">
      {/* Professional Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.04),transparent_60%)] dark:bg-[radial-gradient(circle_at_20%_30%,rgba(139,92,246,0.08),transparent_60%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(139,92,246,0.05),transparent_60%)] dark:bg-[radial-gradient(circle_at_80%_70%,rgba(59,130,246,0.1),transparent_60%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_90%,rgba(16,185,129,0.03),transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_90%,rgba(16,185,129,0.06),transparent_70%)]"></div>

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
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
              About DreamCodex
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            We are a passionate team of developers, designers, and innovators dedicated to creating 
            exceptional digital experiences that transform businesses and drive success.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1579389248774-07907f421a6b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjB0ZWFtJTIwY29sbGFib3JhdGlvbnxlbnwxfHx8fDE3NTc5Nzk0OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Modern office collaboration"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            
            {/* Floating Card */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="absolute -bottom-8 -right-8 glass-card p-6 rounded-xl"
            >
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  5+ Years
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  of Excellence
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
              Building Tomorrow's Technology Today
            </h3>
            
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Founded in 2019, DreamCodex has been at the forefront of digital innovation, 
              helping businesses of all sizes harness the power of technology to achieve their goals. 
              Our team combines technical expertise with creative vision to deliver solutions that 
              not only meet today's needs but anticipate tomorrow's challenges.
            </p>

            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              We believe in the power of collaboration, continuous learning, and pushing the 
              boundaries of what's possible. Every project is an opportunity to create something 
              extraordinary, and we're committed to delivering excellence in everything we do.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 pt-6">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="text-center p-4 rounded-lg glass-subtle"
                >
                  <achievement.icon className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {achievement.count}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {achievement.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Mission, Vision, Values */}
        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="relative group"
            >
              <div className="p-8 rounded-2xl glass-card hover:shadow-xl transition-all duration-300 group-hover:shadow-2xl">
                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-r ${value.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <value.icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {value.description}
                </p>

                {/* Hover Gradient Border */}
                <div className={`absolute inset-0 bg-gradient-to-r ${value.color} rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 -z-10`}></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};