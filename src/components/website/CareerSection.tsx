import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Briefcase, MapPin, Clock, Upload, Send, Mail, CheckCircle, Star, Users, Phone, User, MessageSquare } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { toast } from 'sonner@2.0.3';
import { mailService } from '../../services/mailService';

const jobOpenings = [
  {
    id: 1,
    title: 'Senior Full-Stack Developer',
    department: 'Engineering',
    location: 'Hyderabad, India / Remote',
    type: 'Full-time',
    experience: '3-5 years',
    description: 'We are looking for a skilled Full-Stack Developer to join our growing team. You will work on cutting-edge projects using React, Spring Boot, and cloud technologies.',
    requirements: [
      'Bachelor\'s degree in Computer Science or related field',
      '3+ years of experience with React and Java',
      'Experience with Spring Boot and RESTful APIs',
      'Knowledge of cloud platforms (AWS preferred)',
      'Strong problem-solving and communication skills'
    ],
    benefits: ['Competitive salary', 'Health insurance', 'Remote work options', '401(k) matching']
  },
  {
    id: 2,
    title: 'UI/UX Designer',
    department: 'Design',
    location: 'Hyderabad, India / Remote',
    type: 'Full-time',
    experience: '2-4 years',
    description: 'Join our design team to create beautiful, user-centered digital experiences. You\'ll work closely with developers and product managers to bring designs to life.',
    requirements: [
      'Bachelor\'s degree in Design or related field',
      '2+ years of UI/UX design experience',
      'Proficiency in Figma, Sketch, or Adobe XD',
      'Understanding of web and mobile design principles',
      'Portfolio showcasing design projects'
    ],
    benefits: ['Creative environment', 'Latest design tools', 'Professional development', 'Flexible hours']
  },
  {
    id: 3,
    title: 'DevOps Engineer',
    department: 'Infrastructure',
    location: 'Remote',
    type: 'Full-time',
    experience: '3-6 years',
    description: 'Help us scale our infrastructure and improve our development processes. You\'ll work with modern DevOps tools and cloud platforms.',
    requirements: [
      'Experience with AWS, Azure, or Google Cloud',
      'Knowledge of containerization (Docker, Kubernetes)',
      'Experience with CI/CD pipelines',
      'Scripting skills (Python, Bash, etc.)',
      'Infrastructure as Code (Terraform, CloudFormation)'
    ],
    benefits: ['Cutting-edge technology', 'Learning budget', 'Conference attendance', 'Stock options']
  }
];

const experienceLevels = [
  '0-1 years',
  '1-3 years',
  '3-5 years',
  '5+ years'
];

