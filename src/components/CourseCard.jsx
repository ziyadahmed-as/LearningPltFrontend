import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, BookOpen, Users, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function CourseCard({ course }) {
  // Course data normalized for Figma layout
  const thumbnail = course.thumbnail || `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop`;
  const rating = course.rating || '4.9';
  const students = course.students_count || Math.floor(Math.random() * 5000) + 1200;
  const duration = "12h 30m";
  const modules = course.modules?.length || course.chapters?.length || 8;

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="group bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] transition-all flex flex-col h-full"
    >
      <Link to={`/courses/${course.id}`} className="relative h-64 w-full overflow-hidden block">
         {/* Thumbnail Overlay */}
         <div className="absolute inset-0 bg-indigo-900/10 group-hover:bg-indigo-900/0 transition-all z-10" />
         
         {/* Badges */}
         <div className="absolute top-6 left-6 z-20 flex gap-2">
            <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-600 shadow-sm border border-indigo-100">
               {course.category_name || 'Protocol'}
            </span>
            <span className={`px-4 py-1.5 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border ${
              course.course_type === 'LIVE_TUTORIAL' ? 'bg-rose-500/90 text-white border-rose-400' :
              course.course_type === 'HARD_SKILL_RECORDED' ? 'bg-slate-900/90 text-white border-slate-700' :
              'bg-amber-500/90 text-white border-amber-400'
            }`}>
               {course.course_type === 'LIVE_TUTORIAL' ? 'LIVE HUB' :
                course.course_type === 'HARD_SKILL_RECORDED' ? 'HARD SKILL' :
                'SOFT SKILL'}
            </span>
         </div>

         <img 
            src={thumbnail} 
            alt={course.title} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
         />
      </Link>

      <div className="p-10 flex flex-col flex-1 justify-between gap-8">
         <div className="space-y-4">
            <div className="flex items-center gap-3">
               <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-full border border-amber-100">
                  <Star size={14} className="text-amber-500 fill-amber-500" />
                  <span className="text-xs font-black text-amber-600">{rating}</span>
               </div>
               <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
                  <Users size={14} className="text-slate-400" />
                  <span className="text-xs font-black text-slate-500">{students} Scholars</span>
               </div>
            </div>

            <h3 className="text-2xl font-black text-slate-900 tracking-tighter leading-tight italic uppercase group-hover:text-indigo-600 transition-colors">
               {course.title}
            </h3>
            
            <p className="text-sm font-medium text-slate-500 leading-relaxed line-clamp-2">
               {course.description || "Initialize mastery over this core cognitive module with elite academic protocols."}
            </p>
         </div>

         <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
               <span className="flex items-center gap-2"><Clock size={14} /> {duration}</span>
               <span className="flex items-center gap-2"><BookOpen size={14} /> {modules} Units</span>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-xl font-black italic tracking-tighter text-slate-900">
                {parseFloat(course.price) === 0 ? 'FREE' : `$${course.price}`}
              </span>
              <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                 <ArrowRight size={20} />
              </div>
            </div>
         </div>
      </div>
    </motion.div>
  );
}
