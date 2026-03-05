import React, { useState, useEffect } from 'react';
import { Header } from './website/Header';
import { HeroSection } from './website/HeroSection';
import { AboutSection } from './website/AboutSection';
import { ServicesSection } from './website/ServicesSection';
import { TechnologiesSection } from './website/TechnologiesSection';
import { CounterSection } from './website/CounterSection';

import { TestimonialsSection } from './website/TestimonialsSection';
import { CustomerTestimonialsSection } from './website/CustomerTestimonialsSection';
import { DashboardSection } from './website/DashboardSection';
import { TeamSection } from './website/TeamSection';
import { CareerSection } from './website/CareerSection';
import { ContactSection } from './website/ContactSection';
import { FAQSection } from './website/FAQSection';
import { Footer } from './website/Footer';
import { useTheme } from '../context/ThemeContext';

export const DreamCodexWebsite: React.FC = () => {
  const { theme } = useTheme();
  const [activeSection, setActiveSection] = useState('home');

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      setActiveSection(sectionId);
    }
  };

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'services', 'team', 'career', 'contact', 'faq'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="bg-background text-foreground">
        {/* Header */}
        <Header activeSection={activeSection} scrollToSection={scrollToSection} />

        {/* Hero Section */}
        <section id="home">
          <HeroSection scrollToSection={scrollToSection} />
        </section>

        {/* About Section */}
        <section id="about">
          <AboutSection />
        </section>

        {/* Services Section */}
        <section id="services">
          <ServicesSection />
        </section>

        {/* Technologies Section */}
        <TechnologiesSection />

        {/* Counter Section */}
        <CounterSection />

        {/* Dashboard Section */}
        <DashboardSection />



        {/* Testimonials Section */}
        <TestimonialsSection />

        {/* Customer Testimonials Section */}
        <CustomerTestimonialsSection />

        {/* Team Section */}
        <section id="team">
          <TeamSection scrollToSection={scrollToSection} />
        </section>

        {/* Career Section */}
        <section id="career">
          <CareerSection />
        </section>

        {/* Contact Section */}
        <section id="contact">
          <ContactSection />
        </section>

        {/* FAQ Section */}
        <section id="faq">
          <FAQSection />
        </section>

        {/* Footer */}
        <Footer scrollToSection={scrollToSection} />
      </div>
    </div>
  );
};