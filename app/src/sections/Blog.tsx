import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, ArrowRight, User } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const blogPosts = [
  {
    id: 1,
    title: 'Understanding NEMC Certification Requirements in Tanzania',
    excerpt:
      'A comprehensive guide to obtaining NEMC certification for your environmental projects, including step-by-step procedures and documentation requirements.',
    image: '/images/blog-eia.jpg',
    category: 'Regulations',
    author: 'BK Environmental Team',
    date: 'March 10, 2024',
    featured: true,
  },
  {
    id: 2,
    title: 'The Importance of Regular Environmental Audits',
    excerpt:
      'Learn why regular environmental audits are crucial for maintaining compliance and identifying potential issues before they become problems.',
    image: '/images/blog-audit.jpg',
    category: 'Best Practices',
    author: 'Dr. Sarah Kimaro',
    date: 'March 5, 2024',
    featured: false,
  },
  {
    id: 3,
    title: 'Air Quality Monitoring: Technologies and Trends',
    excerpt:
      'Explore the latest technologies in air quality monitoring and how they help businesses maintain environmental standards.',
    image: '/images/service-air-quality.jpg',
    category: 'Technology',
    author: 'James Mwinyi',
    date: 'February 28, 2024',
    featured: false,
  },
  {
    id: 4,
    title: 'Sustainable Development in Tanzania: A Path Forward',
    excerpt:
      'An analysis of sustainable development practices and how businesses can contribute to environmental protection while growing.',
    image: '/images/blog-sustainable.jpg',
    category: 'Sustainability',
    author: 'Grace Mushi',
    date: 'February 20, 2024',
    featured: false,
  },
];

export default function Blog() {
  const sectionRef = useRef<HTMLElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Featured post animation
      gsap.fromTo(
        featuredRef.current,
        { clipPath: 'inset(100% 0 0 0)', opacity: 0 },
        {
          clipPath: 'inset(0% 0 0 0)',
          opacity: 1,
          duration: 1,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Grid items animation
      gsap.fromTo(
        gridRef.current?.children || [],
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.2,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const featuredPost = blogPosts.find((post) => post.featured);
  const regularPosts = blogPosts.filter((post) => !post.featured);

  return (
    <section
      ref={sectionRef}
      id="blog"
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      <div className="section-padding relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12">
            <div>
              <p className="text-eco-400 font-medium tracking-wider uppercase text-sm mb-4">
                Latest Insights
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-white">
                Environmental{' '}
                <span className="text-gradient">News & Updates</span>
              </h2>
            </div>
            <a
              href="#"
              className="mt-4 lg:mt-0 inline-flex items-center gap-2 text-eco-400 hover:text-eco-300 transition-colors group"
            >
              <span className="font-medium">View All Articles</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Blog Grid */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Featured Post */}
            {featuredPost && (
              <div
                ref={featuredRef}
                className="lg:row-span-2 group cursor-pointer"
              >
                <div className="relative h-full min-h-[400px] lg:min-h-full rounded-3xl overflow-hidden">
                  {/* Image */}
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a1f12] via-[#0a1f12]/50 to-transparent" />

                  {/* Content */}
                  <div className="absolute inset-x-0 bottom-0 p-6 lg:p-8">
                    {/* Category */}
                    <span className="inline-block px-3 py-1 bg-eco-500/90 text-white text-xs font-medium rounded-full mb-4">
                      {featuredPost.category}
                    </span>

                    {/* Title */}
                    <h3 className="text-xl lg:text-2xl font-heading font-bold text-white mb-3 group-hover:text-eco-400 transition-colors">
                      {featuredPost.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-gray-300 mb-4 line-clamp-2">
                      {featuredPost.excerpt}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {featuredPost.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {featuredPost.date}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Regular Posts Grid */}
            <div ref={gridRef} className="space-y-6">
              {regularPosts.map((post) => (
                <div
                  key={post.id}
                  className="group bg-[#0f2e15] border border-eco-500/20 rounded-2xl overflow-hidden hover:border-eco-500/40 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Image */}
                    <div className="sm:w-2/5 h-48 sm:h-auto overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>

                    {/* Content */}
                    <div className="sm:w-3/5 p-5">
                      {/* Category */}
                      <span className="inline-block px-2 py-0.5 bg-eco-500/20 text-eco-400 text-xs font-medium rounded-full mb-3">
                        {post.category}
                      </span>

                      {/* Title */}
                      <h3 className="font-heading font-bold text-white mb-2 group-hover:text-eco-400 transition-colors line-clamp-2">
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                        {post.excerpt}
                      </p>

                      {/* Meta */}
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {post.date}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
