import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ClipboardCheck,
  Search,
  Shield,
  Wind,
  Sparkles,
  SprayCan,
  ArrowRight,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    icon: ClipboardCheck,
    title: 'Environmental Impact Assessment',
    shortTitle: 'EIA',
    description:
      'Comprehensive EIA studies for NEMC compliance. We evaluate potential environmental impacts of your projects and provide mitigation strategies.',
    features: ['Screening & Scoping', 'Baseline Studies', 'Impact Prediction', 'Mitigation Planning'],
    color: 'from-eco-600 to-eco-700',
  },
  {
    icon: Search,
    title: 'Environmental Audit',
    shortTitle: 'Audit',
    description:
      'Detailed environmental auditing services to assess your compliance with environmental regulations and identify improvement opportunities.',
    features: ['Compliance Audit', 'Performance Evaluation', 'Gap Analysis', 'Recommendations'],
    color: 'from-eco-500 to-eco-600',
  },
  {
    icon: Shield,
    title: 'Environmental Protection Plan',
    shortTitle: 'EPP',
    description:
      'Custom environmental management solutions tailored to your specific industry needs and regulatory requirements.',
    features: ['Risk Assessment', 'Action Plans', 'Monitoring Programs', 'Emergency Response'],
    color: 'from-emerald-600 to-emerald-700',
  },
  {
    icon: Wind,
    title: 'Air Quality Monitoring',
    shortTitle: 'Air Quality',
    description:
      'Continuous air quality assessment using state-of-the-art equipment to ensure your operations meet environmental standards.',
    features: ['Real-time Monitoring', 'Data Analysis', 'Reporting', 'Compliance Tracking'],
    color: 'from-teal-600 to-teal-700',
  },
  {
    icon: Sparkles,
    title: 'Cleaning Services',
    shortTitle: 'Cleaning',
    description:
      'Professional environmental cleaning services for industrial and commercial facilities, ensuring safe and healthy workspaces.',
    features: ['Industrial Cleaning', 'Waste Management', 'Site Remediation', 'Decontamination'],
    color: 'from-cyan-600 to-cyan-700',
  },
  {
    icon: SprayCan,
    title: 'Fumigation Services',
    shortTitle: 'Fumigation',
    description:
      'Safe and effective pest control solutions using eco-friendly methods that protect both people and the environment.',
    features: ['Pest Control', 'Termite Treatment', 'Rodent Control', 'Preventive Measures'],
    color: 'from-green-600 to-green-700',
  },
];

export default function Services() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Cards entrance animation
      gsap.fromTo(
        cardsRef.current?.children || [],
        { x: 100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-eco-500/5 to-transparent pointer-events-none" />

      <div className="section-padding relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <p className="text-eco-400 font-medium tracking-wider uppercase text-sm mb-4">
              Our Services
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-white mb-6">
              Comprehensive{' '}
              <span className="text-gradient">Environmental</span> Solutions
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              From EIA studies to air quality monitoring, we offer a complete range of
              environmental services to help your business succeed sustainably.
            </p>
          </div>

          {/* Services Grid - Desktop Accordion */}
          <div
            ref={cardsRef}
            className="hidden lg:flex gap-3 h-[500px]"
          >
            {services.map((service, index) => {
              const Icon = service.icon;
              const isActive = activeIndex === index;

              return (
                <div
                  key={index}
                  className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ease-out ${
                    isActive ? 'flex-[3]' : 'flex-1'
                  }`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                  style={{
                    background: `linear-gradient(135deg, ${
                      isActive ? 'rgba(45, 122, 62, 0.9)' : 'rgba(15, 46, 21, 0.9)'
                    }, rgba(10, 31, 18, 0.95))`,
                  }}
                >
                  {/* Background gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 transition-opacity duration-500 ${
                      isActive ? 'opacity-20' : ''
                    }`}
                  />

                  {/* Content */}
                  <div className="relative h-full p-6 flex flex-col">
                    {/* Icon */}
                    <div
                      className={`w-14 h-14 rounded-xl bg-eco-500/20 flex items-center justify-center mb-4 transition-all duration-500 ${
                        isActive ? 'scale-110 bg-eco-500/30' : ''
                      }`}
                    >
                      <Icon className="w-7 h-7 text-eco-400" />
                    </div>

                    {/* Title */}
                    <h3
                      className={`font-heading font-bold text-white transition-all duration-500 ${
                        isActive
                          ? 'text-2xl mb-4'
                          : 'text-lg writing-mode-vertical lg:[writing-mode:vertical-rl] lg:rotate-180'
                      }`}
                    >
                      {isActive ? service.title : service.shortTitle}
                    </h3>

                    {/* Expanded Content */}
                    <div
                      className={`flex-1 flex flex-col justify-between transition-all duration-500 ${
                        isActive ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {service.description}
                      </p>

                      {/* Features */}
                      <div className="mt-4 space-y-2">
                        {service.features.map((feature, fIndex) => (
                          <div
                            key={fIndex}
                            className="flex items-center gap-2 text-sm text-gray-300"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-eco-400" />
                            {feature}
                          </div>
                        ))}
                      </div>

                      {/* CTA */}
                      <button className="mt-6 flex items-center gap-2 text-eco-400 hover:text-eco-300 transition-colors group">
                        <span className="text-sm font-medium">Learn More</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Services Grid - Mobile/Tablet */}
          <div className="lg:hidden grid sm:grid-cols-2 gap-4">
            {services.map((service, index) => {
              const Icon = service.icon;

              return (
                <div
                  key={index}
                  className="group relative rounded-2xl overflow-hidden bg-[#0f2e15] border border-eco-500/20 p-6 hover:border-eco-500/40 transition-all duration-300"
                >
                  {/* Background gradient on hover */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                  />

                  <div className="relative">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl bg-eco-500/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-eco-500/30 transition-all duration-300">
                      <Icon className="w-6 h-6 text-eco-400" />
                    </div>

                    {/* Title */}
                    <h3 className="font-heading font-bold text-white text-lg mb-2">
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {service.description}
                    </p>

                    {/* CTA */}
                    <button className="flex items-center gap-2 text-eco-400 hover:text-eco-300 transition-colors">
                      <span className="text-sm font-medium">Learn More</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
