import React from 'react';
import { motion } from 'motion/react';
import { Linkedin, Twitter, Github, Mail } from 'lucide-react';
import { Button } from '../ui/button';
import { ImageWithFallback } from '../figma/ImageWithFallback';

const teamMembers = [
  {
    id: 1,
    name: 'Aditya Satapathy',
    role: 'Founder & CEO',
    bio: 'Visionary leader with 8+ years in software development and business strategy.',
    image: 'https://images.unsplash.com/photo-1651684215020-f7a5b6610f23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwcHJvZmVzc2lvbmFsJTIwYnVzaW5lc3MlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTgwMTY2Mzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    skills: ['Leadership', 'Strategy', 'Full-Stack Development'],
    social: {
      linkedin: '#',
      twitter: '#',
      github: '#',
      email: 'adityasatapathy2024@gmail.com'
    }
  },
  {
    id: 2,
    name: 'Sarah Chen',
    role: 'CTO & Lead Developer',
    bio: 'Technical expert specializing in scalable architectures and modern frameworks.',
    image: 'https://images.unsplash.com/photo-1736939666660-d4c776e0532c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDF8fHx8MTc1ODAxNjYzNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    skills: ['React', 'Java', 'Cloud Architecture'],
    social: {
      linkedin: '#',
      twitter: '#',
      github: '#',
      email: 'sarah@dreamcodex.com'
    }
  },
  {
    id: 3,
    name: 'Michael Rodriguez',
    role: 'Senior Full-Stack Developer',
    bio: 'Full-stack developer passionate about creating efficient and elegant solutions.',
    image: 'https://images.unsplash.com/photo-1584940120505-117038d90b05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGV4ZWN1dGl2ZSUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc1Nzk5NTgyN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    skills: ['Angular', 'Spring Boot', 'MongoDB'],
    social: {
      linkedin: '#',
      twitter: '#',
      github: '#',
      email: 'michael@dreamcodex.com'
    }
  },
  {
    id: 4,
    name: 'Emily Johnson',
    role: 'UI/UX Design Lead',
    bio: 'Creative designer focused on user-centered design and digital experiences.',
    image: 'https://images.unsplash.com/photo-1739298061757-7a3339cee982?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMHBlcnNvbiUyMGhlYWRzaG90fGVufDF8fHx8MTc1Nzg5NzkwMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    skills: ['UI/UX Design', 'Figma', 'User Research'],
    social: {
      linkedin: '#',
      twitter: '#',
      github: '#',
      email: 'emily@dreamcodex.com'
    }
  }
];

interface TeamSectionProps {
  scrollToSection?: (sectionId: string) => void;
}

export const TeamSection: React.FC<TeamSectionProps> = ({ scrollToSection }) => {
  return (
    <div className="py-20 lg:py-32 bg-gray-50 dark:bg-gray-800/50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
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
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
              Our Team
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Meet the passionate professionals behind DreamCodex. Our diverse team brings together 
            expertise in technology, design, and business to deliver exceptional results.
          </p>
        </motion.div>

        {/* Team Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105">
                {/* Member Photo */}
                <div className="relative overflow-hidden">
                  <ImageWithFallback
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Social Links Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex justify-center space-x-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-10 h-10 p-0 bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30"
                        >
                          <Linkedin className="w-4 h-4 text-white" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-10 h-10 p-0 bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30"
                        >
                          <Twitter className="w-4 h-4 text-white" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-10 h-10 p-0 bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30"
                        >
                          <Github className="w-4 h-4 text-white" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-10 h-10 p-0 bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30"
                        >
                          <Mail className="w-4 h-4 text-white" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Member Details */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {member.name}
                  </h3>
                  
                  <p className="text-blue-600 dark:text-blue-400 font-medium mb-3">
                    {member.role}
                  </p>
                  
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                    {member.bio}
                  </p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2">
                    {member.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs font-medium text-gray-600 dark:text-gray-300 rounded-md"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Join Our Team CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 border border-blue-200/50 dark:border-blue-800/50">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Want to Join Our Team?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              We're always looking for talented individuals who share our passion for technology 
              and innovation. Explore our career opportunities and become part of the DreamCodex family.
            </p>
            <Button 
              onClick={() => {
                // First scroll to career section
                if (scrollToSection) {
                  scrollToSection('career');
                }
                // Then scroll to career opportunities subsection after a brief delay
                setTimeout(() => {
                  const careerOpportunitiesElement = document.getElementById('career-opportunities');
                  if (careerOpportunitiesElement) {
                    careerOpportunitiesElement.scrollIntoView({ 
                      behavior: 'smooth', 
                      block: 'start' 
                    });
                  }
                }, 500);
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
            >
              View Career Opportunities
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};