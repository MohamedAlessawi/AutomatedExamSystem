// src/services/authService.js
import api from './api';

// Login function
export const login = async (credentials) => {
  try {
    const response = await api.post('/login', credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
};

// Logout function
export const logout = async () => {
  try {
    await api.post('/logout');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    return { success: true };
  } catch (error) {
    // Even if the API call fails, remove tokens locally
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    throw error.response?.data || { message: 'Logout failed' };
  }
};

// Refresh token function
export const refreshToken = async () => {
  const refresh_token = localStorage.getItem('refresh_token');
  if (!refresh_token) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await api.post('/refresh-token', { refresh_token });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Token refresh failed' };
  }
};

// Register function (admin only)
export const register = async (userData) => {
  try {
    const response = await api.post('/register', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Registration failed' };
  }
};

// Forgot password function
export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/forgot-password', null, {
      params: { email }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to send reset email' };
  }
};

// Reset password function
export const resetPassword = async (resetData) => {
  try {
    const response = await api.post('/reset-password', null, {
      params: resetData
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Password reset failed' };
  }
};

// Admin - Get all teachers
export const getTeachers = async () => {
  try {
    const response = await api.get('/admin/teachers');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch teachers' };
  }
};

// Admin - Get all students
export const getStudents = async () => {
  try {
    const response = await api.get('/admin/students');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch students' };
  }
};

// Admin - Get teacher details by ID
export const getTeacherById = async (id) => {
  try {
    const response = await api.get(`/admin/teachers/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch teacher details' };
  }
};

// Admin - Get student details by ID
export const getStudentById = async (id) => {
  try {
    const response = await api.get(`/admin/students/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch student details' };
  }
};

// Admin - Toggle user active status
export const toggleUserStatus = async (id) => {
  try {
    const response = await api.patch(`/admin/users/${id}/toggle-active`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update user status' };
  }
};

// Admin - Get exam statistics
export const getAdminExamStats = async () => {
  try {
    const response = await api.get('/admin/stats/exams/students');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch exam statistics' };
  }
};

// Generic function to update a user (teacher or student)
export const updateUser = async (id, userData) => {
  try {
    const role = userData.role;
    if (!role || !['teacher', 'student', 'admin'].includes(role)) {
      throw new Error('Invalid user role provided for update.');
    }

    const endpoint = `/admin/${role}s/${id}`;
    const response = await api.put(endpoint, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update user' };
  }
};

// Teacher - Question Banks
export const getQuestionBanks = async () => {
  try {
    const response = await api.get('/teacher/question-banks');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch question banks' };
  }
};

export const createQuestionBank = async (questionBankData) => {
  try {
    const response = await api.post('/teacher/question-banks', questionBankData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create question bank' };
  }
};

export const updateQuestionBank = async (id, questionBankData) => {
  try {
    const response = await api.put(`/teacher/question-banks/${id}`, questionBankData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update question bank' };
  }
};

export const deleteQuestionBank = async (id) => {
  try {
    const response = await api.delete(`/teacher/question-banks/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete question bank' };
  }
};

export const getQuestionBankWithQuestions = async (id) => {
  try {
    const response = await api.get(`/teacher/question-banks/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch question bank with questions' };
  }
};

// Teacher - Questions
export const getQuestions = async (filters = {}) => {
  try {
    const response = await api.get('/teacher/questions', { params: filters });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch questions' };
  }
};

export const getQuestionById = async (id) => {
  try {
    const response = await api.get(`/teacher/questions/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch question details' };
  }
};

export const createQuestion = async (questionData) => {
  try {
    const response = await api.post('/teacher/questions', questionData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create question' };
  }
};

export const updateQuestion = async (id, questionData) => {
  try {
    const response = await api.put(`/teacher/questions/${id}`, questionData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update question' };
  }
};

export const deleteQuestion = async (id) => {
  try {
    const response = await api.delete(`/teacher/questions/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete question' };
  }
};

// Teacher - Exams
export const getExams = async () => {
  try {
    const response = await api.get('/teacher/exams');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch exams' };
  }
};

export const getExamById = async (id) => {
  try {
    const response = await api.get(`/teacher/exams/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch exam details' };
  }
};

export const createExam = async (examData) => {
  try {
    const response = await api.post('/teacher/exams', examData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create exam' };
  }
};

export const updateExam = async (id, examData) => {
  try {
    const response = await api.put(`/teacher/exams/${id}`, examData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update exam' };
  }
};

export const deleteExam = async (id) => {
  try {
    const response = await api.delete(`/teacher/exams/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete exam' };
  }
};

// Teacher - Objections
export const getObjections = async () => {
  try {
    const response = await api.get('/teacher/objections');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch objections' };
  }
};

export const updateObjection = async (id, objectionData) => {
  try {
    const response = await api.put(`/teacher/objections/${id}`, objectionData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update objection' };
  }
};

// Teacher - Student Helper
export const getStudentsForTeacher = async () => {
  try {
    const response = await api.get('/teacher/students');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch students' };
  }
};

export const getStudentByIdForTeacher = async (id) => {
  try {
    const response = await api.get(`/teacher/students/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch student details' };
  }
};

// Student - Exam Endpoints
export const getCurrentExams = async () => {
  try {
    const response = await api.get('/student/exams/current');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch current exams' };
  }
};

export const getExamHistory = async (filters = {}) => {
  try {
    const response = await api.get('/student/exams/history', { params: filters });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch exam history' };
  }
};

export const getStudentExamById = async (id) => {
  try {
    const response = await api.get(`/student/exams/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch exam details' };
  }
};

export const submitExam = async (examData) => {
  try {
    console.log('Submitting exam data:', examData);
    const response = await api.post('/student/exams/submit', examData);
    return response.data;
  } catch (error) {
    console.error('Submit exam error response:', error.response?.data);

    if (error.response?.status === 422) {
      const errors = error.response.data.errors;
      if (errors) {
        const errorMessages = Object.values(errors).flat();
        throw {
          message: errorMessages.join(', '),
          errors: errors
        };
      }
    }

    throw error.response?.data || { message: 'Failed to submit exam' };
  }
};

export const submitObjection = async (objectionData) => {
  try {
    const response = await api.post('/student/objections', objectionData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to submit objection' };
  }
};

export const getExamDetails = async (examAssignmentId) => {
  const response = await api.get(`/student/exams/${examAssignmentId}`);
  return response.data;
};