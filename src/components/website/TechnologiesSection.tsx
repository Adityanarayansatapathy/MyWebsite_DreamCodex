import React from 'react';
import { motion } from 'motion/react';
import { Progress } from '../ui/progress';

const technologies = [
  { name: 'Java', expertise: 95, color: 'from-red-500 via-orange-500 to-yellow-500', icon: '☕', bgColor: 'from-red-50 via-orange-50 to-yellow-50 dark:from-red-900/20 dark:via-orange-900/20 dark:to-yellow-900/20' },
  { name: 'Spring Boot', expertise: 90, color: 'from-emerald-500 via-green-500 to-teal-500', icon: '🍃', bgColor: 'from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-900/20 dark:via-green-900/20 dark:to-teal-900/20' },
  { name: 'ReactJS', expertise: 92, color: 'from-blue-500 via-cyan-500 to-sky-500', icon: '⚛️', bgColor: 'from-blue-50 via-cyan-50 to-sky-50 dark:from-blue-900/20 dark:via-cyan-900/20 dark:to-sky-900/20' },
  { name: 'Angular', expertise: 88, color: 'from-red-500 via-rose-500 to-pink-500', icon: '🅰️', bgColor: 'from-red-50 via-rose-50 to-pink-50 dark:from-red-900/20 dark:via-rose-900/20 dark:to-pink-900/20' },
  { name: 'UI/UX Design', expertise: 87, color: 'from-purple-500 via-violet-500 to-indigo-500', icon: '🎨', bgColor: 'from-purple-50 via-violet-50 to-indigo-50 dark:from-purple-900/20 dark:via-violet-900/20 dark:to-indigo-900/20' },
  { name: 'AI/ML', expertise: 85, color: 'from-pink-500 via-rose-500 to-red-500', icon: '🤖', bgColor: 'from-pink-50 via-rose-50 to-red-50 dark:from-pink-900/20 dark:via-rose-900/20 dark:to-red-900/20' },
  { name: 'Python', expertise: 90, color: 'from-blue-600 via-indigo-600 to-purple-600', icon: '🐍', bgColor: 'from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20' },
  { name: 'Cloud Computing', expertise: 89, color: 'from-cyan-500 via-teal-500 to-blue-500', icon: '☁️', bgColor: 'from-cyan-50 via-teal-50 to-blue-50 dark:from-cyan-900/20 dark:via-teal-900/20 dark:to-blue-900/20' },
  { name: 'Deployment', expertise: 91, color: 'from-violet-500 via-purple-500 to-fuchsia-500', icon: '🚀', bgColor: 'from-violet-50 via-purple-50 to-fuchsia-50 dark:from-violet-900/20 dark:via-purple-900/20 dark:to-fuchsia-900/20' },
  { name: 'MongoDB', expertise: 85, color: 'from-green-500 via-emerald-500 to-teal-500', icon: '🍃', bgColor: 'from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-teal-900/20' },
  { name: 'Oracle', expertise: 82, color: 'from-orange-500 via-amber-500 to-yellow-500', icon: '🔶', bgColor: 'from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-900/20 dark:via-amber-900/20 dark:to-yellow-900/20' },
  { name: 'AWS', expertise: 88, color: 'from-yellow-500 via-orange-500 to-red-500', icon: '☁️', bgColor: 'from-yellow-50 via-orange-50 to-red-50 dark:from-yellow-900/20 dark:via-orange-900/20 dark:to-red-900/20' }
];



