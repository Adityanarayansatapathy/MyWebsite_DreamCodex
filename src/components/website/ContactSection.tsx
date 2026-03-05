import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, Clock, CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner@2.0.3';
import { mailService, validateEmail, validatePhone, validateRequired } from '../../services/mailService';

const contactInfo = [
  {
    icon: MapPin,
    title: 'Address',
    details: ['Hyderabad, Telangana', 'India - 500001'],
    color: 'from-violet-500 via-purple-500 to-indigo-500'
  },
  {
    icon: Phone,
    title: 'Phone',
    details: ['+91-8000517223', 'Mon-Fri 9AM-7PM IST'],
    color: 'from-emerald-500 via-teal-500 to-cyan-500'
  },
  {
    icon: Mail,
    title: 'Email',
    details: ['info@dreamcodex.com', 'adityasatapathy2024@gmail.com'],
    color: 'from-rose-500 via-pink-500 to-fuchsia-500'
  }
];

const services = [
  'Web Development',
  'Mobile App Development',
  'Cloud Solutions',
  'AI/ML Development',
  'UI/UX Design',
  'Database Solutions',
  'Python Development',
  'Consulting',
  'Other'
];

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    service: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!validateRequired(formData.name)) {
      newErrors.name = 'Name is required';
    }

    if (!validateRequired(formData.email)) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!validateRequired(formData.phone)) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!validateRequired(formData.subject)) {
      newErrors.subject = 'Subject is required';
    }

    if (!validateRequired(formData.message)) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);

    try {
      const emailData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        subject: formData.subject + (formData.service ? ` - ${formData.service}` : ''),
        message: formData.message
      };

      const success = await mailService.sendContactEmail(emailData);

      if (success) {
        toast.success('Message sent successfully to adityasatapathy2024@gmail.com! We\'ll get back to you within 24 hours.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          subject: '',
          service: '',
          message: ''
        });
      } else {
        // Even if the automated email fails, we can still help the user
        const mailtoSubject = encodeURIComponent(`Contact: ${emailData.subject}`);
        const mailtoBody = encodeURIComponent(`Hello DreamCodex Team,

Name: ${emailData.name}
Email: ${emailData.email}
Phone: ${emailData.phone}
Company: ${emailData.company || 'Not specified'}

Message:
${emailData.message}

Best regards,
${emailData.name}`);
        
        const mailtoLink = `mailto:adityasatapathy2024@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;
        
        toast.success('Your message has been saved! Click here to send via your email client.', {
          duration: 10000,
          action: {
            label: 'Open Email',
            onClick: () => window.location.href = mailtoLink
          }
        });
        
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          subject: '',
          service: '',
          message: ''
        });
      }
    } catch (error) {
      console.error('Contact form error:', error);
      
      // Provide a fallback option even when there's an error
      const mailtoSubject = encodeURIComponent(`Contact: ${formData.subject}`);
      const mailtoBody = encodeURIComponent(`Hello DreamCodex Team,

Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Company: ${formData.company || 'Not specified'}

Message:
${formData.message}

Best regards,
${formData.name}`);
      
      const mailtoLink = `mailto:adityasatapathy2024@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;
      
      toast.error('Email service temporarily unavailable. Click here to send via your email client.', {
        duration: 10000,
        action: {
          label: 'Open Email',
          onClick: () => window.location.href = mailtoLink
        }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-20 lg:py-32 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-slate-900 dark:to-blue-900/20 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl"></div>
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
              Get In Touch
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Ready to start your next project? Let's discuss how we can help you achieve your goals. 
            Get in touch with our team today.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Contact Information
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Reach out to us through any of these channels. We're here to help you succeed.
              </p>
            </div>

            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gradient-to-r hover:from-white/80 hover:to-white/60 dark:hover:from-gray-800/80 dark:hover:to-gray-800/60 backdrop-blur-sm transition-all duration-300 border border-transparent hover:border-white/30 dark:hover:border-gray-700/30"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${info.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                  <info.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {info.title}
                  </h4>
                  {info.details.map((detail, detailIndex) => (
                    <p key={detailIndex} className="text-gray-600 dark:text-gray-300 text-sm">
                      {detail}
                    </p>
                  ))}
                </div>
              </motion.div>
            ))}

            {/* Business Hours */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-gradient-to-r from-violet-50/80 via-purple-50/80 to-indigo-50/80 dark:from-violet-900/20 dark:via-purple-900/20 dark:to-indigo-900/20 backdrop-blur-sm p-6 rounded-xl border border-violet-200/50 dark:border-violet-800/50"
            >
              <div className="flex items-center space-x-3 mb-4">
                <Clock className="w-6 h-6 text-violet-600" />
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Business Hours
                </h4>
              </div>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span>10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span>Closed</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-2"
          >
            <div className="bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-800/80 dark:to-gray-800/60 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8 relative overflow-hidden">
              {/* Decorative background */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-indigo-500/10 rounded-bl-[100px]"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-500/10 via-teal-500/10 to-cyan-500/10 rounded-tr-[100px]"></div>
              
              <div className="relative z-10">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                    Send us a Message
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                  </p>
                </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name and Email Row */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className={`mt-1 bg-white/80 dark:bg-gray-800/80 border-violet-200 focus:border-violet-500 dark:border-violet-700 dark:focus:border-violet-400 ${errors.name ? 'border-red-500' : ''}`}
                      placeholder="Your full name"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className={`mt-1 bg-white/80 dark:bg-gray-800/80 border-violet-200 focus:border-violet-500 dark:border-violet-700 dark:focus:border-violet-400 ${errors.email ? 'border-red-500' : ''}`}
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>

                {/* Phone and Company Row */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className={`mt-1 bg-white/80 dark:bg-gray-800/80 border-violet-200 focus:border-violet-500 dark:border-violet-700 dark:focus:border-violet-400 ${errors.phone ? 'border-red-500' : ''}`}
                      placeholder="+91 XXXXX XXXXX"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="company">Company (Optional)</Label>
                    <Input
                      id="company"
                      type="text"
                      value={formData.company}
                      onChange={(e) => handleChange('company', e.target.value)}
                      className="mt-1 bg-white/80 dark:bg-gray-800/80 border-violet-200 focus:border-violet-500 dark:border-violet-700 dark:focus:border-violet-400"
                      placeholder="Your company name"
                    />
                  </div>
                </div>

                {/* Subject and Service Row */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      type="text"
                      value={formData.subject}
                      onChange={(e) => handleChange('subject', e.target.value)}
                      className={`mt-1 bg-white/80 dark:bg-gray-800/80 border-violet-200 focus:border-violet-500 dark:border-violet-700 dark:focus:border-violet-400 ${errors.subject ? 'border-red-500' : ''}`}
                      placeholder="What's this about?"
                    />
                    {errors.subject && (
                      <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="service">Service Interested In</Label>
                    <Select value={formData.service} onValueChange={(value) => handleChange('service', value)}>
                      <SelectTrigger className="mt-1 bg-white/80 dark:bg-gray-800/80 border-violet-200 focus:border-violet-500 dark:border-violet-700 dark:focus:border-violet-400">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service} value={service}>
                            {service}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    rows={6}
                    className={`mt-1 bg-white/80 dark:bg-gray-800/80 border-violet-200 focus:border-violet-500 dark:border-violet-700 dark:focus:border-violet-400 ${errors.message ? 'border-red-500' : ''}`}
                    placeholder="Tell us about your project, requirements, or any questions you have..."
                  />
                  {errors.message && (
                    <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                  )}
                  <p className="text-gray-500 text-xs mt-1">
                    Minimum 10 characters. Be as detailed as possible to help us understand your needs.
                  </p>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-700 hover:via-purple-700 hover:to-indigo-700 text-white py-6 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>

                {/* Success Message */}
                <div className="text-center text-sm text-gray-600 dark:text-gray-400 bg-emerald-50/80 dark:bg-emerald-900/20 backdrop-blur-sm p-4 rounded-lg border border-emerald-200/50 dark:border-emerald-800/50">
                  <CheckCircle className="w-5 h-5 inline mr-2 text-emerald-600" />
                  We typically respond within 24 hours
                </div>
              </form>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-16"
        >
          <div className="bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-800/80 dark:to-gray-800/60 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 overflow-hidden">
            <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                <MapPin className="w-6 h-6 mr-2 text-violet-600" />
                Our Location in India
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Hyderabad, Telangana - The City of Pearls
              </p>
            </div>
            
            <div className="relative h-96">
              {/* Embedded Google Map for India/Hyderabad */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.639604837688!2d78.38698461484058!3d17.412608088043904!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb970c1c120a3%3A0x6a9d14b7e5c2b8e7!2sHyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1673532847890!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-b-2xl"
              ></iframe>
              
              {/* Overlay with contact info */}
              <div className="absolute top-4 left-4 bg-gradient-to-r from-white/95 to-white/90 dark:from-gray-800/95 dark:to-gray-800/90 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-white/50 dark:border-gray-700/50">
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-3 h-3 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full animate-pulse"></div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    DreamCodex HQ
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                  Hyderabad, Telangana, India
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact Support Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mt-12"
        >
          <div className="bg-gradient-to-r from-violet-50/80 via-purple-50/80 to-indigo-50/80 dark:from-violet-900/20 dark:via-purple-900/20 dark:to-indigo-900/20 backdrop-blur-sm rounded-2xl p-8 border border-violet-200/50 dark:border-violet-800/50">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Need Immediate Support?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Our technical support team is available to help you with any urgent issues or questions.
              Get in touch with us directly for priority assistance.
            </p>
            <Button
              onClick={() => {
                // Open email client with pre-filled support email
                const subject = encodeURIComponent('Support Request - DreamCodex');
                const body = encodeURIComponent('Hello DreamCodex Team,\n\nI need support with:\n\n[Please describe your issue here]\n\nBest regards,');
                window.location.href = `mailto:adityasatapathy2024@gmail.com?subject=${subject}&body=${body}`;
              }}
              className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-700 hover:via-purple-700 hover:to-indigo-700 text-white px-8 py-4 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Mail className="w-5 h-5 mr-2" />
              Contact Support
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};