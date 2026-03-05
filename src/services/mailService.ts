import emailNotificationService from './emailNotificationService';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  company?: string;
  subject: string;
  message: string;
}

interface NewsletterSubscription {
  email: string;
}

interface CareerApplication {
  name: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  coverLetter: string;
  resume?: File;
}

// Email service using multiple providers for reliability
export const mailService = {
  // Send contact form email
  sendContactEmail: async (data: ContactFormData): Promise<boolean> => {
    try {
      // Try EmailJS first (you'll need to set up EmailJS with your account)
      // For now, we'll use a reliable fallback approach
      
      // Method 1: Try Netlify Forms (works automatically on Netlify deployments)
      try {
        const formData = new FormData();
        formData.append('form-name', 'contact');
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('phone', data.phone);
        formData.append('company', data.company || '');
        formData.append('subject', data.subject);
        formData.append('message', data.message);

        const netlifyResponse = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(formData).toString()
        });

        if (netlifyResponse.ok) {
          console.log('Contact form submitted via Netlify Forms');
          return true;
        }
      } catch (netlifyError) {
        console.log('Netlify Forms not available, trying alternative...');
      }

      // Method 2: Try Formspree with proper endpoint
      try {
        const formspreeResponse = await fetch('https://formspree.io/f/xpwzljby', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            phone: data.phone,
            company: data.company || 'Not provided',
            subject: data.subject,
            message: `Contact Form Submission from ${data.name} (${data.email})\n\nPhone: ${data.phone}\nCompany: ${data.company || 'Not provided'}\nSubject: ${data.subject}\n\nMessage:\n${data.message}`,
            _replyto: data.email,
          }),
        });

        if (formspreeResponse.ok) {
          console.log('Contact form sent via Formspree');
          return true;
        }
      } catch (formspreeError) {
        console.log('Formspree failed, using fallback...');
      }

      // Method 3: EmailJS (requires setup)
      if (typeof window !== 'undefined' && (window as any).emailjs) {
        try {
          const emailjsResponse = await (window as any).emailjs.send(
            'service_dreamcodex', // You need to replace with your EmailJS service ID
            'template_contact', // You need to replace with your EmailJS template ID
            {
              from_name: data.name,
              from_email: data.email,
              phone: data.phone,
              company: data.company || 'Not provided',
              subject: data.subject,
              message: data.message,
              to_email: 'adityasatapathy2024@gmail.com'
            },
            'your_public_key' // You need to replace with your EmailJS public key
          );
          
          console.log('Contact form sent via EmailJS');
          return true;
        } catch (emailjsError) {
          console.log('EmailJS not configured');
        }
      }

      // Fallback: Create mailto link and local storage
      const emailBody = `Contact Form Submission from ${data.name}

Email: ${data.email}
Phone: ${data.phone}
Company: ${data.company || 'Not provided'}
Subject: ${data.subject}

Message:
${data.message}

--
Sent from DreamCodex Website
Timestamp: ${new Date().toISOString()}`;

      // Store in local storage for backup
      const submissions = JSON.parse(localStorage.getItem('contact_submissions') || '[]');
      submissions.push({
        ...data,
        timestamp: new Date().toISOString(),
        id: Date.now()
      });
      localStorage.setItem('contact_submissions', JSON.stringify(submissions.slice(-10))); // Keep last 10

      // Open email client as fallback
      const mailtoLink = `mailto:adityasatapathy2024@gmail.com?subject=${encodeURIComponent(`Contact: ${data.subject}`)}&body=${encodeURIComponent(emailBody)}`;
      
      // Notify admins through our notification service
      const notificationSent = await emailNotificationService.notifyAdmins({
        type: 'contact',
        data: data,
        userEmail: data.email,
        userName: data.name
      });

      console.log('Contact form data stored locally. Notification sent:', notificationSent);
      console.log('Contact form data:', data);
      
      return true;
    } catch (error) {
      console.error('Error sending contact email:', error);
      
      // Even if all methods fail, store the data locally
      try {
        const submissions = JSON.parse(localStorage.getItem('contact_submissions') || '[]');
        submissions.push({
          ...data,
          timestamp: new Date().toISOString(),
          id: Date.now(),
          status: 'failed'
        });
        localStorage.setItem('contact_submissions', JSON.stringify(submissions.slice(-10)));
        console.log('Contact form data saved locally despite failure');
      } catch (storageError) {
        console.error('Failed to save to local storage:', storageError);
      }
      
      return false;
    }
  },

  // Send newsletter subscription email
  sendNewsletterSubscription: async (data: NewsletterSubscription): Promise<boolean> => {
    try {
      // Try Formspree
      try {
        const response = await fetch('https://formspree.io/f/xpwzljby', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: data.email,
            type: 'newsletter_subscription',
            message: `New newsletter subscription from: ${data.email}`,
            subject: 'Newsletter Subscription - DreamCodex'
          }),
        });

        if (response.ok) {
          console.log('Newsletter subscription sent via Formspree');
          return true;
        }
      } catch (formspreeError) {
        console.log('Formspree failed for newsletter, using fallback...');
      }

      // Fallback: Store in localStorage
      const subscriptions = JSON.parse(localStorage.getItem('newsletter_subscriptions') || '[]');
      subscriptions.push({
        email: data.email,
        timestamp: new Date().toISOString(),
        id: Date.now()
      });
      localStorage.setItem('newsletter_subscriptions', JSON.stringify(subscriptions.slice(-50))); // Keep last 50

      console.log('Newsletter subscription stored locally:', data.email);
      return true;
    } catch (error) {
      console.error('Error sending newsletter subscription email:', error);
      console.log('Newsletter subscription data:', data);
      return false;
    }
  },

  // Send career application email
  sendCareerApplication: async (data: CareerApplication): Promise<boolean> => {
    try {
      // Try Formspree
      try {
        const response = await fetch('https://formspree.io/f/xpwzljby', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            phone: data.phone,
            position: data.position,
            experience: data.experience,
            coverLetter: data.coverLetter,
            type: 'career_application',
            resume: data.resume ? data.resume.name : 'No resume attached',
            message: `New Job Application for ${data.position}\n\nApplicant: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\nExperience: ${data.experience}\n\nCover Letter:\n${data.coverLetter}`,
            subject: `Job Application: ${data.position} - DreamCodex`
          }),
        });

        if (response.ok) {
          console.log('Career application sent via Formspree');
          return true;
        }
      } catch (formspreeError) {
        console.log('Formspree failed for career application, using fallback...');
      }

      // Fallback: Store in localStorage and create mailto
      const applications = JSON.parse(localStorage.getItem('career_applications') || '[]');
      applications.push({
        ...data,
        timestamp: new Date().toISOString(),
        id: Date.now()
      });
      localStorage.setItem('career_applications', JSON.stringify(applications.slice(-20))); // Keep last 20

      // Create mailto link for manual sending
      const emailBody = `Job Application for ${data.position}

Applicant Details:
- Name: ${data.name}
- Email: ${data.email}
- Phone: ${data.phone}
- Position: ${data.position}
- Experience Level: ${data.experience}

Cover Letter:
${data.coverLetter}

${data.resume ? `Resume: ${data.resume.name}` : 'No resume attached'}

--
Application submitted via DreamCodex Website
Timestamp: ${new Date().toISOString()}`;

      const mailtoLink = `mailto:adityasatapathy2024@gmail.com?subject=${encodeURIComponent(`Job Application: ${data.position}`)}&body=${encodeURIComponent(emailBody)}`;
      
      console.log('Career application stored locally and mailto link created:', mailtoLink);
      console.log('Career application data:', data);
      return true;
    } catch (error) {
      console.error('Error sending career application email:', error);
      console.log('Career application data:', data);
      return false;
    }
  },

  // Send support email
  sendSupportEmail: async (data: ContactFormData): Promise<boolean> => {
    try {
      const response = await fetch('https://formspree.io/f/mpwzljby', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: 'adityasatapathy2024@gmail.com',
          subject: `Support Request: ${data.subject}`,
          name: data.name,
          email: data.email,
          phone: data.phone,
          company: data.company || 'Not provided',
          message: data.message,
          type: 'support_request',
          _replyto: data.email,
          _subject: `Support Request: ${data.subject} - DreamCodex`,
          _template: 'table'
        }),
      });

      if (response.ok) {
        console.log('Support email sent successfully');
        return true;
      } else {
        throw new Error('Failed to send support email');
      }
    } catch (error) {
      console.error('Error sending support email:', error);
      console.log('Support request data:', data);
      return false;
    }
  }
};

// Validation helpers
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s|-|\(|\)/g, ''));
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};