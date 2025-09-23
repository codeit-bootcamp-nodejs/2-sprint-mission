import { startGame } from './game';
import { gameState } from './state';

// UI 전환 함수
function showGameUI() {
  (document.querySelector('.login-form') as HTMLDivElement).style.display = 'none';
  (document.querySelector('.game-container') as HTMLDivElement).style.display = 'block';
  (document.querySelector('.user-list-container') as HTMLDivElement).style.display = 'block';
  (document.querySelector('.chat-container') as HTMLDivElement).style.display = 'flex';
}

function showAuthUI() {
  (document.querySelector('.login-form') as HTMLDivElement).style.display = 'block';
  (document.querySelector('.game-container') as HTMLDivElement).style.display = 'none';
  (document.querySelector('.user-list-container') as HTMLDivElement).style.display = 'none';
  (document.querySelector('.chat-container') as HTMLDivElement).style.display = 'none';
}

// 토큰 관련 유틸
function saveTokens(access: string, refresh: string) {
  sessionStorage.setItem('accessToken', access);
  sessionStorage.setItem('refreshToken', refresh);
}

function clearTokens() {
  sessionStorage.clear();
}

export function getAuthTokens() {
  const accessToken = sessionStorage.getItem('accessToken');
  const refreshToken = sessionStorage.getItem('refreshToken');
  if (accessToken && refreshToken) return { accessToken, refreshToken };
  return null;
}

// 현재 로그인된 유저 정보 가져오기
async function fetchMyProfile() {
  const tokens = getAuthTokens();
  if (!tokens) return null;

  const resp = await fetch('https://api.messagoom.online/auth/me', {
    headers: { Authorization: `Bearer ${tokens.accessToken}` },
  });

  if (!resp.ok) return null;

  const data = await resp.json();
  if (data.success && data.data) {
    return data.data; // { id, username }
  }
  return null;
}

// 토큰 검증
async function validateAccessToken(accessToken: string): Promise<boolean> {
  const resp = await fetch('https://api.messagoom.online/auth/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (resp.ok) {
    const data = await resp.json();
    return data.success;
  }
  return false;
}

// 토큰 갱신
async function refreshTokens(refreshToken: string): Promise<boolean> {
  const resp = await fetch('https://api.messagoom.online/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  const data = await resp.json();
  if (resp.ok && data.success && data.data?.accessToken && data.data?.refreshToken) {
    saveTokens(data.data.accessToken, data.data.refreshToken);
    return true;
  }
  return false;
}

// 로그인/회원가입
async function trySignIn(username: string, password: string): Promise<boolean> {
  const resp = await fetch('https://api.messagoom.online/auth/signin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await resp.json();

  if (resp.status === 404) {
    await trySignUp(username, password);
    return trySignIn(username, password);
  }

  if (resp.ok && data.success && data.data?.accessToken && data.data?.refreshToken) {
    saveTokens(data.data.accessToken, data.data.refreshToken);
    return true;
  }

  return false;
}

async function trySignUp(username: string, password: string) {
  const resp = await fetch('https://api.messagoom.online/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await resp.json();
  if (!resp.ok || !data.success) throw new Error('회원가입 실패');
}

// 자동 로그인
async function autoLoginFlow(): Promise<boolean> {
  const tokens = getAuthTokens();
  if (!tokens) return false;

  const valid = await validateAccessToken(tokens.accessToken);
  if (valid) return true;

  const refreshed = await refreshTokens(tokens.refreshToken);
  if (refreshed) {
    const newTokens = getAuthTokens();
    if (newTokens) return validateAccessToken(newTokens.accessToken);
  }

  clearTokens();
  return false;
}

// 전체 초기화
export async function initAuth(): Promise<void> {
  const signinBtn = document.getElementById('signin') as HTMLButtonElement;
  const usernameInput = document.getElementById('username') as HTMLInputElement;
  const passwordInput = document.getElementById('password') as HTMLInputElement;

  // 자동 로그인 먼저 시도
  if (await autoLoginFlow()) {
    const me = await fetchMyProfile();
    if (me) {
      gameState.me.id = me.id;
      gameState.me.username = me.username;
    }
    showGameUI();
    await startGame();
    return;
  }

  showAuthUI();

  signinBtn.addEventListener('click', async () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    if (!username || !password) {
      alert('Username과 Password를 입력하세요.');
      return;
    }

    const ok = await trySignIn(username, password);
    if (ok) {
      const me = await fetchMyProfile();
      if (me) {
        gameState.me.id = me.id;
        gameState.me.username = me.username;
      }
      showGameUI();
      await startGame();
    } else {
      alert('로그인 실패');
    }
  });
}
