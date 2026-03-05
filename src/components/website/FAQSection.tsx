import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const faqs = [
  {
    id: 1,
    question: 'What services does DreamCodex offer?',
    answer: 'We offer a comprehensive range of software development services including web development, mobile app development, cloud solutions, AI/ML development, UI/UX design, and database solutions. We specialize in modern technologies like React, Angular, Spring Boot, Java, and cloud platforms like AWS.'
  },
  {
    id: 2,
    question: 'How long does it typically take to complete a project?',
    answer: 'Project timelines vary based on complexity and requirements. Simple websites can take 2-4 weeks, while complex enterprise applications may take 3-6 months or more. We provide detailed project timelines during the initial consultation and keep you updated throughout the development process.'
  },
  {
    id: 3,
    question: 'What is your development process?',
    answer: 'We follow an agile development methodology with four main phases: Discovery (understanding requirements), Design (creating wireframes and UI/UX), Development (building with modern technologies), and Deployment (launch and ongoing support). We maintain regular communication and provide updates throughout each phase.'
  },
  {
    id: 4,
    question: 'Do you provide ongoing support and maintenance?',
    answer: 'Yes, we provide comprehensive post-launch support including bug fixes, security updates, performance optimization, and feature enhancements. We offer different support packages to meet your needs, from basic maintenance to full-scale ongoing development.'
  },
  {
    id: 5,
    question: 'What technologies do you work with?',
    answer: 'Our team specializes in modern technologies including Java, Spring Boot, React, Angular, Node.js, MongoDB, Oracle, AWS, Docker, and many more. We stay updated with the latest industry trends and continuously expand our technology stack to provide the best solutions.'
  },
  {
    id: 6,
    question: 'Can you work with our existing team or systems?',
    answer: 'Absolutely! We have experience integrating with existing teams, systems, and workflows. Whether you need to extend your current development capacity, modernize legacy systems, or integrate new solutions with existing infrastructure, we can adapt to your requirements.'
  },
  {
    id: 7,
    question: 'How do you ensure project quality and security?',
    answer: 'We follow industry best practices including code reviews, automated testing, security audits, and compliance with standards like GDPR and SOC 2. Our development process includes thorough testing at every stage, and we implement robust security measures to protect your data and systems.'
  },
  {
    id: 8,
    question: 'What are your pricing models?',
    answer: 'We offer flexible pricing models including fixed-price projects, time and materials, and dedicated team arrangements. Pricing depends on project scope, complexity, timeline, and resources required. We provide detailed quotes after understanding your specific requirements during the initial consultation.'
  },
  {
    id: 9,
    question: 'Do you work with startups and small businesses?',
    answer: 'Yes, we work with businesses of all sizes, from startups and small businesses to large enterprises. We understand that each business has unique needs and budget constraints, and we tailor our solutions and pricing accordingly to provide maximum value.'
  },
  {
    id: 10,
    question: 'How do we get started with a project?',
    answer: 'Getting started is easy! Contact us through our website, email, or phone to schedule a free consultation. We\'ll discuss your requirements, provide recommendations, and create a detailed proposal. Once approved, we can begin work immediately with a clear project plan and timeline.'
  }
];

export const FAQSection: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (id: number) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <div className="py-20 lg:py-32 bg-gray-50 dark:bg-gray-800/50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
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
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
              Frequently Asked Questions
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Find answers to the most common questions about our services, processes, and how we can help 
            bring your project to life. Can't find what you're looking for? Contact us directly.
          </p>
        </motion.div>

        {/* FAQ List */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300 group"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-8 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0">
                    <motion.div
                      animate={{ rotate: openFaq === faq.id ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center"
                    >
                      <ChevronDown className="w-4 h-4 text-white" />
                    </motion.div>
                  </div>
                </button>
                
                <motion.div
                  initial={false}
                  animate={{
                    height: openFaq === faq.id ? 'auto' : 0,
                    opacity: openFaq === faq.id ? 1 : 0
                  }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="px-8 pb-6">
                    <div className="w-full h-px bg-gradient-to-r from-blue-600/20 to-purple-600/20 mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Still Have Questions CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 border border-blue-200/50 dark:border-blue-800/50">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Still have questions?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Can't find the answer you're looking for? Our team is here to help. 
                Reach out to us and we'll get back to you as soon as possible.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.a
                  href="mailto:adityasatapathy2024@gmail.com"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <HelpCircle className="w-5 h-5 mr-2" />
                  Contact Support
                </motion.a>
                
                <motion.a
                  href="tel:+123-456-7890"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium rounded-lg transition-all duration-300 bg-white dark:bg-gray-800"
                >
                  <span className="mr-2">📞</span>
                  Call Us
                </motion.a>
              </div>
              
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                We typically respond within 24 hours
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};