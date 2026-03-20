import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronLeft, ChevronRight, MapPin, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    id: 1,
    title: 'Dodoma Industrial Park EIA',
    location: 'Dodoma, Tanzania',
    date: '2024',
    category: 'Environmental Impact Assessment',
    description:
      'Comprehensive EIA study for a new industrial park development, ensuring full NEMC compliance and sustainable design recommendations.',
    image: '/images/project-industrial.jpg',
    outcomes: [
      'EIA Certificate obtained within 90 days',
      '15 mitigation measures implemented',
      'Zero environmental incidents during construction',
    ],
  },
  {
    id: 2,
    title: 'City Center Air Quality Monitoring',
    location: 'Dodoma CBD',
    date: '2023-2024',
    category: 'Air Quality Monitoring',
    description:
      'Installation and operation of a city-wide air quality monitoring network to track pollution levels and inform policy decisions.',
    image: '/images/project-air-quality.jpg',
    outcomes: [
      '12 monitoring stations deployed',
      'Real-time data dashboard implemented',
      '30% reduction in PM2.5 levels tracked',
    ],
  },
  {
    id: 3,
    title: 'Lake Victoria Environmental Audit',
    location: 'Mwanza Region',
    date: '2023',
    category: 'Environmental Audit',
    description:
      'Comprehensive environmental audit of industrial facilities around Lake Victoria to assess compliance and water quality impact.',
    image: '/images/project-lake.jpg',
    outcomes: [
      '45 facilities audited',
      'Water quality baseline established',
      'Remediation plan developed',
    ],
  },
];

export default function Projects() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        carouselRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
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

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % projects.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const getSlideStyle = (index: number) => {
    const diff = index - activeIndex;
    const normalizedDiff = ((diff + projects.length) % projects.length);
    const adjustedDiff = normalizedDiff > projects.length / 2 ? normalizedDiff - projects.length : normalizedDiff;

    if (adjustedDiff === 0) {
      return {
        transform: 'translateX(0) scale(1) rotateY(0deg)',
        zIndex: 10,
        opacity: 1,
        filter: 'blur(0px)',
      };
    } else if (Math.abs(adjustedDiff) === 1) {
      return {
        transform: `translateX(${adjustedDiff * 60}%) scale(0.8) rotateY(${-adjustedDiff * 25}deg)`,
        zIndex: 5,
        opacity: 0.5,
        filter: 'blur(2px)',
      };
    } else {
      return {
        transform: `translateX(${adjustedDiff * 80}%) scale(0.6) rotateY(${-adjustedDiff * 45}deg)`,
        zIndex: 1,
        opacity: 0,
        filter: 'blur(4px)',
      };
    }
  };

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-eco-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="section-padding relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <p className="text-eco-400 font-medium tracking-wider uppercase text-sm mb-4">
              Our Projects
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-white mb-6">
              Recent{' '}
              <span className="text-gradient">Environmental</span> Projects
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Explore our portfolio of successful environmental projects across Tanzania,
              demonstrating our commitment to sustainable development.
            </p>
          </div>

          {/* 3D Carousel */}
          <div
            ref={carouselRef}
            className="relative h-[500px] lg:h-[600px] perspective-1000"
          >
            <div className="relative w-full h-full flex items-center justify-center">
              {projects.map((project, index) => (
                <div
                  key={project.id}
                  className="absolute w-full max-w-3xl transition-all duration-700 ease-out"
                  style={{
                    ...getSlideStyle(index),
                    transformStyle: 'preserve-3d',
                    perspective: '1000px',
                  }}
                >
                  <div className="bg-[#0f2e15] rounded-3xl overflow-hidden border border-eco-500/20 shadow-2xl">
                    {/* Image */}
                    <div className="relative h-64 lg:h-80 overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0f2e15] via-transparent to-transparent" />

                      {/* Category badge */}
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-eco-500/90 text-white text-xs font-medium rounded-full">
                          {project.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 lg:p-8">
                      <h3 className="text-xl lg:text-2xl font-heading font-bold text-white mb-3">
                        {project.title}
                      </h3>

                      <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-eco-400" />
                          {project.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-eco-400" />
                          {project.date}
                        </div>
                      </div>

                      <p className="text-gray-300 mb-6 line-clamp-2">
                        {project.description}
                      </p>

                      {/* Outcomes */}
                      <div className="space-y-2 mb-6">
                        {project.outcomes.map((outcome, oIndex) => (
                          <div
                            key={oIndex}
                            className="flex items-center gap-2 text-sm text-gray-400"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-eco-400" />
                            {outcome}
                          </div>
                        ))}
                      </div>

                      {/* CTA */}
                      <Button
                        variant="outline"
                        className="btn-outline group flex items-center gap-2"
                      >
                        View Project Details
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-[#0f2e15] border border-eco-500/30 flex items-center justify-center text-white hover:bg-eco-500/20 hover:border-eco-500/50 transition-all duration-300"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-[#0f2e15] border border-eco-500/30 flex items-center justify-center text-white hover:bg-eco-500/20 hover:border-eco-500/50 transition-all duration-300"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Dots indicator */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-2">
              {projects.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === activeIndex
                      ? 'w-8 bg-eco-400'
                      : 'bg-eco-500/30 hover:bg-eco-500/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
