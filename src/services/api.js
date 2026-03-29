import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const tokens = JSON.parse(localStorage.getItem('tokens'));
  if (tokens?.access) {
    config.headers.Authorization = `Bearer ${tokens.access}`;
  }
  return config;
});

// Auto-refresh token on 401
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const tokens = JSON.parse(localStorage.getItem('tokens'));
      if (tokens?.refresh) {
        try {
          const { data } = await axios.post('/api/users/login/refresh/', {
            refresh: tokens.refresh,
          });
          localStorage.setItem(
            'tokens',
            JSON.stringify({ ...tokens, access: data.access })
          );
          originalRequest.headers.Authorization = `Bearer ${data.access}`;
          return API(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('tokens');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// ─── Auth ────────────────────────────────────────────────────────────────────
export const login = (credentials) => API.post('/users/login/', credentials);
export const register = (data) => API.post('/users/register/', data);
export const getMe = () => API.get('/users/me/');
export const updateMe = (data) => {
  if (data instanceof FormData) {
    return API.patch('/users/me/', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
  return API.patch('/users/me/', data);
};

// ─── Courses ──────────────────────────────────────────────────────────────────
export const getCourses = (params) => API.get('/courses/courses/', { params });
export const getCourse = (id) => API.get(`/courses/courses/${id}/`);
export const createCourse = (data) => API.post('/courses/courses/', data);
export const updateCourse = (id, data) => {
  if (data instanceof FormData) {
    return API.patch(`/courses/courses/${id}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
  return API.patch(`/courses/courses/${id}/`, data);
};
export const deleteCourse = (id) => API.delete(`/courses/courses/${id}/`);
export const submitCourseForApproval = (id) => API.post(`/courses/courses/${id}/submit_for_approval/`);
export const approveCourse = (id) => API.post(`/courses/courses/${id}/approve/`);
export const unapproveCourse = (id) => API.post(`/courses/courses/${id}/unapprove/`);
export const getInstructorStats = () => API.get('/courses/courses/instructor_stats/');
export const recordCourseView = (id) => API.post(`/courses/courses/${id}/record_view/`);

// ─── Categories ───────────────────────────────────────────────────────────────
export const getCategories = () => API.get('/courses/categories/');
export const createCategory = (data) => API.post('/courses/categories/', data);
export const updateCategory = (id, data) => API.patch(`/courses/categories/${id}/`, data);
export const deleteCategory = (id) => API.delete(`/courses/categories/${id}/`);

// ─── Chapters ─────────────────────────────────────────────────────────────────
export const createChapter = (data) => API.post('/courses/chapters/', data);
export const updateChapter = (id, data) => API.patch(`/courses/chapters/${id}/`, data);
export const deleteChapter = (id) => API.delete(`/courses/chapters/${id}/`);

// ─── Lessons ──────────────────────────────────────────────────────────────────
export const getLesson = (id) => API.get(`/courses/lessons/${id}/`);
export const createLesson = (data) => API.post('/courses/lessons/', data);
export const updateLesson = (id, data) => API.patch(`/courses/lessons/${id}/`, data);
export const deleteLesson = (id) => API.delete(`/courses/lessons/${id}/`);
export const markLessonCompleted = (id) => API.post(`/courses/lessons/${id}/mark_completed/`);
export const updateLessonProgress = (id, data) => API.post(`/courses/lessons/${id}/update_progress/`, data);

// ─── Content Blocks ───────────────────────────────────────────────────────────
export const createContentBlock = (data) => {
  if (data instanceof FormData) {
    return API.post('/courses/content-blocks/', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
  return API.post('/courses/content-blocks/', data);
};
export const updateContentBlock = (id, data) => {
  if (data instanceof FormData) {
    return API.patch(`/courses/content-blocks/${id}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
  return API.patch(`/courses/content-blocks/${id}/`, data);
};
export const deleteContentBlock = (id) => API.delete(`/courses/content-blocks/${id}/`);

// ─── Enrollment ───────────────────────────────────────────────────────────────
export const enrollCourse = (courseId) => API.post(`/courses/courses/${courseId}/enroll/`);
export const getMyEnrollments = () => API.get('/courses/enrollments/');
export const createCheckoutSession = (enrollmentId) =>
  API.post(`/courses/enrollments/${enrollmentId}/create_checkout_session/`);

// ─── Reviews ──────────────────────────────────────────────────────────────────
export const getReviews = (params) => API.get('/courses/reviews/', { params });
export const createReview = (data) => API.post('/courses/reviews/', data);

// ─── Wallet & Earnings ────────────────────────────────────────────────────────
export const getWallet = () => API.get('/courses/wallets/');
export const getWithdrawalRequests = () => API.get('/courses/withdrawal-requests/');
export const createWithdrawalRequest = (data) => API.post('/courses/withdrawal-requests/', data);
export const approveWithdrawal = (id) => API.post(`/courses/withdrawal-requests/${id}/approve/`);
export const markWithdrawalPaid = (id) => API.post(`/courses/withdrawal-requests/${id}/mark_paid/`);

// ─── Admin – User Management ──────────────────────────────────────────────────
export const getAdminStats = () => API.get('/users/admin-stats/');
export const getUsers = () => API.get('/users/manage/');
export const createUser = (data) => API.post('/users/manage/', data);
export const updateUser = (id, data) => API.patch(`/users/manage/${id}/`, data);
export const deleteUser = (id) => API.delete(`/users/manage/${id}/`);
export const approveInstructor = (id) => API.post(`/users/manage/${id}/approve_instructor/`);
export const rejectInstructor = (id) => API.post(`/users/manage/${id}/reject_instructor/`);

// ─── Admin – Course Moderation ────────────────────────────────────────────────
export const getAllCourses = () => API.get('/courses/courses/');
export const adminApproveCourse = (id) => API.post(`/courses/courses/${id}/approve/`);
export const adminUnapproveCourse = (id) => API.post(`/courses/courses/${id}/unapprove/`);

// ─── AI Services ─────────────────────────────────────────────────────────────
export const generateCourseDescription = (data) => API.post('/ai/generate-description/', data);

export default API;
