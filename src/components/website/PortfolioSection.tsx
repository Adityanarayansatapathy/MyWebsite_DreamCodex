import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, Github, ArrowRight, Filter, X, Calendar, Users, Zap } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { ImageWithFallback } from '../figma/ImageWithFallback';

const portfolioItems = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    description: 'A full-stack e-commerce solution with React, Spring Boot, and MongoDB',
    image: 'https://images.unsplash.com/photo-1649000808933-1f4aac7cad9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0Zm9saW8lMjB3ZWIlMjBkZXNpZ24lMjBzaG93Y2FzZXxlbnwxfHx8fDE3NTgwMTY1MTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Web',
    technologies: ['React', 'Spring Boot', 'MongoDB', 'AWS'],
    client: 'RetailTech Corp',
    duration: '4 months',
    featured: true
  },
  {
    id: 2,
    title: 'Mobile Banking App',
    description: 'Secure mobile banking application with biometric authentication',
    image: 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjBkZXNpZ24lMjBpbnRlcmZhY2V8ZW58MXx8fHwxNzU3OTE4OTY1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Mobile',
    technologies: ['React Native', 'Node.js', 'PostgreSQL', 'JWT'],
    client: 'SecureBank Ltd',
    duration: '6 months',
    featured: true
  },
  {
    id: 3,
    title: 'Cloud Analytics Dashboard',
    description: 'Real-time analytics dashboard for cloud infrastructure monitoring',
    image: 'https://images.unsplash.com/photo-1667984390553-7f439e6ae401?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG91ZCUyMHRlY2hub2xvZ3klMjBkYXNoYm9hcmR8ZW58MXx8fHwxNzU4MDE2NTIzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Cloud',
    technologies: ['Angular', 'Java', 'AWS', 'D3.js'],
    client: 'CloudTech Solutions',
    duration: '3 months',
    featured: false
  },
  {
    id: 4,
    title: 'Healthcare Management System',
    description: 'Comprehensive healthcare management platform with patient portals',
    image: 'https://images.unsplash.com/photo-1649000808933-1f4aac7cad9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0Zm9saW8lMjB3ZWIlMjBkZXNpZ24lMjBzaG93Y2FzZXxlbnwxfHx8fDE3NTgwMTY1MTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Web',
    technologies: ['Vue.js', 'Spring Boot', 'Oracle', 'Docker'],
    client: 'MediCare Plus',
    duration: '8 months',
    featured: false
  },
  {
    id: 5,
    title: 'AI-Powered CRM',
    description: 'Customer relationship management system with AI-driven insights',
    image: 'https://images.unsplash.com/photo-1667984390553-7f439e6ae401?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG91ZCUyMHRlY2hub2xvZ3klMjBkYXNoYm9hcmR8ZW58MXx8fHwxNzU4MDE2NTIzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Design',
    technologies: ['React', 'Python', 'TensorFlow', 'MongoDB'],
    client: 'SalesTech Inc',
    duration: '5 months',
    featured: false
  },
  {
    id: 6,
    title: 'Fitness Tracking App',
    description: 'Mobile fitness application with social features and workout plans',
    image: 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjBkZXNpZ24lMjBpbnRlcmZhY2V8ZW58MXx8fHwxNzU3OTE4OTY1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Mobile',
    technologies: ['Flutter', 'Firebase', 'Node.js', 'GraphQL'],
    client: 'FitLife App',
    duration: '4 months',
    featured: false
  }
];

const categories = ['All', 'Web', 'Mobile', 'Cloud', 'Design'];

