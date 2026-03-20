import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLParagraphElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading animation - word by word reveal
      if (headingRef.current) {
        const words = headingRef.current.querySelectorAll('.word');
        gsap.fromTo(
          words,
          { y: 100, opacity: 0, rotateX: 90 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 1.2,
            stagger: 0.08,
            ease: 'power4.out',
            delay: 0.3,
          }
        );
      }

      // Subheading animation
      gsap.fromTo(
        subheadingRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power4.out', delay: 0.2 }
      );

      // Description animation
      gsap.fromTo(
        descRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power4.out', delay: 0.8 }
      );

      // CTA buttons animation
      gsap.fromTo(
        ctaRef.current,
        { y: 20, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)', delay: 1 }
      );

      // Parallax effect on scroll
      gsap.to(imageRef.current, {
        y: 200,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Text parallax (faster)
      gsap.to('.hero-content', {
        y: -100,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Fade out on scroll
      gsap.to(sectionRef.current, {
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: '80%',
          end: '100%',
          scrub: true,
        },
      });
    }, sectionRef);

    // Particle animation
    const canvas = particlesRef.current;
    if (canvas) {
      const ctx2d = canvas.getContext('2d');
      if (ctx2d) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles: Array<{
          x: number;
          y: number;
          size: number;
          speedX: number;
          speedY: number;
          opacity: number;
        }> = [];

        for (let i = 0; i < 50; i++) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 3 + 1,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            opacity: Math.random() * 0.5 + 0.1,
          });
        }

        let animationId: number;
        const animate = () => {
          ctx2d.clearRect(0, 0, canvas.width, canvas.height);

          particles.forEach((particle) => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            if (particle.x < 0) particle.x = canvas.width;
            if (particle.x > canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = canvas.height;
            if (particle.y > canvas.height) particle.y = 0;

            ctx2d.beginPath();
            ctx2d.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx2d.fillStyle = `rgba(74, 222, 128, ${particle.opacity})`;
            ctx2d.fill();
          });

          animationId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
          cancelAnimationFrame(animationId);
        };
      }
    }

    return () => ctx.revert();
  }, []);

  const scrollToServices = () => {
    const element = document.querySelector('#services');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const headingWords = 'Sustainable Solutions for a Greener Tomorrow'.split(' ');

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background Image */}
      <div
        ref={imageRef}
        className="absolute inset-0 scale-110"
        style={{
          backgroundImage: 'url(/images/hero-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1f12] via-[#0a1f12]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1f12] via-transparent to-transparent" />
      </div>

      {/* Particle Canvas */}
      <canvas
        ref={particlesRef}
        className="absolute inset-0 pointer-events-none z-10"
      />

      {/* Content */}
      <div className="hero-content relative z-20 w-full section-padding pt-32 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl">
            {/* Subheading */}
            <p
              ref={subheadingRef}
              className="text-eco-400 font-medium tracking-wider uppercase text-sm mb-4 opacity-0"
            >
              Environmental Excellence
            </p>

            {/* Main Heading */}
            <h1
              ref={headingRef}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold text-white leading-tight mb-6"
              style={{ perspective: '1000px' }}
            >
              {headingWords.map((word, index) => (
                <span
                  key={index}
                  className="word inline-block mr-[0.25em] opacity-0"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {word === 'Greener' ? (
                    <span className="text-eco-400">{word}</span>
                  ) : (
                    word
                  )}
                </span>
              ))}
            </h1>

            {/* Description */}
            <p
              ref={descRef}
              className="text-lg sm:text-xl text-gray-300 mb-8 max-w-xl opacity-0"
            >
              BK Environmental Consultancy Services provides comprehensive environmental
              solutions in Tanzania, ensuring compliance with NEMC regulations and
              international standards.
            </p>

            {/* CTA Buttons */}
            <div ref={ctaRef} className="flex flex-wrap gap-4 opacity-0">
              <Button
                onClick={scrollToServices}
                className="btn-primary group flex items-center gap-2"
              >
                Explore Our Services
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                className="btn-outline flex items-center gap-2"
                onClick={() => {
                  const element = document.querySelector('#about');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                <Play className="w-4 h-4" />
                Learn More
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8">
              {[
                { value: '500+', label: 'Projects Completed' },
                { value: '50+', label: 'Expert Consultants' },
                { value: '98%', label: 'Client Satisfaction' },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="opacity-0 animate-in"
                  style={{ animationDelay: `${1.2 + index * 0.1}s`, animationFillMode: 'forwards' }}
                >
                  <div className="text-2xl sm:text-3xl font-heading font-bold text-eco-400">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a1f12] to-transparent z-20" />
    </section>
  );
}
