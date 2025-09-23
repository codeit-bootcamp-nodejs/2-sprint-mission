import { MapData } from './types';

function getAuthToken(): string | null {
  return sessionStorage.getItem('accessToken');
}

export async function fetchMapData(): Promise<MapData> {
  const token = getAuthToken();
  if (!token) throw new Error('로그인이 필요합니다.');

  const response = await fetch('https://api.messagoom.online/game/maps', {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.status === 401) {
    throw new Error('인증이 만료되었습니다.');
  }

  const raw = await response.json();
  if (!raw.success || !raw.data) {
    throw new Error(raw.error?.message || '맵 데이터를 불러오는 데 실패했습니다.');
  }

  return raw.data[0].data;
}
