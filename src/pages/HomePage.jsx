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
    <div className="min-h-screen bg-[#020617] text-white selection:bg-indigo-500/30 selection:text-indigo-200">

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Animated Background Slideshow */}
        <div className="hero-slideshow absolute inset-0 z-0 scale-110">
          {heroSlides.map((slide, idx) => (
            <div 
              key={idx}
              className={`hero-slide ${idx === currentSlide ? 'active' : ''} absolute inset-0 transition-all duration-[3000ms] ease-in-out ${idx === currentSlide ? 'opacity-40 scale-100' : 'opacity-0 scale-105'}`}
              style={{ 
                backgroundImage: `url(${slide.url})`,
                backgroundPosition: slide.pos,
                backgroundSize: 'cover'
              }}
            />
          ))}
        </div>
        
        {/* Modern Mesh Gradient Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,0)_0%,#020617_100%)] z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950/90 via-slate-950/80 to-purple-950/90 z-[1]" />
        
        {/* Animated Background Blobs */}
        <motion.div
          className="absolute top-1/4 -left-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] z-[2]"
          animate={{ x: [0, 50, 0], y: [0, 100, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px] z-[2]"
          animate={{ x: [0, -70, 0], y: [0, -50, 0], scale: [1, 1.3, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 shadow-xl">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                <span className="text-xs font-bold tracking-widest uppercase text-indigo-300">Ethiopia's #1 Learning Platform</span>
              </div>

              <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[1.05] tracking-tight">
                Master Your Future<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 drop-shadow-sm">
                  With Every Click
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
                Discover the premier digital learning destination. Prepare smarter for entrance exams and master high-demand tech skills from industry experts.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap gap-6 justify-center"
            >
              <button 
                onClick={() => navigate("/register")}
                className="group relative px-10 py-5 bg-white text-indigo-950 font-black rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10 flex items-center gap-2">
                  Get Started Free <TrendingUp className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              
              <button 
                onClick={() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' })}
                className="group px-10 py-5 bg-white/5 backdrop-blur-xl border border-white/10 text-white font-black rounded-2xl transition-all hover:bg-white/10 hover:border-white/20 active:scale-95 shadow-2xl"
              >
                <span className="flex items-center gap-2">
                  Browse Courses <BookOpen className="w-5 h-5 opacity-70 group-hover:rotate-12 transition-transform" />
                </span>
              </button>
            </motion.div>

            {/* Premium Preview Section */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-24 w-full max-w-4xl"
            >
              {featuredCourses.slice(0, 2).map((course, idx) => (
                <div
                  key={course.id || idx}
                  className="group relative h-40 rounded-3xl overflow-hidden cursor-pointer shadow-2xl transition-all hover:-translate-y-2"
                  onClick={() => course.id && navigate(`/courses/${course.id}`)}
                >
                  <img src={course.thumbnail} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-6 flex flex-col justify-end border border-white/5 rounded-3xl">
                    <div className="flex justify-between items-end">
                      <div>
                        <span className="px-2 py-0.5 rounded-md bg-indigo-500/80 text-[10px] font-bold uppercase tracking-wider mb-2 inline-block shadow-lg">{course.category}</span>
                        <h4 className="text-lg font-bold text-white line-clamp-1 group-hover:text-indigo-300 transition-colors">{course.title}</h4>
                        <p className="text-white/60 text-xs">{course.instructor_name || course.instructor}</p>
                      </div>
                      <div className="h-10 w-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center group-hover:bg-indigo-500 transition-colors">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Modern Stats Section */}
      <section className="py-24 relative z-10 -mt-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {platformStats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative p-8 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-2xl hover:border-white/20 transition-all flex flex-col items-center shadow-2xl">
                  <div className="p-4 rounded-2xl bg-indigo-500/10 mb-6 group-hover:bg-indigo-500 transition-all group-hover:scale-110">
                    <stat.icon className="w-8 h-8 text-indigo-400 group-hover:text-white" />
                  </div>
                  <div className="text-5xl font-black text-white mb-2 tabular-nums tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-slate-400 text-sm font-bold uppercase tracking-widest">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Re-designed Categories Section */}
      <section id="categories" className="py-32 relative bg-[#020617]">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <span className="text-indigo-400 font-black uppercase tracking-[0.3em] text-xs mb-4 inline-block">Curated Learning</span>
              <h2 className="text-4xl md:text-6xl font-black text-white">
                Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Paths</span>
              </h2>
            </div>
            <p className="text-slate-400 max-w-md text-lg font-light leading-relaxed">
              Navigate your success through precision-engineered curriculums tailored for the modern Ethiopian landscape.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className="group relative p-1 rounded-3xl bg-gradient-to-b from-white/10 to-transparent hover:from-indigo-500/40 transition-all duration-500"
              >
                <div className="relative h-full p-10 rounded-[calc(1.5rem-1px)] bg-slate-950 border border-white/5 overflow-hidden">
                  {/* Decorative background circle */}
                  <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-r ${category.color} opacity-10 blur-3xl group-hover:opacity-30 transition-opacity`} />
                  
                  <div className={`w-14 h-14 mb-8 bg-gradient-to-r ${category.color} rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all`}>
                    <category.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-3 group-hover:text-indigo-400 transition-colors">{category.title}</h3>
                  <p className="text-slate-400 group-hover:text-slate-300 transition-colors mb-6">{category.courses} specialized courses available now</p>
                  <div className="flex items-center gap-2 text-xs font-black text-indigo-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                    Explore Path <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* High-Impact Programs Grid */}
      <section id="courses" className="py-32 relative bg-slate-950/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8">
              Expert <span className="text-indigo-500 underline decoration-indigo-500/30 underline-offset-12">Faculty</span>
            </h2>
            <div className="flex justify-center gap-4 flex-wrap">
              {['All', 'Math', 'Tech', 'Science', 'English', 'GAT'].map(tag => (
                <button key={tag} className="px-6 py-2 rounded-full border border-white/10 hover:bg-white/5 transition-colors text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white">
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {featuredCourses.map((course, idx) => (
              <motion.div
                key={course.id || idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div 
                  className="relative rounded-3xl bg-slate-900/40 border border-white/5 overflow-hidden cursor-pointer hover:border-indigo-500/50 transition-all hover:shadow-[0_20px_60px_-15px_rgba(99,102,241,0.3)]"
                  onClick={() => course.id && navigate(`/courses/${course.id}`)}
                >
                  <div className="aspect-[4/5] overflow-hidden relative">
                    <img src={course.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                      <span className="text-xs font-bold">{course.rating}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-2">{course.category}</div>
                    <h4 className="text-lg font-bold text-white mb-2 line-clamp-2 leading-snug group-hover:text-indigo-300 transition-colors">{course.title}</h4>
                    <p className="text-slate-400 text-sm mb-6 font-medium italic">{course.instructor}</p>
                    <div className="flex justify-between items-center pt-6 border-t border-white/5">
                      <span className="text-2xl font-black text-white">${course.price}</span>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Enrollment</span>
                        <span className="text-xs font-black text-indigo-400">{(course.students).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Futuristic Instructor CTA */}
      <section className="py-40 relative">
        <div className="container mx-auto px-6">
          <div className="relative max-w-6xl mx-auto rounded-[3rem] overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 to-purple-800 opacity-90" />
            <img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxsZWN0dXJlJTIwaGFsbHxlbnwxfHx8fDE3NzQ3MTQ4MDB8MA&ixlib=rb-4.1.0&q=80&w=1080" alt="" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay scale-110 group-hover:scale-100 transition-transform duration-[3000ms]" />
            
            <div className="relative z-10 py-32 px-12 text-center md:text-left md:flex items-center justify-between gap-12">
              <div className="max-w-2xl">
                <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight">
                  Evolve Into An<br />
                  <span className="text-indigo-200">Instructor Icon</span>
                </h2>
                <p className="text-xl text-white/80 mb-12 font-light leading-relaxed">
                  Join a high-performance ecosystem of educators. Leverage AI-powered tools to create world-class content and impact generations.
                </p>
                <div className="flex flex-wrap gap-4">
                   <button 
                    onClick={() => navigate("/instructor-onboarding")}
                    className="px-10 py-5 bg-white text-indigo-900 rounded-3xl font-black text-lg shadow-2xl hover:bg-slate-100 transition-all hover:scale-105"
                  >
                    Apply to Teach
                  </button>
                  <button className="px-10 py-5 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-3xl font-black text-lg hover:bg-white/20 transition-all">
                    How it Works
                  </button>
                </div>
              </div>
              
              <div className="hidden lg:grid grid-cols-2 gap-4 flex-shrink-0">
                {[1,2,3,4].map(i => (
                  <div key={i} className={`p-4 rounded-3xl bg-white/10 backdrop-blur-md border border-white/10 w-32 h-32 flex flex-col items-center justify-center ${i % 2 === 0 ? 'mt-8' : ''}`}>
                    <Users className="w-8 h-8 text-white mb-2" />
                    <span className="text-white font-black">9{i}%</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-32 -mt-32 blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400/20 rounded-full -ml-32 -mb-32 blur-[100px]" />
          </div>
        </div>
      </section>

      {/* Elegant Footer */}
      <footer className="py-24 bg-[#01040f] border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-20 text-center md:text-left">
            <div className="space-y-8">
              <div onClick={() => navigate("/")} className="cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-[0_0_20px_rgba(99,102,241,0.5)]">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-3xl font-black tracking-tighter text-white">FATRA</span>
                </div>
              </div>
              <p className="text-slate-500 leading-relaxed font-medium">
                The apex of Ethiopian digital education. Empowering minds, bridging gaps, and building futures through world-class interactive learning.
              </p>
              <div className="flex justify-center md:justify-start gap-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-indigo-500 hover:border-indigo-500 transition-all cursor-pointer group">
                    <div className="w-4 h-4 bg-slate-400 group-hover:bg-white rounded-sm" />
                  </div>
                ))}
              </div>
            </div>

            {['Learning Path', 'Institution', 'Support'].map((title, idx) => (
              <div key={idx}>
                <h4 className="text-white font-black uppercase tracking-[0.2em] text-xs mb-8">{title}</h4>
                <ul className="space-y-4">
                  {(idx === 0 ? ['Grade 9-10 Prep', 'Grade 11-12 Prep', 'Entrance Exams', 'Programming & AI'] : 
                    idx === 1 ? ['About Our Mission', 'Scholarship Fund', 'Corporate Solutions', 'Contact Registry'] :
                    ['Resolution Center', 'Safety & Privacy', 'Creator Terms', 'Help & FAQ']).map(link => (
                    <li key={link}><a href="#" className="text-slate-500 hover:text-indigo-400 transition-colors font-medium text-sm">{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-8 text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">
            <p>&copy; 2026 FATRA ACADEMY ETHIOPIA. ALL RIGHTS RESERVED.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );

}
