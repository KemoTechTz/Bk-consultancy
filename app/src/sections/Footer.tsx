import { Leaf, MapPin, Phone, Mail, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const quickLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About Us', href: '#about' },
  { name: 'Services', href: '#services' },
  { name: 'Projects', href: '#projects' },
  { name: 'Blog', href: '#blog' },
  { name: 'Contact', href: '#contact' },
];

const services = [
  'Environmental Impact Assessment',
  'Environmental Audit',
  'Environmental Protection Plan',
  'Air Quality Monitoring',
  'Cleaning Services',
  'Fumigation Services',
];

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Instagram, href: '#', label: 'Instagram' },
];

export default function Footer() {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative bg-[#05140a] border-t border-eco-500/10">
      {/* Main Footer */}
      <div className="section-padding py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand Column */}
            <div className="lg:col-span-1">
              {/* Logo */}
              <a href="#home" className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-eco-400 to-eco-600 flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <span className="font-heading font-bold text-white text-lg">
                  BK <span className="text-eco-400">Environmental</span>
                </span>
              </a>

              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                Leading environmental consultancy in Tanzania, providing comprehensive
                solutions for NEMC compliance and sustainable development.
              </p>

              {/* Social Links */}
              <div className="flex gap-3">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      aria-label={social.label}
                      className="w-10 h-10 rounded-full bg-[#0f2e15] border border-eco-500/20 flex items-center justify-center text-gray-400 hover:text-eco-400 hover:border-eco-500/40 transition-all duration-300"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-heading font-bold text-white mb-6">Quick Links</h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection(link.href);
                      }}
                      className="text-gray-400 hover:text-eco-400 transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="font-heading font-bold text-white mb-6">Our Services</h3>
              <ul className="space-y-3">
                {services.map((service, index) => (
                  <li key={index}>
                    <a
                      href="#services"
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection('#services');
                      }}
                      className="text-gray-400 hover:text-eco-400 transition-colors text-sm"
                    >
                      {service}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-heading font-bold text-white mb-6">Contact Us</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-eco-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-400 text-sm">
                    Dodoma, Tanzania
                    <br />
                    P.O. Box 1234
                  </span>
                </li>
                <li>
                  <a
                    href="tel:+255714052096"
                    className="flex items-center gap-3 text-gray-400 hover:text-eco-400 transition-colors text-sm"
                  >
                    <Phone className="w-5 h-5 text-eco-400 flex-shrink-0" />
                    0714 052 096
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+255784388960"
                    className="flex items-center gap-3 text-gray-400 hover:text-eco-400 transition-colors text-sm"
                  >
                    <Phone className="w-5 h-5 text-eco-400 flex-shrink-0" />
                    0784 388 960
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:barakamaleka4@gmail.com"
                    className="flex items-center gap-3 text-gray-400 hover:text-eco-400 transition-colors text-sm"
                  >
                    <Mail className="w-5 h-5 text-eco-400 flex-shrink-0" />
                    barakamaleka4@gmail.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-eco-500/10">
        <div className="section-padding py-6">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm text-center sm:text-left">
              &copy; {new Date().getFullYear()} BK Environmental Consultancy Services.
              All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-500 hover:text-eco-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-500 hover:text-eco-400 transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
