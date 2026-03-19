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

// Auth
export const login = (credentials) => API.post('/users/login/', credentials);
export const register = (data) => API.post('/users/register/', data);
export const getMe = () => API.get('/users/me/');
export const updateMe = (data) => API.patch('/users/me/', data);

// Courses
export const getCourses = () => API.get('/courses/courses/');
export const getCourse = (id) => API.get(`/courses/courses/${id}/`);
export const createCourse = (data) => API.post('/courses/courses/', data);
export const updateCourse = (id, data) => API.patch(`/courses/courses/${id}/`, data);
export const deleteCourse = (id) => API.delete(`/courses/courses/${id}/`);

// Categories
export const getCategories = () => API.get('/courses/categories/');

// Enrollment
export const enrollCourse = (courseId) => API.post(`/courses/courses/${courseId}/enroll/`);
export const getMyEnrollments = () => API.get('/courses/enrollments/');
export const createCheckoutSession = (enrollmentId) =>
  API.post(`/courses/enrollments/${enrollmentId}/create_checkout_session/`);

// Admin
export const getUsers = () => API.get('/users/manage/');
export const createUser = (data) => API.post('/users/manage/', data);
export const updateUser = (id, data) => API.patch(`/users/manage/${id}/`, data);
export const deleteUser = (id) => API.delete(`/users/manage/${id}/`);

export default API;
