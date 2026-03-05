import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Code2, 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  Linkedin, 
  Twitter, 
  Github, 
  Facebook,
  ArrowUp,
  Heart
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { toast } from 'sonner@2.0.3';
import { mailService, validateEmail } from '../../services/mailService';
import { AdminPanel } from '../AdminPanel';

interface FooterProps {
  scrollToSection: (sectionId: string) => void;
}

const footerLinks = {
  aboutUs: [
    { label: 'Home', id: 'home' },
    { label: 'About Us', id: 'about' },
    { label: 'Our Services', id: 'services' },
    { label: 'Terms & Conditions', href: '#terms' },
    { label: 'Privacy Policy', href: '#privacy' }
  ],
  usefulLinks: [
    { label: 'Team', id: 'team' },
    { label: 'Career', id: 'career' },
    { label: 'Contact', id: 'contact' },
    { label: 'FAQ', id: 'faq' },
    { label: 'Blog', href: '#blog' }
  ]
};

const socialLinks = [
  { name: 'LinkedIn', icon: Linkedin, href: '#', color: 'hover:text-blue-600' },
  { name: 'Twitter', icon: Twitter, href: '#', color: 'hover:text-blue-400' },
  { name: 'GitHub', icon: Github, href: '#', color: 'hover:text-gray-700 dark:hover:text-gray-300' },
  { name: 'Facebook', icon: Facebook, href: '#', color: 'hover:text-blue-700' }
];

export const Footer: React.FC<FooterProps> = ({ scrollToSection }) => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [adminClicks, setAdminClicks] = useState(0);
  const [showAdmin, setShowAdmin] = useState(false);

  const handleNewsletterSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }
    
    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubscribing(true);

    try {
      const success = await mailService.sendNewsletterSubscription({ email });
      
      if (success) {
        toast.success('Successfully subscribed to our newsletter!');
        setEmail('');
      } else {
        throw new Error('Subscription failed');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast.error('Failed to subscribe. Please try again later.');
    } finally {
      setIsSubscribing(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLinkClick = (link: any) => {
    if (link.id) {
      scrollToSection(link.id);
    } else if (link.href) {
      // Handle external links
      window.open(link.href, '_blank');
    }
  };

  const handleLogoClick = () => {
    setAdminClicks(prev => prev + 1);
    setTimeout(() => setAdminClicks(0), 2000); // Reset after 2 seconds
    
    if (adminClicks === 2) { // Third click (0, 1, 2)
      setShowAdmin(true);
    }
  };

  return (
    <>
      <footer className="relative bg-gray-900 dark:bg-gray-950 text-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="container mx-auto px-4 lg:px-8 py-16">
          <div className="grid lg:grid-cols-4 gap-12">
            {/* Company Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-1"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="relative">
                  <div 
                    className="w-12 h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg cursor-pointer transition-transform hover:scale-105"
                    onClick={handleLogoClick}
                  >
                    <Code2 className="w-7 h-7 text-white" />
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 rounded-xl blur opacity-30 animate-pulse"></div>
                </div>
                <div>
                  <h3 
                    className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent cursor-pointer"
                    onClick={handleLogoClick}
                  >
                    DreamCodex
                  </h3>
                  <p className="text-sm text-gray-400">Future-Ready Solutions</p>
                </div>
              </div>
              
              <p className="text-gray-300 leading-relaxed mb-6">
                We build scalable software solutions using modern technologies. 
                Transform your ideas into powerful digital experiences with our expert team.
              </p>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.1 }}
                    className={`w-10 h-10 bg-gray-800 dark:bg-gray-900 rounded-lg flex items-center justify-center transition-all duration-300 ${social.color} hover:bg-gray-700 dark:hover:bg-gray-800`}
                    aria-label={social.name}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* About Us Links */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <h4 className="text-lg font-semibold mb-6 text-white">About Us</h4>
              <ul className="space-y-3">
                {footerLinks.aboutUs.map((link, index) => (
                  <li key={index}>
                    <button
                      onClick={() => handleLinkClick(link)}
                      className="text-gray-300 hover:text-blue-400 transition-colors duration-300 text-left"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Useful Links */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h4 className="text-lg font-semibold mb-6 text-white">Useful Links</h4>
              <ul className="space-y-3">
                {footerLinks.usefulLinks.map((link, index) => (
                  <li key={index}>
                    <button
                      onClick={() => handleLinkClick(link)}
                      className="text-gray-300 hover:text-purple-400 transition-colors duration-300 text-left"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact & Newsletter */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h4 className="text-lg font-semibold mb-6 text-white">Contact Us</h4>
              
              {/* Contact Info */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-gray-300 text-sm">
                    <p>Bhubaneswar, Odisha</p>
                    <p>India - 751024</p>
                    <p>Temple City of India</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <a href="tel:+91-8000517223" className="text-gray-300 hover:text-green-400 transition-colors duration-300 text-sm">
                    +91-8000517223
                  </a>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-purple-400 flex-shrink-0" />
                  <a href="mailto:adityasatapathy2024@gmail.com" className="text-gray-300 hover:text-purple-400 transition-colors duration-300 text-sm">
                    adityasatapathy2024@gmail.com
                  </a>
                </div>
              </div>

              {/* Newsletter Subscription */}
              <div className="bg-gray-800/50 dark:bg-gray-900/50 p-6 rounded-xl border border-gray-700/50">
                <h5 className="font-semibold mb-3 text-white">Subscribe to Our Newsletter</h5>
                <p className="text-gray-400 text-sm mb-4">
                  Get the latest updates on our projects, technologies, and industry insights.
                </p>
                
                <form onSubmit={handleNewsletterSubscribe} className="space-y-3">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-700 dark:bg-gray-800 border-gray-600 dark:border-gray-700 text-white placeholder:text-gray-400 focus:border-blue-500 dark:focus:border-blue-400"
                  />
                  <Button
                    type="submit"
                    disabled={isSubscribing}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white disabled:opacity-50"
                  >
                    {isSubscribing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Subscribing...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Subscribe
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 dark:border-gray-900">
          <div className="container mx-auto px-4 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <span>© 2024 DreamCodex. Made with</span>
                <Heart className="w-4 h-4 text-red-500" />
                <span>by our amazing team.</span>
              </div>
              
              <div className="flex items-center space-x-6">
                <span className="text-gray-400 text-sm">
                  All rights reserved
                </span>
                
                {/* Back to Top Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={scrollToTop}
                  className="text-gray-400 hover:text-white hover:bg-gray-800 dark:hover:bg-gray-900"
                >
                  <ArrowUp className="w-4 h-4 mr-1" />
                  Top
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
    
    {/* Admin Panel */}
    {showAdmin && (
      <AdminPanel />
    )}
    </>
  );
};