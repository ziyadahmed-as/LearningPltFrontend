import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { HelpCircle, BookOpen, LogOut, User, Layout, BarChart, GraduationCap, Sun, Moon, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';

export default function Navbar({ onHelpClick }) {
  const { user, logoutUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Courses', path: '/courses' },
    { name: 'Teach', path: '/instructor-onboarding' },
    { name: 'About', path: '#' },
  ];

  const authenticatedLinks = [
     { name: 'Enrollments', path: '/my-enrollments', icon: BookOpen, role: 'STUDENT' },
     { name: 'Dashboard', path: '/my-courses', icon: Layout, role: 'INSTRUCTOR' },
     { name: 'Revenue', path: '/revenue', icon: BarChart, role: 'INSTRUCTOR' },
     { name: 'Admin', path: '/admin', icon: Layout, role: 'ADMIN' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] px-6 py-6 transition-all duration-500 ${isScrolled ? 'py-4' : 'py-8'}`}>
      <div className="max-w-7xl mx-auto">
        <div className={`bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] px-10 py-4 flex items-center justify-between shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] transition-all ${isScrolled ? 'bg-black/40' : ''}`}>
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 group-hover:rotate-12 transition-transform">
              <BookOpen className="w-7 h-7" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white italic">
              FATRA Academy
            </span>
          </Link>

          {/* Desktop Links - Figma Centered Style */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path}
                className={`text-sm font-bold transition-all ${location.pathname === link.path ? 'text-white' : 'text-white/60 hover:text-white'}`}
              >
                {link.name}
              </Link>
            ))}
            
            {user && authenticatedLinks.filter(l => l.role === user.role).map(link => (
              <Link 
                key={link.path} 
                to={link.path}
                className={`text-sm font-bold transition-all ${location.pathname === link.path ? 'text-indigo-400' : 'text-white/60 hover:text-white'}`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Action Buttons - Figma Right Aligned */}
          <div className="flex items-center gap-4">
             <button
              onClick={toggleTheme}
              className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all hidden sm:flex"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {user ? (
               <div className="flex items-center gap-4 border-l border-white/10 pl-6">
                 <Link to="/profile" className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg border border-white/20">
                       <User size={20} />
                    </div>
                 </Link>
                 <button 
                  onClick={logoutUser}
                  className="p-3 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 rounded-2xl transition-all"
                >
                  <LogOut size={20} />
                </button>
               </div>
            ) : (
              <div className="flex items-center gap-4">
                 <Link 
                  to="/login" 
                  className="px-8 py-3 bg-white/10 backdrop-blur-md text-white text-sm font-bold rounded-2xl border border-white/10 hover:bg-white/20 transition-all"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-8 py-3 bg-indigo-600 text-white text-sm font-bold rounded-2xl shadow-xl shadow-indigo-600/30 hover:bg-indigo-500 hover:scale-105 active:scale-95 transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
            
            {/* Mobile Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-3 bg-white/5 rounded-2xl text-white border border-white/10"
            >
               <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
           <motion.div 
             initial={{ opacity: 0, y: -20 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: -20 }}
             className="absolute top-28 left-6 right-6 bg-slate-900 border border-white/10 p-8 rounded-[2.5rem] shadow-2xl z-50 lg:hidden"
           >
              <div className="flex flex-col gap-6">
                 {navLinks.map(link => (
                    <Link key={link.name} to={link.path} onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-white/60 hover:text-white">{link.name}</Link>
                 ))}
                 <div className="h-px bg-white/5 w-full my-2" />
                 {!user && (
                    <div className="grid grid-cols-2 gap-4">
                       <Link to="/login" className="py-4 text-center bg-white/5 rounded-2xl text-white font-bold">Login</Link>
                       <Link to="/register" className="py-4 text-center bg-indigo-600 rounded-2xl text-white font-bold">Sign Up</Link>
                    </div>
                 )}
              </div>
           </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
