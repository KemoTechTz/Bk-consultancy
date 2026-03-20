import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

gsap.registerPlugin(ScrollTrigger);

export default function CTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { scale: 0.9, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
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
      id="contact"
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-[#0f2e15]">
        {/* Rotating gradient */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'conic-gradient(from 0deg at 50% 50%, #0f2e15 0deg, #1a4d24 90deg, #0f2e15 180deg, #2d7a3e 270deg, #0f2e15 360deg)',
            animation: 'spin 20s linear infinite',
          }}
        />
        
        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-gradient-radial from-eco-500/10 via-transparent to-transparent" />
        
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(74, 222, 128, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(74, 222, 128, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="section-padding relative z-10">
        <div className="max-w-4xl mx-auto">
          <div
            ref={contentRef}
            className="text-center opacity-0"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-eco-500/20 rounded-full mb-8">
              <div className="w-2 h-2 bg-eco-400 rounded-full animate-pulse" />
              <span className="text-eco-400 text-sm font-medium">
                Free Initial Consultation
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-heading font-bold text-white mb-6">
              Ready to Start Your{' '}
              <span className="text-gradient">Environmental</span> Journey?
            </h2>

            {/* Description */}
            <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
              Contact us today for a free consultation. Our team of NEMC-certified experts
              is ready to help you achieve environmental compliance and sustainable success.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button
                className="btn-primary group flex items-center gap-2 text-lg px-8 py-4"
                onClick={() => {
                  alert('Consultation request feature coming soon!');
                }}
              >
                Get Free Consultation
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <a href="tel:+255714052096">
                <Button
                  variant="outline"
                  className="btn-outline flex items-center gap-2 text-lg px-8 py-4"
                >
                  <Phone className="w-5 h-5" />
                  Call Us Now
                </Button>
              </a>
            </div>

            {/* Contact Info */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-gray-400">
              <a
                href="tel:+255714052096"
                className="flex items-center gap-2 hover:text-eco-400 transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span>0714 052 096</span>
              </a>
              <a
                href="tel:+255784388960"
                className="flex items-center gap-2 hover:text-eco-400 transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span>0784 388 960</span>
              </a>
              <a
                href="mailto:barakamaleka4@gmail.com"
                className="flex items-center gap-2 hover:text-eco-400 transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span>barakamaleka4@gmail.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
