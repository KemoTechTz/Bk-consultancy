import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Quote, Star } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    id: 1,
    name: 'Baraka Maleka',
    role: 'CEO, Maleka Industries',
    avatar: '/images/client-avatar.jpg',
    quote:
      'BK Environmental transformed our compliance process. Their team of NEMC-certified experts guided us through every step of the EIA process, and we obtained our certificate ahead of schedule. Highly recommended!',
    rating: 5,
  },
  {
    id: 2,
    name: 'Dr. Regina ',
    role: 'Operations Director, TanzAgro Ltd',
    avatar: '/images/client-avatar.jpg',
    quote:
      'The air quality monitoring system they installed has been invaluable. Real-time data helps us make informed decisions and maintain compliance with environmental regulations.',
    rating: 5,
  },


];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Orbit entrance animation
      gsap.fromTo(
        orbitRef.current,
        { rotate: -90, scale: 0 },
        {
          rotate: 0,
          scale: 1,
          duration: 1,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Avatars pop in
      gsap.fromTo(
        '.avatar-item',
        { scale: 0 },
        {
          scale: 1,
          duration: 0.4,
          stagger: 0.1,
          ease: 'back.out(1.7)',
          delay: 0.8,
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

  const activeTestimonial = testimonials[activeIndex];

  // Calculate avatar positions in a circle
  const getAvatarPosition = (index: number, total: number) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    const radius = 180;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return { x, y };
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-eco-500/5 via-transparent to-eco-500/5 pointer-events-none" />

      <div className="section-padding relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <p className="text-eco-400 font-medium tracking-wider uppercase text-sm mb-4">
              Testimonials
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-white mb-6">
              What Our <span className="text-gradient">Clients</span> Say
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Dont just take our word for it. Heres what industry leaders say about
              working with BK Environmental.
            </p>
          </div>

          {/* Orbital Testimonials - Desktop */}
          <div className="hidden lg:block relative h-[600px]">
            {/* Center content */}
            <div
              ref={contentRef}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl text-center z-10"
            >
              <div className="bg-[#0f2e15] border border-eco-500/20 rounded-3xl p-8 shadow-xl">
                {/* Quote icon */}
                <div className="w-12 h-12 rounded-full bg-eco-500/20 flex items-center justify-center mx-auto mb-6">
                  <Quote className="w-6 h-6 text-eco-400" />
                </div>

                {/* Quote */}
                <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                  {activeTestimonial.quote}
                </p>

                {/* Rating */}
                <div className="flex items-center justify-center gap-1 mb-4">
                  {[...Array(activeTestimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-eco-400 text-eco-400"
                    />
                  ))}
                </div>

                {/* Author */}
                <div>
                  <div className="font-heading font-bold text-white text-lg">
                    {activeTestimonial.name}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {activeTestimonial.role}
                  </div>
                </div>
              </div>
            </div>

            {/* Orbiting avatars */}
            <div
              ref={orbitRef}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              {/* Orbit ring */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-eco-500/10" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] rounded-full border border-eco-500/5" />

              {/* Avatars */}
              {testimonials.map((testimonial, index) => {
                const pos = getAvatarPosition(index, testimonials.length);
                const isActive = index === activeIndex;

                return (
                  <button
                    key={testimonial.id}
                    onClick={() => setActiveIndex(index)}
                    className={`avatar-item absolute w-16 h-16 rounded-full overflow-hidden border-2 transition-all duration-300 ${
                      isActive
                        ? 'border-eco-400 scale-125 shadow-glow z-20'
                        : 'border-eco-500/30 hover:border-eco-500/50 hover:scale-110'
                    }`}
                    style={{
                      transform: `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)`,
                      left: '50%',
                      top: '50%',
                    }}
                  >
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mobile/Tablet Carousel */}
          <div className="lg:hidden space-y-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-[#0f2e15] border border-eco-500/20 rounded-2xl p-6"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-eco-500/30"
                  />
                  <div>
                    <div className="font-heading font-bold text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {testimonial.role}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-eco-400 text-eco-400"
                    />
                  ))}
                </div>

                <p className="text-gray-300 text-sm leading-relaxed">
                  {testimonial.quote}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
