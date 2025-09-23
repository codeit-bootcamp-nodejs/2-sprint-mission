export function getAuthToken(): string | null {
  return sessionStorage.getItem('accessToken');
}
export function createWebSocket(
  url: string,
  onOpen: (ws: WebSocket) => void,
  onMessage: (data: any) => void,
  onClose?: () => void,
  onError?: (err: Event) => void
): WebSocket {
  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';

  let finalUrl = url;
  if (url.startsWith('http://') || url.startsWith('https://')) {
    finalUrl = url.replace(/^http/, protocol);
  } else if (url.startsWith('ws://') || url.startsWith('wss://')) {
    finalUrl = url; // 이미 올바른 경우
  } else {
    finalUrl = `${protocol}://${url}`;
  }

  const ws = new WebSocket(finalUrl);

  ws.onopen = () => onOpen(ws);

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch (e) {
      console.error('Failed to parse WebSocket message:', event.data);
    }
  };

  ws.onclose = () => onClose?.();
  ws.onerror = (err) => onError?.(err);

  return ws;
}