export const PortfolioSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState<typeof portfolioItems[0] | null>(null);

  const filteredProjects = activeCategory === 'All' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeCategory);

  return (
    <div className="py-20 lg:py-32 bg-white dark:bg-gray-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
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
              Our Portfolio
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Explore our collection of successful projects that demonstrate our expertise 
            in delivering innovative solutions across various industries and technologies.
          </p>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => setActiveCategory(category)}
                variant={activeCategory === category ? "default" : "outline"}
                className={`transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    : "hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400"
                }`}
              >
                <Filter className="w-4 h-4 mr-2" />
                {category}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <AnimatePresence>
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`group relative ${
                  project.featured ? 'md:col-span-2 lg:col-span-2' : ''
                }`}
              >
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105">
                  {/* Project Image */}
                  <div className="relative overflow-hidden">
                    <ImageWithFallback
                      src={project.image}
                      alt={project.title}
                      className={`w-full object-cover transition-transform duration-500 group-hover:scale-110 ${
                        project.featured ? 'h-64' : 'h-48'
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Overlay Actions */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <div className="flex items-center space-x-3">
                        <Button
                          size="sm"
                          className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Live Demo
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30"
                        >
                          <Github className="w-4 h-4 mr-2" />
                          Code
                        </Button>
                      </div>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-xs font-medium text-gray-700 dark:text-gray-300 rounded-full">
                        {project.category}
                      </span>
                    </div>

                    {/* Featured Badge */}
                    {project.featured && (
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-medium rounded-full">
                          Featured
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Project Details */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      {project.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs font-medium text-gray-600 dark:text-gray-300 rounded-md"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs font-medium text-gray-600 dark:text-gray-300 rounded-md">
                          +{project.technologies.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Project Meta */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-500 dark:text-gray-400 gap-2">
                      <span>Client: {project.client}</span>
                      <span>{project.duration}</span>
                    </div>

                    {/* Learn More Button */}
                    <Button
                      variant="ghost"
                      onClick={() => setSelectedProject(project)}
                      className="w-full mt-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 justify-center font-medium"
                    >
                      View Project Details
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* View All Projects */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mt-16"
        >
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-8 py-6 text-lg group"
          >
            View All Projects
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
            Discover more of our successful projects and case studies
          </p>
        </motion.div>

        {/* Project Details Modal */}
        <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
          <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
            {selectedProject && (
              <div className="p-2">
                <DialogHeader className="mb-8">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <DialogTitle className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
                        {selectedProject.title}
                      </DialogTitle>
                      <DialogDescription className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                        {selectedProject.description}
                      </DialogDescription>
                      <div className="flex flex-wrap gap-3 mt-4">
                        <Badge variant="outline" className="px-4 py-2 text-sm font-medium">{selectedProject.category}</Badge>
                        {selectedProject.featured && (
                          <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 text-sm font-medium">Featured Project</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </DialogHeader>

                <div className="space-y-8">
                  {/* Project Image */}
                  <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                    <ImageWithFallback
                      src={selectedProject.image}
                      alt={selectedProject.title}
                      className="w-full h-64 sm:h-80 lg:h-96 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                  </div>

                  {/* Project Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center space-x-4 p-6 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border border-blue-200/50 dark:border-blue-700/50 hover:shadow-lg transition-all duration-300">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Duration</p>
                        <p className="font-bold text-gray-900 dark:text-white text-lg">{selectedProject.duration}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 p-6 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border border-green-200/50 dark:border-green-700/50 hover:shadow-lg transition-all duration-300">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">Client</p>
                        <p className="font-bold text-gray-900 dark:text-white text-lg">{selectedProject.client}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 p-6 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl border border-purple-200/50 dark:border-purple-700/50 hover:shadow-lg transition-all duration-300">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-1">Category</p>
                        <p className="font-bold text-gray-900 dark:text-white text-lg">{selectedProject.category}</p>
                      </div>
                    </div>
                  </div>

                  {/* Technologies Used */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 p-6 rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
                    <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
                      <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-3"></span>
                      Technologies Used
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {selectedProject.technologies.map((tech) => (
                        <Badge key={tech} variant="outline" className="bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium border-2 border-gray-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-8 rounded-2xl border border-blue-200/50 dark:border-blue-800/50">
                    <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center">
                      <span className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-4"></span>
                      Project Overview
                    </h3>
                    <div className="space-y-6">
                      <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                        This project showcases our expertise in {selectedProject.category.toLowerCase()} development using modern technologies like {selectedProject.technologies.slice(0, 2).join(' and ')}. 
                        We delivered a comprehensive solution that met all client requirements within the specified timeline of {selectedProject.duration}.
                      </p>
                      
                      <div>
                        <h4 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Key Features & Highlights:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                            'Responsive design optimized for all devices',
                            `Modern tech stack with ${selectedProject.technologies[0]} and ${selectedProject.technologies[1]}`,
                            'Scalable architecture designed for future growth',
                            'Comprehensive testing and quality assurance',
                            'Post-launch support and maintenance',
                            'Performance optimization and SEO ready'
                          ].map((feature, index) => (
                            <div key={index} className="flex items-start space-x-3 p-3 bg-white/70 dark:bg-gray-800/70 rounded-lg">
                              <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-4 pt-6 border-t-2 border-gray-200 dark:border-gray-700">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                      <ExternalLink className="w-5 h-5 mr-2" />
                      View Live Demo
                    </Button>
                    <Button variant="outline" className="px-6 py-3 text-base font-semibold border-2 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300">
                      <Github className="w-5 h-5 mr-2" />
                      View Source Code
                    </Button>
                    <Button variant="outline" onClick={() => setSelectedProject(null)} className="px-6 py-3 text-base font-semibold border-2 hover:border-red-500 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300">
                      <X className="w-5 h-5 mr-2" />
                      Close Modal
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};