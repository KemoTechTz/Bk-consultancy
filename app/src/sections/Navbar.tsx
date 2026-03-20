import { useState, useEffect } from 'react';
import { Menu, X, Leaf, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Services', href: '#services' },
  { name: 'Projects', href: '#projects' },
  { name: 'Blog', href: '#blog' },
  { name: 'Contact', href: '#contact' },
];

const portalLinks = [
  { name: 'Client Portal', href: '#portal' },
  { name: 'AI Report Generator', href: '#ai-report' },
  { name: 'Compliance Tracker', href: '#compliance' },
  { name: 'Air Quality Dashboard', href: '#air-quality' },
  { name: 'Admin Dashboard', href: '#admin' },
];

const serviceOptions = [
  'Environmental Impact Assessment (EIA)',
  'Environmental Audit (EA)',
  'Environmental Protection Plan (EPP)',
  'Air Quality Monitoring',
  'Cleaning Services',
  'Fumigation Services',
  'Other Environmental Consulting',
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const handleConsultationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    setIsDialogOpen(false);
    alert('Thank you for your consultation request! We will contact you soon.');
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'py-3 px-4'
            : 'py-6 px-4'
        }`}
      >
        <div
          className={`mx-auto transition-all duration-500 ${
            isScrolled
              ? 'max-w-4xl bg-[#0f2e15]/80 backdrop-blur-xl rounded-full border border-eco-500/20 shadow-lg px-6'
              : 'max-w-7xl px-4'
          }`}
        >
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('#home');
              }}
              className="flex items-center gap-2 group"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-eco-400 to-eco-600 flex items-center justify-center group-hover:shadow-glow transition-shadow duration-300">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className={`font-heading font-bold text-white transition-all duration-300 ${isScrolled ? 'text-lg' : 'text-xl'}`}>
                BK <span className="text-eco-400">Environmental</span>
              </span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(link.href);
                  }}
                  className="text-sm text-gray-300 hover:text-eco-400 transition-colors duration-300 link-underline"
                >
                  {link.name}
                </a>
              ))}

              {/* Portal Links Dropdown */}
              <div className="relative group">
                <button className="text-sm text-gray-300 hover:text-eco-400 transition-colors duration-300 link-underline flex items-center gap-1">
                  Portal
                  <ChevronRight className="w-3 h-3 group-hover:rotate-90 transition-transform duration-300" />
                </button>
                <div className="absolute top-full right-0 mt-2 w-56 bg-[#0f2e15] border border-eco-500/20 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="p-2">
                    {portalLinks.map((link) => (
                      <a
                        key={link.name}
                        href={link.href}
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.hash = link.href.replace('#', '');
                        }}
                        className="block px-3 py-2 text-sm text-gray-300 hover:text-eco-400 hover:bg-eco-500/10 rounded-md transition-colors duration-200"
                      >
                        {link.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="hidden lg:block">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-eco-500 hover:bg-eco-400 text-white px-6 rounded-full shadow-glow hover:shadow-glow-lg transition-all duration-300">
                    Consultation
                  </Button>
                </DialogTrigger>
                  <DialogContent className="!fixed !top-[50%] !left-[50%] !translate-x-[-50%] !translate-y-[-50%] !z-[9999] max-w-lg bg-[#0f2e15] border-eco-500/30 text-white">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-heading text-eco-400">
                      Request Free Consultation
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleConsultationSubmit} className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-400 mb-1 block">Name</label>
                        <Input
                          placeholder="Your name"
                          className="bg-[#0a1f12] border-eco-500/30 text-white placeholder:text-gray-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400 mb-1 block">Company</label>
                        <Input
                          placeholder="Company name"
                          className="bg-[#0a1f12] border-eco-500/30 text-white placeholder:text-gray-500"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-400 mb-1 block">Phone</label>
                        <Input
                          placeholder="+255..."
                          className="bg-[#0a1f12] border-eco-500/30 text-white placeholder:text-gray-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400 mb-1 block">Email</label>
                        <Input
                          type="email"
                          placeholder="email@example.com"
                          className="bg-[#0a1f12] border-eco-500/30 text-white placeholder:text-gray-500"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Service Needed</label>
                      <Select>
                        <SelectTrigger className="bg-[#0a1f12] border-eco-500/30 text-white">
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#0f2e15] border-eco-500/30">
                          {serviceOptions.map((service) => (
                            <SelectItem
                              key={service}
                              value={service}
                              className="text-white hover:bg-eco-500/20"
                            >
                              {service}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Project Description</label>
                      <Textarea
                        placeholder="Tell us about your project..."
                        className="bg-[#0a1f12] border-eco-500/30 text-white placeholder:text-gray-500 min-h-[100px]"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-eco-500 hover:bg-eco-400 text-white py-3 rounded-lg shadow-glow"
                    >
                      Submit Request
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden fixed inset-x-0 top-20 mx-4 bg-[#0f2e15]/95 backdrop-blur-xl rounded-2xl border border-eco-500/20 shadow-xl overflow-hidden transition-all duration-300 ${
            isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}
        >
          <div className="p-6 space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(link.href);
                }}
                className="block text-lg text-gray-300 hover:text-eco-400 transition-colors duration-300 py-2"
              >
                {link.name}
              </a>
            ))}

            {/* Portal Links */}
            <div className="border-t border-eco-500/20 pt-4 mt-4">
              <h3 className="text-sm font-medium text-eco-400 mb-3">Client Portal</h3>
              {portalLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.hash = link.href.replace('#', '');
                  }}
                  className="block text-base text-gray-300 hover:text-eco-400 transition-colors duration-300 py-2 pl-2"
                >
                  {link.name}
                </a>
              ))}
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full bg-eco-500 hover:bg-eco-400 text-white mt-4 rounded-lg">
                  Request Consultation
                </Button>
              </DialogTrigger>
                <DialogContent className="!fixed !top-[50%] !left-[50%] !translate-x-[-50%] !translate-y-[-50%] !z-[9999] max-w-lg bg-[#0f2e15] border-eco-500/30 text-white max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-heading text-eco-400">
                    Request Free Consultation
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleConsultationSubmit} className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Name</label>
                      <Input
                        placeholder="Your name"
                        className="bg-[#0a1f12] border-eco-500/30 text-white placeholder:text-gray-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Company</label>
                      <Input
                        placeholder="Company name"
                        className="bg-[#0a1f12] border-eco-500/30 text-white placeholder:text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Phone</label>
                      <Input
                        placeholder="+255..."
                        className="bg-[#0a1f12] border-eco-500/30 text-white placeholder:text-gray-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Email</label>
                      <Input
                        type="email"
                        placeholder="email@example.com"
                        className="bg-[#0a1f12] border-eco-500/30 text-white placeholder:text-gray-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Service Needed</label>
                    <Select>
                      <SelectTrigger className="bg-[#0a1f12] border-eco-500/30 text-white">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0f2e15] border-eco-500/30">
                        {serviceOptions.map((service) => (
                          <SelectItem
                            key={service}
                            value={service}
                            className="text-white hover:bg-eco-500/20"
                          >
                            {service}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Project Description</label>
                    <Textarea
                      placeholder="Tell us about your project..."
                      className="bg-[#0a1f12] border-eco-500/30 text-white placeholder:text-gray-500 min-h-[100px]"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-eco-500 hover:bg-eco-400 text-white py-3 rounded-lg shadow-glow"
                  >
                    Submit Request
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </nav>
    </>
  );
}
