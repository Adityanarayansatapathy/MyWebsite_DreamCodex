import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, User, Calendar, Download, Trash2, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  phone: string;
  company?: string;
  subject: string;
  message: string;
  timestamp: string;
  status?: string;
}

interface NewsletterSubscription {
  id: number;
  email: string;
  timestamp: string;
}

interface CareerApplication {
  id: number;
  name: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  coverLetter: string;
  resume?: { name: string };
  timestamp: string;
}

export const AdminPanel: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
  const [newsletterSubscriptions, setNewsletterSubscriptions] = useState<NewsletterSubscription[]>([]);
  const [careerApplications, setCareerApplications] = useState<CareerApplication[]>([]);

  useEffect(() => {
    // Load data from localStorage
    const loadData = () => {
      const contacts = JSON.parse(localStorage.getItem('contact_submissions') || '[]');
      const newsletters = JSON.parse(localStorage.getItem('newsletter_subscriptions') || '[]');
      const careers = JSON.parse(localStorage.getItem('career_applications') || '[]');

      setContactSubmissions(contacts);
      setNewsletterSubscriptions(newsletters);
      setCareerApplications(careers);
    };

    loadData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const exportToCSV = (data: any[], filename: string) => {
    const headers = Object.keys(data[0] || {}).join(',');
    const rows = data.map(row => 
      Object.values(row).map(value => 
        typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
      ).join(',')
    );
    const csv = [headers, ...rows].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearData = (type: string) => {
    if (confirm(`Are you sure you want to clear all ${type} data?`)) {
      localStorage.removeItem(`${type}_submissions`);
      localStorage.removeItem(`${type}_subscriptions`);
      localStorage.removeItem(`${type}_applications`);
      
      if (type === 'contact') setContactSubmissions([]);
      if (type === 'newsletter') setNewsletterSubscriptions([]);
      if (type === 'career') setCareerApplications([]);
    }
  };

  // Hidden admin access (triple-click on footer logo)
  if (!isVisible) {
    return (
      <div className="hidden">
        <button 
          onClick={() => setIsVisible(true)}
          className="opacity-0 absolute -z-10"
          id="admin-trigger"
        >
          Admin
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            DreamCodex Admin Panel
          </h2>
          <Button
            variant="ghost"
            onClick={() => setIsVisible(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <EyeOff className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[80vh]">
          <Tabs defaultValue="contacts" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="contacts" className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>Contacts ({contactSubmissions.length})</span>
              </TabsTrigger>
              <TabsTrigger value="newsletters" className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Newsletter ({newsletterSubscriptions.length})</span>
              </TabsTrigger>
              <TabsTrigger value="careers" className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>Careers ({careerApplications.length})</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="contacts" className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Contact Form Submissions</h3>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => exportToCSV(contactSubmissions, 'contact-submissions')}
                    variant="outline"
                    size="sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                  <Button
                    onClick={() => clearData('contact')}
                    variant="destructive"
                    size="sm"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {contactSubmissions.map((submission) => (
                  <Card key={submission.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{submission.name}</CardTitle>
                        <div className="flex items-center space-x-2">
                          <Badge variant={submission.status === 'failed' ? 'destructive' : 'default'}>
                            {submission.status || 'sent'}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {formatDate(submission.timestamp)}
                          </span>
                        </div>
                      </div>
                      <CardDescription>
                        {submission.email} • {submission.phone}
                        {submission.company && ` • ${submission.company}`}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p><strong>Subject:</strong> {submission.subject}</p>
                        <p><strong>Message:</strong> {submission.message}</p>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => {
                              const mailtoLink = `mailto:${submission.email}?subject=Re: ${submission.subject}&body=Hi ${submission.name},%0D%0A%0D%0AThank you for contacting DreamCodex...`;
                              window.location.href = mailtoLink;
                            }}
                          >
                            Reply
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {contactSubmissions.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No contact submissions yet.
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="newsletters" className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Newsletter Subscriptions</h3>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => exportToCSV(newsletterSubscriptions, 'newsletter-subscriptions')}
                    variant="outline"
                    size="sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                  <Button
                    onClick={() => clearData('newsletter')}
                    variant="destructive"
                    size="sm"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                </div>
              </div>

              <div className="grid gap-4">
                {newsletterSubscriptions.map((subscription) => (
                  <Card key={subscription.id}>
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-medium">{subscription.email}</p>
                          <p className="text-sm text-gray-500">{formatDate(subscription.timestamp)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {newsletterSubscriptions.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No newsletter subscriptions yet.
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="careers" className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Career Applications</h3>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => exportToCSV(careerApplications, 'career-applications')}
                    variant="outline"
                    size="sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                  <Button
                    onClick={() => clearData('career')}
                    variant="destructive"
                    size="sm"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {careerApplications.map((application) => (
                  <Card key={application.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{application.name}</CardTitle>
                        <div className="flex items-center space-x-2">
                          <Badge>{application.position}</Badge>
                          <span className="text-sm text-gray-500">
                            {formatDate(application.timestamp)}
                          </span>
                        </div>
                      </div>
                      <CardDescription>
                        {application.email} • {application.phone} • {application.experience} experience
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p><strong>Position:</strong> {application.position}</p>
                        <p><strong>Cover Letter:</strong> {application.coverLetter}</p>
                        {application.resume && (
                          <p><strong>Resume:</strong> {application.resume.name}</p>
                        )}
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => {
                              const mailtoLink = `mailto:${application.email}?subject=Re: Application for ${application.position}&body=Hi ${application.name},%0D%0A%0D%0AThank you for applying for the ${application.position} position at DreamCodex...`;
                              window.location.href = mailtoLink;
                            }}
                          >
                            Reply
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {careerApplications.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No career applications yet.
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </div>
  );
};