import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Award, Users, ThumbsUp, CheckCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { icon: Award, value: 50, suffix: '+', label: 'Projects Completed' },
  { icon: Users, value: 50, suffix: '+', label: 'Expert Consultants' },
  { icon: ThumbsUp, value: 100, suffix: '%', label: 'Client Satisfaction' },
];

const features = [
  'NEMC Certified Environmental Experts',
  'Comprehensive EIA & Audit Services',
  'Air Quality Monitoring Solutions',
  'Sustainable Development Consulting',
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [counters, setCounters] = useState(stats.map(() => 0));

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Image reveal animation
      gsap.fromTo(
        imageRef.current,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.5,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Content animation
      gsap.fromTo(
        contentRef.current?.children || [],
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Stats counter animation
      ScrollTrigger.create({
        trigger: statsRef.current,
        start: 'top 80%',
        onEnter: () => {
          stats.forEach((stat, index) => {
            gsap.to(
              { value: 0 },
              {
                value: stat.value,
                duration: 2,
                ease: 'power2.out',
                onUpdate: function () {
                  setCounters((prev) => {
                    const newCounters = [...prev];
                    newCounters[index] = Math.round(this.targets()[0].value);
                    return newCounters;
                  });
                },
              }
            );
          });
        },
        once: true,
      });

      // Parallax effect
      gsap.to(imageRef.current, {
        rotate: 2,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      <div className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image Column */}
            <div ref={imageRef} className="relative opacity-0">
              {/* Blob shape container */}
              <div className="relative aspect-[4/5] max-w-lg mx-auto lg:mx-0">
                {/* Animated blob background */}
                <div className="absolute inset-0 bg-gradient-to-br from-eco-500/20 to-eco-700/20 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] animate-pulse" />

                {/* Image */}
                <div className="absolute inset-4 overflow-hidden rounded-[35%_65%_65%_35%/45%_45%_55%_55%]">
                  <img
                    src="/images/about-team.jpg"
                    alt="BK Environmental Team"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                  />
                </div>

                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-eco-500/30 rounded-full blur-2xl" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-eco-400/20 rounded-full blur-3xl" />
              </div>

              {/* Floating badge */}
              <div className="absolute bottom-8 -right-4 lg:right-8 bg-[#0f2e15] border border-eco-500/30 rounded-2xl p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-eco-500/20 rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-eco-400" />
                  </div>
                  <div>
                    <div className="text-white font-heading font-bold">NEMC</div>
                    <div className="text-gray-400 text-sm">Certified</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Column */}
            <div ref={contentRef} className="lg:pl-8">
              <p className="text-eco-400 font-medium tracking-wider uppercase text-sm mb-4 opacity-0">
                About Us
              </p>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-white mb-6 opacity-0">
                Leading Environmental{' '}
                <span className="text-gradient">Consultancy</span> in Tanzania
              </h2>

              <p className="text-gray-300 text-lg mb-8 opacity-0">
                With years of experience and a team of NEMC-certified experts, we provide
                comprehensive environmental solutions that help businesses thrive while
                protecting our planet. Our commitment to excellence has made us the trusted
                partner for companies across Tanzania.
              </p>

              {/* Features list */}
              <div className="space-y-4 mb-10">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 opacity-0"
                    style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                  >
                    <CheckCircle className="w-5 h-5 text-eco-400 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div
                ref={statsRef}
                className="grid grid-cols-3 gap-6 pt-8 border-t border-eco-500/20"
              >
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-2xl sm:text-3xl font-heading font-bold text-eco-400">
                        {counters[index]}
                      </span>
                      <span className="text-2xl sm:text-3xl font-heading font-bold text-eco-400">
                        {stat.suffix}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
