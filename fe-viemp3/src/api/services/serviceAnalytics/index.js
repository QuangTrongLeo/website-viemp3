import apiAnalyticUrl from '~/api/urls/apiAnalytics';
import axios from 'axios';

// ===== LISTEN =====
export async function apiGetListenByMonth() {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${apiAnalyticUrl}/listen/month`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
}

export async function apiGetListenByWeek() {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${apiAnalyticUrl}/listen/week`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
}

export async function apiGetListenByDay() {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${apiAnalyticUrl}/listen/day`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
}

// ===== FINANCE (REVENUE & PACKAGES) =====
export async function apiGetRevenueStatistics() {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${apiAnalyticUrl}/finance/revenue`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
}

export async function apiGetPackageDistribution() {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${apiAnalyticUrl}/finance/packages`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
}

export async function apiGetMonthlyRevenue() {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${apiAnalyticUrl}/finance/revenue/monthly`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
}

// ===== GENRE =====
export async function apiGetGenreStatistics() {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${apiAnalyticUrl}/genres`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
}
