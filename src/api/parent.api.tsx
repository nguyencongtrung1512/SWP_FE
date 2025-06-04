import http from '../utils/http';

const API_URL = `/Parent`;

export const addStudent = async (params: { studentCode: string }) => {
  try {
    const response = await http.post(`${API_URL}/add-student`, params);
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.account));
    }
    return {
      success: true,
      message: response.data.message,
      data: response.data
    };
  } catch (error: any) {
    console.error('Add student error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Thêm con thất bại!',
      data: null
    };
  }
};