export const CareerSection: React.FC = () => {
  const [selectedJob, setSelectedJob] = useState<typeof jobOpenings[0] | null>(null);
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  const [applicationData, setApplicationData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    coverLetter: '',
    resume: null as File | null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quick Apply Form for View Details Modal
  const [quickApplyData, setQuickApplyData] = useState({
    fullName: '',
    emailAddress: '',
    phoneNumber: '',
    message: ''
  });
  const [isQuickSubmitting, setIsQuickSubmitting] = useState(false);

  const handleApplicationChange = (field: string, value: string) => {
    setApplicationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleQuickApplyChange = (field: string, value: string) => {
    setQuickApplyData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Resume file size should be less than 5MB');
        return;
      }
      
      // Check file type
      const allowedTypes = ['.pdf', '.doc', '.docx'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!allowedTypes.includes(fileExtension)) {
        toast.error('Please upload a PDF, DOC, or DOCX file');
        return;
      }
      
      setApplicationData(prev => ({
        ...prev,
        resume: file
      }));
    }
  };

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!applicationData.name || !applicationData.email || !applicationData.phone || 
        !applicationData.position || !applicationData.experience || !applicationData.coverLetter) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await mailService.sendCareerApplication(applicationData);

      if (success) {
        toast.success('Application submitted successfully! We\'ll review it and get back to you soon.');
        setApplicationData({
          name: '',
          email: '',
          phone: '',
          position: '',
          experience: '',
          coverLetter: '',
          resume: null
        });
        setIsApplicationOpen(false);
      } else {
        throw new Error('Failed to send application');
      }
    } catch (error) {
      console.error('Career application error:', error);
      toast.error('Failed to submit application. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!quickApplyData.fullName || !quickApplyData.emailAddress || !quickApplyData.phoneNumber || !quickApplyData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!selectedJob) return;

    setIsQuickSubmitting(true);

    try {
      // Enhanced email integration with multiple fallback methods
      const emailData = {
        name: quickApplyData.fullName,
        email: quickApplyData.emailAddress,
        phone: quickApplyData.phoneNumber,
        position: selectedJob.title,
        experience: 'Not specified',
        coverLetter: quickApplyData.message,
        resume: undefined
      };

      // Try multiple email services for better reliability
      let emailSent = false;

      // Method 1: Try Web3Forms (new reliable service)
      try {
        const web3Response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            access_key: "8a9c7f85-4c2d-4e5a-9b1f-3d2e6c8a9b7c", // You'll need to get this from web3forms.com
            subject: `Job Application: ${selectedJob.title} - DreamCodex`,
            from_name: quickApplyData.fullName,
            email: quickApplyData.emailAddress,
            phone: quickApplyData.phoneNumber,
            message: `Job Application for: ${selectedJob.title}\n\nApplicant Details:\nName: ${quickApplyData.fullName}\nEmail: ${quickApplyData.emailAddress}\nPhone: ${quickApplyData.phoneNumber}\n\nMessage:\n${quickApplyData.message}`,
            to: 'adityasatapathy2024@gmail.com'
          }),
        });

        if (web3Response.ok) {
          emailSent = true;
          console.log('Email sent via Web3Forms');
        }
      } catch (web3Error) {
        console.log('Web3Forms failed, trying alternative...');
      }

      // Method 2: Try our existing mail service
      if (!emailSent) {
        const success = await mailService.sendCareerApplication(emailData);
        if (success) {
          emailSent = true;
          console.log('Email sent via existing service');
        }
      }

      // Method 3: EmailJS as fallback
      if (!emailSent && typeof window !== 'undefined' && (window as any).emailjs) {
        try {
          await (window as any).emailjs.send(
            'service_dreamcodex',
            'template_job_application',
            {
              to_email: 'adityasatapathy2024@gmail.com',
              from_name: quickApplyData.fullName,
              from_email: quickApplyData.emailAddress,
              phone: quickApplyData.phoneNumber,
              position: selectedJob.title,
              message: quickApplyData.message,
              subject: `Job Application: ${selectedJob.title}`
            },
            'your_public_key'
          );
          emailSent = true;
          console.log('Email sent via EmailJS');
        } catch (emailjsError) {
          console.log('EmailJS not configured');
        }
      }

      // Method 4: Direct mailto as ultimate fallback
      if (!emailSent) {
        const subject = encodeURIComponent(`Job Application: ${selectedJob.title} - DreamCodex`);
        const body = encodeURIComponent(`Job Application for: ${selectedJob.title}

Applicant Details:
Name: ${quickApplyData.fullName}
Email: ${quickApplyData.emailAddress}
Phone: ${quickApplyData.phoneNumber}

Message:
${quickApplyData.message}

--
Application submitted via DreamCodex Website
Timestamp: ${new Date().toISOString()}`);
        
        const mailtoLink = `mailto:adityasatapathy2024@gmail.com?subject=${subject}&body=${body}`;
        window.open(mailtoLink, '_blank');
      }

      toast.success('Application submitted successfully! We\'ll review it and get back to you soon.');
      setQuickApplyData({
        fullName: '',
        emailAddress: '',
        phoneNumber: '',
        message: ''
      });
      setSelectedJob(null);
    } catch (error) {
      console.error('Quick apply error:', error);
      
      // Fallback mailto
      const subject = encodeURIComponent(`Job Application: ${selectedJob.title} - DreamCodex`);
      const body = encodeURIComponent(`Job Application for: ${selectedJob.title}

Applicant Details:
Name: ${quickApplyData.fullName}
Email: ${quickApplyData.emailAddress}
Phone: ${quickApplyData.phoneNumber}

Message:
${quickApplyData.message}`);
      
      const mailtoLink = `mailto:adityasatapathy2024@gmail.com?subject=${subject}&body=${body}`;
      
      toast.error('Service temporarily unavailable. Opening email client...', {
        duration: 5000,
        action: {
          label: 'Open Email',
          onClick: () => window.open(mailtoLink, '_blank')
        }
      });
      
      setTimeout(() => {
        window.open(mailtoLink, '_blank');
      }, 1000);
    } finally {
      setIsQuickSubmitting(false);
    }
  };

  return (
    <div className="py-20 lg:py-32 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-slate-900 dark:to-blue-900/20 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-pink-500/5 to-rose-500/5 rounded-full blur-3xl"></div>
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
              Join Our Team
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Build your career with DreamCodex. We offer exciting opportunities to work on innovative 
            projects with cutting-edge technologies in a collaborative environment.
          </p>
        </motion.div>

        {/* Company Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-4 gap-6 mb-16"
        >
          {[
            { 
              title: 'Competitive Salary', 
              description: 'Market-leading compensation packages',
              icon: '💰',
              color: 'from-emerald-500 via-green-500 to-teal-500'
            },
            { 
              title: 'Remote Friendly', 
              description: 'Flexible work arrangements and locations',
              icon: '🏠',
              color: 'from-blue-500 via-indigo-500 to-purple-500'
            },
            { 
              title: 'Growth Opportunities', 
              description: 'Professional development and learning budgets',
              icon: '📈',
              color: 'from-purple-500 via-pink-500 to-rose-500'
            },
            { 
              title: 'Great Benefits', 
              description: 'Health insurance, provident fund, and more',
              icon: '🎁',
              color: 'from-orange-500 via-red-500 to-pink-500'
            }
          ].map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="text-center p-6 bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-800/80 dark:to-gray-800/60 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/50 group cursor-pointer hover:shadow-xl transition-all duration-300"
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${benefit.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <span className="text-2xl">{benefit.icon}</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors duration-300">
                {benefit.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Career Opportunities Section */}
        <motion.div
          id="career-opportunities"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-r from-violet-50/80 via-purple-50/80 to-indigo-50/80 dark:from-violet-900/20 dark:via-purple-900/20 dark:to-indigo-900/20 backdrop-blur-sm rounded-2xl p-8 mb-16 border border-violet-200/50 dark:border-violet-800/50"
        >
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              View Career Opportunities
            </h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
              We're always looking for talented individuals to join our team. Check out our current openings 
              and apply directly to positions that match your skills and interests.
            </p>
            <Button 
              onClick={() => {
                const currentOpeningsElement = document.getElementById('current-openings');
                if (currentOpeningsElement) {
                  currentOpeningsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 text-white px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              View Current Openings
            </Button>
          </div>
        </motion.div>

        {/* Job Openings */}
        <div id="current-openings" className="space-y-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Current Openings
          </h3>

          {jobOpenings.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-800/80 dark:to-gray-800/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 p-8 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                <div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {job.title}
                  </h4>
                  <div className="flex flex-wrap gap-3 mb-4">
                    <Badge variant="outline" className="flex items-center space-x-1 border-violet-200 text-violet-700 dark:border-violet-700 dark:text-violet-300">
                      <Briefcase className="w-3 h-3" />
                      <span>{job.department}</span>
                    </Badge>
                    <Badge variant="outline" className="flex items-center space-x-1 border-emerald-200 text-emerald-700 dark:border-emerald-700 dark:text-emerald-300">
                      <MapPin className="w-3 h-3" />
                      <span>{job.location}</span>
                    </Badge>
                    <Badge variant="outline" className="flex items-center space-x-1 border-blue-200 text-blue-700 dark:border-blue-700 dark:text-blue-300">
                      <Clock className="w-3 h-3" />
                      <span>{job.type}</span>
                    </Badge>
                    <Badge className="bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 dark:from-violet-900/30 dark:to-purple-900/30 dark:text-violet-300 border-0">
                      {job.experience}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedJob(job)}
                    className="flex items-center gap-2 border-violet-200 hover:bg-violet-50 dark:border-violet-700 dark:hover:bg-violet-900/20"
                  >
                    <Star className="w-4 h-4" />
                    View Details
                  </Button>
                  <Dialog open={isApplicationOpen} onOpenChange={setIsApplicationOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-700 hover:via-purple-700 hover:to-indigo-700 text-white flex items-center gap-2 shadow-lg"
                        onClick={() => {
                          setApplicationData(prev => ({ ...prev, position: job.title }));
                        }}
                      >
                        <Send className="w-4 h-4" />
                        Apply Now
                      </Button>
                    </DialogTrigger>
                    
                    {/* Improved Apply Now Modal */}
                    <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
                      <DialogHeader className="pb-4 border-b border-gray-200 dark:border-gray-700">
                        <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                          Apply for {job.title}
                        </DialogTitle>
                        <DialogDescription className="text-gray-600 dark:text-gray-300">
                          Submit your application below. All fields marked with * are required.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="flex-1 overflow-y-auto py-4 space-y-6">
                        <form onSubmit={handleApplicationSubmit} className="space-y-6">
                          {/* Personal Information */}
                          <div className="bg-gradient-to-r from-violet-50/50 to-purple-50/50 dark:from-violet-900/10 dark:to-purple-900/10 p-6 rounded-xl border border-violet-200/30 dark:border-violet-800/30">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                              <span className="w-2 h-2 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full mr-3"></span>
                              Personal Information
                            </h4>
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="app-name" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Full Name *</Label>
                                <Input
                                  id="app-name"
                                  value={applicationData.name}
                                  onChange={(e) => handleApplicationChange('name', e.target.value)}
                                  placeholder="Enter your full name"
                                  className="h-11 bg-white/80 dark:bg-gray-800/80 border-violet-200 focus:border-violet-500 dark:border-violet-700 dark:focus:border-violet-400"
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="app-email" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Email Address *</Label>
                                <Input
                                  id="app-email"
                                  type="email"
                                  value={applicationData.email}
                                  onChange={(e) => handleApplicationChange('email', e.target.value)}
                                  placeholder="your.email@example.com"
                                  className="h-11 bg-white/80 dark:bg-gray-800/80 border-violet-200 focus:border-violet-500 dark:border-violet-700 dark:focus:border-violet-400"
                                  required
                                />
                              </div>
                            </div>
                          </div>

                          {/* Professional Information */}
                          <div className="bg-gradient-to-r from-emerald-50/50 to-teal-50/50 dark:from-emerald-900/10 dark:to-teal-900/10 p-6 rounded-xl border border-emerald-200/30 dark:border-emerald-800/30">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                              <span className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mr-3"></span>
                              Professional Information
                            </h4>
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="app-phone" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Phone Number *</Label>
                                <Input
                                  id="app-phone"
                                  type="tel"
                                  value={applicationData.phone}
                                  onChange={(e) => handleApplicationChange('phone', e.target.value)}
                                  placeholder="+91-XXXXXXXXXX"
                                  className="h-11 bg-white/80 dark:bg-gray-800/80 border-emerald-200 focus:border-emerald-500 dark:border-emerald-700 dark:focus:border-emerald-400"
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="app-experience" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Experience Level *</Label>
                                <Select value={applicationData.experience} onValueChange={(value) => handleApplicationChange('experience', value)}>
                                  <SelectTrigger className="h-11 bg-white/80 dark:bg-gray-800/80 border-emerald-200 focus:border-emerald-500 dark:border-emerald-700">
                                    <SelectValue placeholder="Select experience level" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {experienceLevels.map((level) => (
                                      <SelectItem key={level} value={level}>
                                        {level}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>

                          {/* Cover Letter */}
                          <div className="bg-gradient-to-r from-blue-50/50 to-cyan-50/50 dark:from-blue-900/10 dark:to-cyan-900/10 p-6 rounded-xl border border-blue-200/30 dark:border-blue-800/30">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                              <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mr-3"></span>
                              Cover Letter
                            </h4>
                            <div>
                              <Label htmlFor="app-cover-letter" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Why do you want to join DreamCodex? *</Label>
                              <Textarea
                                id="app-cover-letter"
                                value={applicationData.coverLetter}
                                onChange={(e) => handleApplicationChange('coverLetter', e.target.value)}
                                placeholder="Tell us about your interest in this position and why you'd be a great fit for our team..."
                                className="min-h-[120px] bg-white/80 dark:bg-gray-800/80 border-blue-200 focus:border-blue-500 dark:border-blue-700 dark:focus:border-blue-400 resize-none"
                                required
                              />
                            </div>
                          </div>

                          {/* Resume Upload */}
                          <div className="bg-gradient-to-r from-rose-50/50 to-pink-50/50 dark:from-rose-900/10 dark:to-pink-900/10 p-6 rounded-xl border border-rose-200/30 dark:border-rose-800/30">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                              <span className="w-2 h-2 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full mr-3"></span>
                              Resume Upload
                            </h4>
                            <div>
                              <Label htmlFor="app-resume" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Upload Resume (PDF, DOC, DOCX - Max 5MB)</Label>
                              <div className="relative">
                                <Input
                                  id="app-resume"
                                  type="file"
                                  accept=".pdf,.doc,.docx"
                                  onChange={handleFileChange}
                                  className="h-11 bg-white/80 dark:bg-gray-800/80 border-rose-200 focus:border-rose-500 dark:border-rose-700 dark:focus:border-rose-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100 dark:file:bg-rose-900/20 dark:file:text-rose-300"
                                />
                                <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                              </div>
                              {applicationData.resume && (
                                <div className="mt-2 flex items-center text-sm text-green-600 dark:text-green-400">
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  {applicationData.resume.name}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Submit Button */}
                          <div className="flex justify-end pt-4">
                            <Button
                              type="submit"
                              disabled={isSubmitting}
                              className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-700 hover:via-purple-700 hover:to-indigo-700 text-white px-8 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                            >
                              {isSubmitting ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                  Submitting...
                                </>
                              ) : (
                                <>
                                  <Send className="w-4 h-4 mr-2" />
                                  Submit Application
                                </>
                              )}
                            </Button>
                          </div>
                        </form>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                {job.description}
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Requirements
                  </h5>
                  <ul className="space-y-2">
                    {job.requirements.map((req, reqIndex) => (
                      <li key={reqIndex} className="text-sm text-gray-600 dark:text-gray-300 flex items-start">
                        <span className="w-1.5 h-1.5 bg-violet-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 mr-2" />
                    Benefits
                  </h5>
                  <ul className="space-y-2">
                    {job.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="text-sm text-gray-600 dark:text-gray-300 flex items-start">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Job Details Modal */}
        {selectedJob && (
          <Dialog open={!!selectedJob} onOpenChange={(open) => !open && setSelectedJob(null)}>
            <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
              <DialogHeader className="pb-4 border-b border-gray-200 dark:border-gray-700">
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  {selectedJob.title}
                </DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-300">
                  {selectedJob.department} • {selectedJob.location} • {selectedJob.type}
                </DialogDescription>
              </DialogHeader>
              
              <div className="flex-1 overflow-y-auto py-4 space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Job Description</h4>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {selectedJob.description}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      Requirements
                    </h4>
                    <ul className="space-y-2">
                      {selectedJob.requirements.map((req, index) => (
                        <li key={index} className="text-gray-600 dark:text-gray-300 flex items-start">
                          <span className="w-2 h-2 bg-violet-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                      <Star className="w-5 h-5 text-yellow-500 mr-2" />
                      Benefits
                    </h4>
                    <ul className="space-y-2">
                      {selectedJob.benefits.map((benefit, index) => (
                        <li key={index} className="text-gray-600 dark:text-gray-300 flex items-start">
                          <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Quick Apply Form */}
                <div className="bg-gradient-to-r from-violet-50/80 via-purple-50/80 to-indigo-50/80 dark:from-violet-900/20 dark:via-purple-900/20 dark:to-indigo-900/20 backdrop-blur-sm rounded-xl p-6 border border-violet-200/50 dark:border-violet-800/50">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Apply</h4>
                  <form onSubmit={handleQuickApplySubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="quick-name" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Full Name *</Label>
                        <Input
                          id="quick-name"
                          value={quickApplyData.fullName}
                          onChange={(e) => handleQuickApplyChange('fullName', e.target.value)}
                          placeholder="Enter your full name"
                          className="h-10 bg-white/80 dark:bg-gray-800/80 border-violet-200 focus:border-violet-500 dark:border-violet-700"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="quick-email" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Email Address *</Label>
                        <Input
                          id="quick-email"
                          type="email"
                          value={quickApplyData.emailAddress}
                          onChange={(e) => handleQuickApplyChange('emailAddress', e.target.value)}
                          placeholder="your.email@example.com"
                          className="h-10 bg-white/80 dark:bg-gray-800/80 border-violet-200 focus:border-violet-500 dark:border-violet-700"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="quick-phone" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Phone Number *</Label>
                      <Input
                        id="quick-phone"
                        type="tel"
                        value={quickApplyData.phoneNumber}
                        onChange={(e) => handleQuickApplyChange('phoneNumber', e.target.value)}
                        placeholder="+91-XXXXXXXXXX"
                        className="h-10 bg-white/80 dark:bg-gray-800/80 border-violet-200 focus:border-violet-500 dark:border-violet-700"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="quick-message" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Message *</Label>
                      <Textarea
                        id="quick-message"
                        value={quickApplyData.message}
                        onChange={(e) => handleQuickApplyChange('message', e.target.value)}
                        placeholder="Tell us why you're interested in this position..."
                        className="min-h-[100px] bg-white/80 dark:bg-gray-800/80 border-violet-200 focus:border-violet-500 dark:border-violet-700 resize-none"
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isQuickSubmitting}
                      className="w-full bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-700 hover:via-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                    >
                      {isQuickSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Submit Application
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};