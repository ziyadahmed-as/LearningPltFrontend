import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from "motion/react";
import Navbar from "../components/Navbar";
import { GradientButton } from "../components/gradient-button";
import { GlassCard } from "../components/glass-card";
import { CourseCard } from "../components/course-card";
import { useAuth } from '../context/AuthContext';
import { getCourses, getInstructorStats } from '../services/api';
import { 
  BookOpen, Brain, GraduationCap, Code, Briefcase, 
  Star, Users, Award, TrendingUp 
} from "lucide-react";

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [stats, setStats] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    { url: '/hero-slides/slide1.jpg', pos: 'center' },
    { url: '/hero-slides/slide2.jpg', pos: 'top center' },
    { url: '/hero-slides/slide3.png', pos: 'center' }
  ];

  const categories = [
    { icon: BookOpen, title: "Grade 9-10 Prep", color: "from-purple-500 to-pink-500", courses: 45 },
    { icon: GraduationCap, title: "Grade 11-12 Prep", color: "from-blue-500 to-cyan-500", courses: 62 },
    { icon: Brain, title: "University Entrance", color: "from-violet-500 to-purple-500", courses: 38 },
    { icon: Award, title: "Postgraduate (GAT)", color: "from-indigo-500 to-blue-500", courses: 24 },
    { icon: Code, title: "Programming & AI", color: "from-cyan-500 to-teal-500", courses: 56 },
    { icon: Briefcase, title: "Soft Skills", color: "from-pink-500 to-rose-500", courses: 31 },
  ];

  useEffect(() => {
    getCourses().then(res => {
      const all = Array.isArray(res.data) ? res.data : res.data.results || [];
      // Use local fallback if API is empty for better UI demo
      if (all.length === 0) {
        setFeaturedCourses([
          {
            id: "1",
            title: "Complete Mathematics for Grade 11-12 & University Entrance",
            instructor: "Dr. Sarah Johnson",
            thumbnail: "https://images.unsplash.com/photo-1758685734312-5134968399a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXRoZW1hdGljcyUyMGVxdWF0aW9ucyUyMGNoYWxrYm9hcmR8ZW58MXx8fHwxNzc0NjgyNTY1fDA&ixlib=rb-4.1.0&q=80&w=1080",
            rating: 4.9,
            students: 12453,
            duration: "42h",
            price: 89,
            category: "Math"
          },
          {
            id: "2",
            title: "Python Programming: From Basics to AI & Machine Learning",
            instructor: "Prof. Michael Chen",
            thumbnail: "https://images.unsplash.com/photo-1675495277087-10598bf7bcd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9ncmFtbWluZyUyMGNvZGluZyUyMGxhcHRvcHxlbnwxfHx8fDE3NzQ3MTA2NTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
            rating: 4.8,
            students: 18234,
            duration: "56h",
            price: 129,
            category: "Tech"
          },
          {
            id: "3",
            title: "Advanced Physics & Chemistry for University Entrance Exams",
            instructor: "Dr. Emily Rodriguez",
            thumbnail: "https://images.unsplash.com/photo-1605781645799-c9c7d820b4ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2llbmNlJTIwbGFib3JhdG9yeSUwbVk4ZWR1Y2F0aW9ufGVufDF8fHx8MTc3NDY4MjU2NHww&ixlib=rb-4.1.0&q=80&w=1080",
            rating: 4.9,
            students: 9876,
            duration: "38h",
            price: 99,
            category: "Science"
          },
          {
            id: "4",
            title: "GAT Preparation: Analytical & Quantitative Reasoning Mastery",
            instructor: "James Williams",
            thumbnail: "https://images.unsplash.com/photo-1574660430686-b2a255cfce68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwZW50cmFuY2UlMjBleGFtJTIwcHJlcGFyYXRpb258ZW58MXx8fHwxNzc0NzE0NzAyfDA&ixlib=rb-4.1.0&q=80&w=1080",
            rating: 4.7,
            students: 7543,
            duration: "32h",
            price: 79,
            category: "GAT"
          }
        ]);
      } else {
        setFeaturedCourses(all.slice(0, 4));
      }
    }).catch(() => {});

    getInstructorStats().then(res => setStats(res.data)).catch(() => {});

    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const platformStats = [
    { icon: Users, value: "50,000+", label: "Active Students" },
    { icon: BookOpen, value: `${stats?.total_courses || '250'}+`, label: "Expert Courses" },
    { icon: Award, value: "95%", label: "Success Rate" },
    { icon: TrendingUp, value: "4.8/5", label: "Average Rating" }
  ];

  return (
    <div className="min-h-screen">

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
        {/* Animated Background Slideshow */}
        <div className="hero-slideshow absolute inset-0 z-0">
          {heroSlides.map((slide, idx) => (
            <div 
              key={idx}
              className={`hero-slide ${idx === currentSlide ? 'active' : ''} absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${idx === currentSlide ? 'opacity-100' : 'opacity-0'}`}
              style={{ 
                backgroundImage: `url(${slide.url})`,
                backgroundPosition: slide.pos,
                backgroundSize: 'cover'
              }}
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 via-purple-900/80 to-blue-900/90 z-[1]" />
        
        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl z-[2]"
          animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl z-[2]"
          animate={{ y: [0, -40, 0], x: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Master Entrance Exams &<br />
                <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                  Future Tech Skills
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
                Discover the premier digital learning platform for Ethiopian students. <br/> Prepare smarter, build your future, and master your goals.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-wrap gap-4 justify-center"
            >
              <GradientButton onClick={() => navigate("/register")}>
                Get Started Free
              </GradientButton>
              <GradientButton variant="outline" className="text-white border-white/40 hover:bg-white/10" onClick={() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' })}>
                Browse Courses
              </GradientButton>
            </motion.div>

            {/* Floating Preview Cards */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16 max-w-4xl mx-auto"
            >
              {featuredCourses.slice(0, 2).map((course, idx) => (
                <GlassCard
                  key={course.id || idx}
                  className="p-4 text-left border-white/10 cursor-pointer hover:scale-[1.02] transition-transform"
                  onClick={() => course.id && navigate(`/courses/${course.id}`)}
                >
                  <div className="flex gap-4">
                    {course.thumbnail ? (
                      <img src={course.thumbnail} alt={course.title} className="w-24 h-24 rounded-xl object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-24 h-24 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-8 h-8 text-white/60" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="text-white font-semibold line-clamp-2 mb-2">{course.title}</h4>
                      <p className="text-white/80 text-xs">{course.instructor_name || course.instructor}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Users className="w-3.5 h-3.5 text-yellow-300" />
                        <span className="text-white/70 text-xs">
                          {(course.enrollment_count || course.students || 0).toLocaleString()} students
                        </span>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {platformStats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <GlassCard className="p-6 text-center border-slate-200">
                  <stat.icon className="w-8 h-8 mx-auto mb-3 text-indigo-600" />
                  <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 text-sm font-medium">{stat.label}</div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Explore Learning Paths
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose from our comprehensive range of courses designed for every stage of your educational journey.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {categories.map((category, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <GlassCard className="p-8 text-center cursor-pointer border-slate-100 group">
                  <div className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-r ${category.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform`}>
                    <category.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{category.title}</h3>
                  <p className="text-gray-600 text-sm">{category.courses} specialized courses</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section id="courses" className="py-24 relative bg-slate-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Top Rated Programs
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Verified high-quality content based on student feedback and national exam results.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {featuredCourses.map((course, idx) => (
              <motion.div
                key={course.id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="cursor-pointer"
                onClick={() => course.id && navigate(`/courses/${course.id}`)}
              >
                <CourseCard {...course} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Instructor CTA Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <GlassCard className="max-w-5xl mx-auto p-12 overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-700">
            <div className="relative z-10 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl font-bold text-white mb-4">
                  Become an Instructor
                </h2>
                <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                  Share your knowledge and inspire thousands of students across Ethiopia. Join our community of expert educators.
                </p>
                <button 
                  onClick={() => navigate("/register")}
                  className="px-8 py-4 bg-white text-indigo-600 rounded-2xl font-bold text-lg shadow-xl hover:bg-indigo-50 transition-all active:scale-95"
                >
                  Start Teaching Today
                </button>
              </motion.div>
            </div>
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-20 -mb-20 blur-3xl" />
          </GlassCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-slate-900 border-t border-slate-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">
                  EduTech
                </span>
              </div>
              <p className="text-slate-400">
                The premier digital learning platform dedicated to transforming Ethiopian education through innovation and accessibility.
              </p>
              <div className="flex gap-4">
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Learning Path</h4>
              <ul className="space-y-4 text-slate-400">
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Grade 9-10 Prep</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Grade 11-12 Prep</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Entrance Exams</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Programming & AI</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Institution</h4>
              <ul className="space-y-4 text-slate-400">
                <li><a href="#" className="hover:text-indigo-400 transition-colors">About Our Mission</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Instructor Registry</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Blog & Updates</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Contact Support</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Support</h4>
              <ul className="space-y-4 text-slate-400">
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">FAQ</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 text-center text-slate-500 text-sm">
            <p>&copy; 2026 EduTech Ethiopia. Powered by Excellence.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
