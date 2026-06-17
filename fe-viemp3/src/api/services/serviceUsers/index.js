import apiUserUrl from '~/api/urls/apiUsers';
import axios from 'axios';

export async function apiGetProfile() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${apiUserUrl}/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Request failed');
  }
  return data;
}

export async function apiUpdateProfile(formData) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${apiUserUrl}/me`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Update failed');
  }
  return data;
}

export async function apiUpdateUserRoles(data) {
  const token = localStorage.getItem('token');
  const res = await axios.put(`${apiUserUrl}/roles`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.success;
}

// ===== CHECK IF USER IS STUDENT =====
export async function apiCheckUserIsStudent() {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${apiUserUrl}/is-student`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    throw new Error(message);
  }
}

// ===== GET ALL USERS =====
export async function apiGetUsers() {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${apiUserUrl}/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    throw new Error(message);
  }
}
