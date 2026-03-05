// Enhanced email notification service with better user feedback
interface EmailNotificationData {
  type: 'contact' | 'newsletter' | 'career' | 'support';
  data: any;
  userEmail: string;
  userName?: string;
}

export const emailNotificationService = {
  // Show immediate confirmation to user
  showImmediateConfirmation: (type: string, userEmail: string) => {
    return {
      title: getConfirmationTitle(type),
      message: getConfirmationMessage(type, userEmail),
      actions: getFollowUpActions(type, userEmail)
    };
  },

  // Send notification to admin emails directly
  notifyAdmins: async (notificationData: EmailNotificationData) => {
    const adminEmails = [
      'adityasatapathy2024@gmail.com',
      'mdjaneshar98@gmail.com',
      'adityasachikanta12@gmail.com'
    ];

    // Create email content
    const subject = getEmailSubject(notificationData.type, notificationData.data);
    const body = getEmailBody(notificationData);

    // Try to send to each admin email
    const promises = adminEmails.map(email => 
      sendDirectEmail(email, subject, body)
    );

    const results = await Promise.allSettled(promises);
    
    // Log results
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        console.log(`Email sent to ${adminEmails[index]}`);
      } else {
        console.log(`Failed to send to ${adminEmails[index]}:`, result.reason);
      }
    });

    return results.some(result => result.status === 'fulfilled');
  }
};

function getConfirmationTitle(type: string): string {
  switch (type) {
    case 'contact':
      return 'Message Received Successfully! ✅';
    case 'newsletter':
      return 'Newsletter Subscription Confirmed! 📧';
    case 'career':
      return 'Application Submitted Successfully! 🎯';
    case 'support':
      return 'Support Request Created! 🛠️';
    default:
      return 'Request Processed Successfully! ✅';
  }
}

function getConfirmationMessage(type: string, userEmail: string): string {
  const baseMessage = `We've received your ${type} request and saved it to our system.`;
  
  switch (type) {
    case 'contact':
      return `${baseMessage} Our team will review your message and respond to ${userEmail} within 24 hours. You can expect a personalized response addressing your specific needs.`;
    case 'newsletter':
      return `${baseMessage} Welcome to the DreamCodex newsletter! You'll receive updates about our latest projects, technology insights, and industry news at ${userEmail}.`;
    case 'career':
      return `${baseMessage} Our HR team will review your application and contact you at ${userEmail} within 48 hours if your profile matches our requirements.`;
    case 'support':
      return `${baseMessage} Our technical support team will investigate your issue and provide assistance at ${userEmail} as soon as possible.`;
    default:
      return `${baseMessage} We'll get back to you at ${userEmail} soon.`;
  }
}

function getFollowUpActions(type: string, userEmail: string): Array<{ label: string; action: () => void }> {
  const baseActions = [
    {
      label: 'Send via Email Client',
      action: () => {
        const subject = encodeURIComponent(`Follow-up: ${type} request`);
        const body = encodeURIComponent(`Hi DreamCodex Team,\n\nI just submitted a ${type} request. Please confirm you received it.\n\nEmail: ${userEmail}\n\nThanks!`);
        window.location.href = `mailto:adityasatapathy2024@gmail.com?subject=${subject}&body=${body}`;
      }
    }
  ];

  if (type === 'contact' || type === 'support') {
    baseActions.push({
      label: 'Call Directly',
      action: () => window.location.href = 'tel:+91-8000517223'
    });
  }

  return baseActions;
}

function getEmailSubject(type: string, data: any): string {
  switch (type) {
    case 'contact':
      return `New Contact: ${data.subject || 'General Inquiry'} - DreamCodex`;
    case 'newsletter':
      return `Newsletter Subscription - ${data.email} - DreamCodex`;
    case 'career':
      return `Job Application: ${data.position || 'General'} from ${data.name} - DreamCodex`;
    case 'support':
      return `Support Request: ${data.subject || 'Technical Support'} - DreamCodex`;
    default:
      return `New Request - DreamCodex`;
  }
}

function getEmailBody(notificationData: EmailNotificationData): string {
  const { type, data } = notificationData;
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  let body = `New ${type} request received on DreamCodex website\n\n`;
  body += `Timestamp: ${timestamp}\n`;
  body += `IP: ${getClientIP()}\n\n`;

  switch (type) {
    case 'contact':
      body += `CONTACT DETAILS:\n`;
      body += `Name: ${data.name}\n`;
      body += `Email: ${data.email}\n`;
      body += `Phone: ${data.phone}\n`;
      body += `Company: ${data.company || 'Not specified'}\n`;
      body += `Subject: ${data.subject}\n\n`;
      body += `MESSAGE:\n${data.message}\n\n`;
      break;

    case 'newsletter':
      body += `NEWSLETTER SUBSCRIPTION:\n`;
      body += `Email: ${data.email}\n\n`;
      break;

    case 'career':
      body += `JOB APPLICATION:\n`;
      body += `Name: ${data.name}\n`;
      body += `Email: ${data.email}\n`;
      body += `Phone: ${data.phone}\n`;
      body += `Position: ${data.position}\n`;
      body += `Experience: ${data.experience}\n\n`;
      body += `COVER LETTER:\n${data.coverLetter}\n\n`;
      if (data.resume) {
        body += `Resume: ${data.resume.name || 'Attached'}\n\n`;
      }
      break;

    case 'support':
      body += `SUPPORT REQUEST:\n`;
      body += `Name: ${data.name}\n`;
      body += `Email: ${data.email}\n`;
      body += `Subject: ${data.subject}\n\n`;
      body += `DETAILS:\n${data.message}\n\n`;
      break;
  }

  body += `---\nThis email was automatically generated from the DreamCodex website.\n`;
  body += `Please respond directly to the customer's email address.\n`;

  return body;
}

function getClientIP(): string {
  // This is a simple approximation since we can't get real IP on client-side
  return 'Client IP (unavailable in browser)';
}

async function sendDirectEmail(to: string, subject: string, body: string): Promise<boolean> {
  try {
    // Try multiple email services in order of preference
    
    // Method 1: Use a simple fetch to our own backend if available
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, subject, body })
      });
      if (response.ok) return true;
    } catch {}

    // Method 2: Use Formspree free tier
    try {
      const response = await fetch('https://formspree.io/f/xayllqgy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: body,
          subject: subject,
          email: to,
          _replyto: 'noreply@dreamcodex.com'
        })
      });
      if (response.ok) return true;
    } catch {}

    // Method 3: Use EmailJS if configured
    if (typeof window !== 'undefined' && (window as any).emailjs) {
      try {
        await (window as any).emailjs.send(
          'service_id',
          'template_id',
          {
            to_email: to,
            subject: subject,
            message: body,
            from_name: 'DreamCodex Website'
          },
          'public_key'
        );
        return true;
      } catch {}
    }

    // Fallback: Open mailto (this always "succeeds" from user perspective)
    const mailtoUrl = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    if (typeof window !== 'undefined') {
      // Don't open mailto automatically, just log it
      console.log('Mailto URL created:', mailtoUrl);
    }
    
    return false; // Indicate that automated sending failed
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
}

export default emailNotificationService;