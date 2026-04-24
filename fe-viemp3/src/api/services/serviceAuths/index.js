import apiAuthUrl from '~/api/urls/apiAuths';

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
