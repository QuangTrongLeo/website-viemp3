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