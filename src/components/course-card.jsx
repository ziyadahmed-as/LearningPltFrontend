import React from "react";
import { Star, Users, Clock, BookOpen } from "lucide-react";

export function CourseCard({
  title, instructor, instructor_name, thumbnail,
  rating, students, enrollment_count, duration, category,
  price, chapters,
}) {
  const displayInstructor = instructor_name || instructor || "Expert";
  const displayStudents = enrollment_count || students || 0;
  const displayRating = rating || "—";
  const displayDuration = duration || `${chapters?.length || 0} ch`;

  return (
    <div className="group bg-white/40 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-600">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-white/50" />
          </div>
        )}
        {category && (
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-indigo-600 shadow-sm">
              {category}
            </span>
          </div>
        )}
        {price !== undefined && parseFloat(price) === 0 && (
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 bg-green-500 text-white rounded-full text-xs font-bold shadow">
              FREE
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem] group-hover:text-indigo-600 transition-colors">
          {title}
        </h3>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
            {displayInstructor.split(' ').map(n => n?.[0] || '').join('').slice(0, 2)}
          </div>
          <span className="text-sm font-medium text-gray-600">{displayInstructor}</span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-gray-500">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-bold text-gray-900">{displayRating}</span>
            <span className="text-[10px]">Rating</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500">
            <Users className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-bold text-gray-900">
              {typeof displayStudents === 'number' ? displayStudents.toLocaleString() : displayStudents}
            </span>
            <span className="text-[10px]">Students</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500">
            <Clock className="w-4 h-4 text-purple-500" />
            <span className="text-xs font-bold text-gray-900">{displayDuration}</span>
            <span className="text-[10px]">Length</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500">
            <BookOpen className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold text-gray-900">Full Access</span>
          </div>
        </div>

        <button className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-100 hover:shadow-indigo-200 transition-all active:scale-95">
          View Details
        </button>
      </div>
    </div>
  );
}
