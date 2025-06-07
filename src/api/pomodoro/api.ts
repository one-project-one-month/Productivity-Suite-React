import axios from 'axios';

const baseUrl = import.meta.env.VITE_BACKEND_SERVER;

const getCookie = (name: string): string | null  => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

export const getPomodoroData = async () => {
  const token = getCookie('productivity_access_token') || '';
  if (!token) {
    throw new Error('No access token found in cookies');
  }
  const res = await axios.get(`${baseUrl}/api/v1/pomodoro`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const deletePomodoroById = async (id : number)=> {
  const token = getCookie('productivity_access_token') || '';
  const res = await axios.get(`${baseUrl}/api/v1/pomodoro/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data
}