export const TechnologiesSection: React.FC = () => {
  // Split technologies into two columns
  const leftColumnTechs = technologies.slice(0, Math.ceil(technologies.length / 2));
  const rightColumnTechs = technologies.slice(Math.ceil(technologies.length / 2));

  return (
    <div className="py-20 lg:py-32 bg-gradient-to-br from-gray-50/95 via-white/90 to-slate-100/95 dark:from-gray-950/95 dark:via-slate-900/90 dark:to-gray-900/95 relative overflow-hidden">
      {/* Professional Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.05),transparent_70%)] dark:bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.08),transparent_70%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.06),transparent_70%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.1),transparent_70%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_20%,rgba(59,130,246,0.04),transparent_70%)] dark:bg-[radial-gradient(circle_at_90%_20%,rgba(59,130,246,0.08),transparent_70%)]"></div>
      
      {/* Subtle floating orbs */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-violet-400/[0.03] via-purple-400/[0.05] to-blue-400/[0.03] dark:from-violet-400/[0.08] dark:via-purple-400/[0.12] dark:to-blue-400/[0.08] rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/[0.04] via-cyan-400/[0.06] to-emerald-400/[0.04] dark:from-blue-400/[0.1] dark:via-cyan-400/[0.14] dark:to-emerald-400/[0.1] rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-rose-400/[0.03] via-pink-400/[0.05] to-purple-400/[0.03] dark:from-rose-400/[0.08] dark:via-pink-400/[0.12] dark:to-purple-400/[0.08] rounded-full blur-3xl animate-pulse"></div>
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
            <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 dark:from-violet-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Our Technology Stack
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            We leverage cutting-edge technologies and frameworks to deliver robust, scalable, 
            and innovative solutions that meet modern business requirements.
          </p>
        </motion.div>

        {/* Technology Expertise - 2 Equal Columns */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Technology Expertise
          </h3>
          
          <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {/* Left Column */}
            <div className="space-y-6">
              {leftColumnTechs.map((tech, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl transform group-hover:scale-110 transition-transform duration-300">
                        {tech.icon}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors duration-300">
                        {tech.name}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {tech.expertise}%
                    </span>
                  </div>
                  
                  <div className="relative">
                    <Progress 
                      value={tech.expertise} 
                      className="h-3 bg-gray-200 dark:bg-gray-700" 
                    />
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${tech.expertise}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, delay: index * 0.1, ease: "easeOut" }}
                      className={`absolute top-0 left-0 h-3 bg-gradient-to-r ${tech.color} rounded-full shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {rightColumnTechs.map((tech, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl transform group-hover:scale-110 transition-transform duration-300">
                        {tech.icon}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors duration-300">
                        {tech.name}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {tech.expertise}%
                    </span>
                  </div>
                  
                  <div className="relative">
                    <Progress 
                      value={tech.expertise} 
                      className="h-3 bg-gray-200 dark:bg-gray-700" 
                    />
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${tech.expertise}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, delay: index * 0.1, ease: "easeOut" }}
                      className={`absolute top-0 left-0 h-3 bg-gradient-to-r ${tech.color} rounded-full shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Technologies We Use */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Technologies We Use
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
            {technologies.map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5, rotateY: 180 }}
                whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.05, type: "spring" }}
                whileHover={{ scale: 1.1, y: -5 }}
                className={`relative p-4 bg-gradient-to-br ${tech.bgColor} backdrop-blur-sm rounded-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer border border-white/50 dark:border-gray-700/50`}
              >
                <div className="text-center relative z-10">
                  <div className="text-3xl mb-2 group-hover:scale-125 transition-transform duration-500">
                    {tech.icon}
                  </div>
                  <div className="text-xs font-bold text-gray-800 dark:text-gray-200 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors duration-300">
                    {tech.name}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {tech.expertise}%
                  </div>
                </div>
                
                {/* Animated border */}
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${tech.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                
                {/* Floating particles */}
                <div className="absolute inset-0 overflow-hidden rounded-xl">
                  {[...Array(2)].map((_, i) => (
                    <motion.div
                      key={i}
                      className={`absolute w-1 h-1 bg-gradient-to-r ${tech.color} rounded-full opacity-60`}
                      animate={{
                        y: [0, -15, 0],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.5,
                      }}
                      style={{
                        left: `${25 + i * 25}%`,
                        top: '75%',
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>



        {/* Development Approach */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-r from-emerald-50/80 via-teal-50/80 to-cyan-50/80 dark:from-emerald-900/20 dark:via-teal-900/20 dark:to-cyan-900/20 backdrop-blur-sm p-8 rounded-xl border border-emerald-200/50 dark:border-emerald-800/50">
            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Our Development Approach
            </h4>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { text: 'Agile Development Methodology', color: 'from-emerald-600 to-teal-600' },
                { text: 'Test-Driven Development (TDD)', color: 'from-violet-600 to-purple-600' },
                { text: 'Continuous Integration/Deployment', color: 'from-cyan-600 to-blue-600' },
                { text: 'Code Review & Quality Assurance', color: 'from-rose-600 to-pink-600' },
                { text: 'AI/ML Model Development & Deployment', color: 'from-orange-600 to-yellow-600' },
                { text: 'User-Centered Design Principles', color: 'from-indigo-600 to-purple-600' }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300"
                >
                  <div className={`w-1.5 h-1.5 bg-gradient-to-r ${item.color} rounded-full`}></div>
                  <span>{item.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};