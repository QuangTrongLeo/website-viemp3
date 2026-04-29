import apiAuthUrl from '~/api/urls/apiAuths';

// Hàm gọi API login
export async function apiLogin(email, password) {
  const res = await fetch(`${apiAuthUrl}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: email.trim(),
      password: password.trim(),
    }),
  });

  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Login failed');
  }

  return json.data; // { accessToken, refreshToken }
}

// Hàm gọi API register
export async function apiRegister(username, email, password) {
  const res = await fetch(`${apiAuthUrl}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: username.trim(),
      email: email.trim(),
      password: password.trim(),
    }),
  });

  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Đăng ký thất bại');
  }

  return json.message;
}

// Hàm gọi API verify OTP
export async function apiVerifyOtp(email, otp) {
  const res = await fetch(`${apiAuthUrl}/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: email.trim(),
      otp: otp.trim(),
    }),
  });

  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Xác thực OTP thất bại');
  }

  return json.message;
}

export async function apiRefreshToken(refreshToken) {
  const res = await fetch(`${apiAuthUrl}/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      refreshToken,
    }),
  });

  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Refresh token failed');
  }

  return json.data;
}
