import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCourses, getCategories } from '../services/api';
import { Search, Filter, BookOpen, Users, Star, Clock } from 'lucide-react';

function CourseCard({ course }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/courses/${course.id}`)}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden group"
    >
      {/* Thumbnail */}
      <div className="relative h-44 bg-gradient-to-br from-purple-600 to-blue-600 overflow-hidden">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-white/60" />
          </div>
        )}
        {parseFloat(course.price) === 0 ? (
          <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            FREE
          </span>
        ) : (
          <span className="absolute top-3 right-3 bg-white text-purple-700 text-sm font-bold px-2 py-1 rounded-full shadow">
            ${course.price}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-5">
        <h3 className="font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-purple-700 transition-colors">
          {course.title}
        </h3>
        <p className="text-sm text-gray-500 mb-3">by {course.instructor_name}</p>

        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
          {course.description}
        </p>

        <div className="flex items-center gap-3 text-xs text-gray-500 pt-3 border-t border-gray-100">
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {course.enrollment_count || 0}
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            {course.chapters?.length || 0} chapters
          </span>
        </div>
      </div>
    </div>
  );
}

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [priceFilter, setPriceFilter] = useState('all'); // 'all' | 'free' | 'paid'

  useEffect(() => {
    Promise.all([getCourses(), getCategories()])
      .then(([coursesRes, catsRes]) => {
        const all = Array.isArray(coursesRes.data)
          ? coursesRes.data
          : coursesRes.data.results || [];
        setCourses(all);

        const cats = Array.isArray(catsRes.data)
          ? catsRes.data
          : catsRes.data.results || [];
        setCategories(cats);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = [...courses];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.title?.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q) ||
          c.instructor_name?.toLowerCase().includes(q)
      );
    }

    // Category
    if (selectedCategory !== 'all') {
      list = list.filter((c) => String(c.category) === selectedCategory);
    }

    // Price
    if (priceFilter === 'free') {
      list = list.filter((c) => parseFloat(c.price) === 0);
    } else if (priceFilter === 'paid') {
      list = list.filter((c) => parseFloat(c.price) > 0);
    }

    // Sort
    if (sortBy === 'newest') {
      list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortBy === 'popular') {
      list.sort((a, b) => (b.enrollment_count || 0) - (a.enrollment_count || 0));
    } else if (sortBy === 'price_asc') {
      list.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sortBy === 'price_desc') {
      list.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    }

    return list;
  }, [courses, search, selectedCategory, priceFilter, sortBy]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading courses…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Courses</h1>
        <p className="text-gray-600">
          {courses.length} courses available — discover your next skill
        </p>
      </div>

      {/* Search + Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-8 flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses, instructors…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
        </div>

        {/* Category */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={String(cat.id)}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Price filter */}
        <select
          value={priceFilter}
          onChange={(e) => setPriceFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white"
        >
          <option value="all">All Prices</option>
          <option value="free">Free Only</option>
          <option value="paid">Paid Only</option>
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white"
        >
          <option value="newest">Newest First</option>
          <option value="popular">Most Popular</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>

        <span className="text-sm text-gray-400 whitespace-nowrap">
          {filtered.length} result{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Course Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No courses found</h3>
          <p className="text-gray-500">
            {search || selectedCategory !== 'all' || priceFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'No approved courses yet. Check back soon!'}
          </p>
          {(search || selectedCategory !== 'all' || priceFilter !== 'all') && (
            <button
              onClick={() => { setSearch(''); setSelectedCategory('all'); setPriceFilter('all'); setSortBy('newest'); }}
              className="mt-4 px-5 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors text-sm"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
