import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BadgeCheck, Layers, Clock, Headphones } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const reasons = [
  {
    icon: BadgeCheck,
    title: 'NEMC Certified Experts',
    description:
      'Our team consists of registered environmental experts certified by the National Environmental Management Council of Tanzania.',
  },
  {
    icon: Layers,
    title: 'Comprehensive Solutions',
    description:
      'From initial assessment to ongoing monitoring, we provide end-to-end environmental services tailored to your needs.',
  },
  {
    icon: Clock,
    title: 'Timely Delivery',
    description:
      'We understand the importance of deadlines. Our efficient processes ensure your projects are completed on time, every time.',
  },
  {
    icon: Headphones,
    title: 'Ongoing Support',
    description:
      'Our commitment doesnt end with project delivery. We provide continuous support to ensure long-term compliance and success.',
  },
];

export default function WhyChooseUs() {
  const sectionRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // SVG line drawing animation
      const paths = svgRef.current?.querySelectorAll('path');
      if (paths) {
        paths.forEach((path) => {
          const length = path.getTotalLength();
          gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: length,
          });

          gsap.to(path, {
            strokeDashoffset: 0,
            duration: 1.5,
            ease: 'power2.inOut',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          });
        });
      }

      // Cards animation
      gsap.fromTo(
        cardsRef.current?.children || [],
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Animated dots along paths
      const dots = svgRef.current?.querySelectorAll('.animated-dot');
      if (dots) {
        dots.forEach((dot, index) => {
          gsap.to(dot, {
            motionPath: {
              path: paths?.[index % (paths?.length || 1)] as unknown as string,
              align: paths?.[index % (paths?.length || 1)] as unknown as string,
              alignOrigin: [0.5, 0.5],
            },
            duration: 3 + index * 0.5,
            repeat: -1,
            ease: 'none',
          });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-eco-500/5 to-transparent pointer-events-none" />

      <div className="section-padding relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <p className="text-eco-400 font-medium tracking-wider uppercase text-sm mb-4">
              Why Choose Us
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-white mb-6">
              Expertise That Makes a{' '}
              <span className="text-gradient">Difference</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We combine technical expertise with local knowledge to deliver
              environmental solutions that work for your business and the planet.
            </p>
          </div>

          {/* Grid with connecting lines */}
          <div className="relative">
            {/* SVG Connection Lines - Desktop only */}
            <svg
              ref={svgRef}
              className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block"
              viewBox="0 0 1200 400"
              preserveAspectRatio="none"
            >
              {/* Horizontal connections */}
              <path
                d="M 200 100 Q 400 50 600 100"
                fill="none"
                stroke="rgba(74, 222, 128, 0.2)"
                strokeWidth="2"
              />
              <path
                d="M 600 100 Q 800 150 1000 100"
                fill="none"
                stroke="rgba(74, 222, 128, 0.2)"
                strokeWidth="2"
              />
              <path
                d="M 200 300 Q 400 350 600 300"
                fill="none"
                stroke="rgba(74, 222, 128, 0.2)"
                strokeWidth="2"
              />
              <path
                d="M 600 300 Q 800 250 1000 300"
                fill="none"
                stroke="rgba(74, 222, 128, 0.2)"
                strokeWidth="2"
              />
              {/* Vertical connections */}
              <path
                d="M 200 100 Q 150 200 200 300"
                fill="none"
                stroke="rgba(74, 222, 128, 0.2)"
                strokeWidth="2"
              />
              <path
                d="M 1000 100 Q 1050 200 1000 300"
                fill="none"
                stroke="rgba(74, 222, 128, 0.2)"
                strokeWidth="2"
              />
              {/* Center cross */}
              <path
                d="M 600 100 Q 650 200 600 300"
                fill="none"
                stroke="rgba(74, 222, 128, 0.2)"
                strokeWidth="2"
              />

              {/* Animated dots */}
              <circle className="animated-dot" r="4" fill="#4ade80" />
              <circle className="animated-dot" r="4" fill="#4ade80" />
              <circle className="animated-dot" r="4" fill="#4ade80" />
              <circle className="animated-dot" r="4" fill="#4ade80" />
            </svg>

            {/* Cards Grid */}
            <div
              ref={cardsRef}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {reasons.map((reason, index) => {
                const Icon = reason.icon;
                return (
                  <div
                    key={index}
                    className="group relative bg-[#0f2e15] border border-eco-500/20 rounded-2xl p-6 hover:border-eco-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-eco-500/10"
                  >
                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-eco-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="relative">
                      {/* Icon */}
                      <div className="w-14 h-14 rounded-xl bg-eco-500/20 flex items-center justify-center mb-5 group-hover:bg-eco-500/30 group-hover:scale-110 transition-all duration-300">
                        <Icon className="w-7 h-7 text-eco-400" />
                      </div>

                      {/* Title */}
                      <h3 className="font-heading font-bold text-white text-lg mb-3">
                        {reason.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {reason.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom stats */}
          <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: '10+', label: 'Years Experience' },
              { value: '200+', label: 'Happy Clients' },
              { value: '15+', label: 'Industry Awards' },
              { value: '24/7', label: 'Support Available' },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center p-4 rounded-xl bg-[#0f2e15]/50 border border-eco-500/10"
              >
                <div className="text-2xl lg:text-3xl font-heading font-bold text-eco-400">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
