import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const API = axios.create({ baseURL: process.env.REACT_APP_SERVER_URL});

API.interceptors.request.use((req) => {
    if(localStorage.getItem('profile')) {
        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`
    }
    return req;
})

export const fetchCourses = () => API.get(`/courses`);
export const fetchCoursesBySearch = (searchQuery) => API.get(`/courses/search?courseName=${searchQuery.searchCourseName || ''}&coach=${searchQuery.searchCoach || ''}&time=${searchQuery.searchTime || ''}&fromTime=${searchQuery.searchStartTime}&toTime=${searchQuery.searchEndTime}`);
export const createCourse = (newCourse) => API.post('/courses', newCourse);
export const updateCourse = (courseId ,courseData) => API.patch(`/courses/${courseId}`, courseData);
export const deleteCourse = (courseId) => API.delete(`/courses/${courseId}`);


export const signIn = (formData) => API.post('/users/signin', formData);
export const signUp = (formData) => API.post('/users/signup', formData);
export const fetchUsers = () => API.get('/users');
export const updateUser = (userData) => API.patch(`/users/${userData.user_email}`, userData);


export const recover = (email) => API.post('/users/recover', email);
export const resetpassword = (newPassword, token) => API.post(`/users/password-reset?token=${token}`, newPassword);

export const createCourseUser = (courseUserData) => API.post('/course-user', courseUserData);
export const fetchCourseUsers = () => API.get('/course-user');
export const deleteCourseUser = (courseUserData) => API.delete(`/course-user`, { data: courseUserData } );
export const updateCourseUser = (courseUserData) => API.patch(`/course-user`, courseUserData);

