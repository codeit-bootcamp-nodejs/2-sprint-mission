export function initChatUI(onSendMessage: (message: string, scope: 'global' | 'local') => void) {
  const chatInput = document.getElementById('chat-input') as HTMLInputElement;
  const sendBtn = document.getElementById('chat-send') as HTMLButtonElement;
  const scopeSelect = document.getElementById('chat-scope') as HTMLSelectElement;

  if (!chatInput || !sendBtn || !scopeSelect) return;
  if (typeof onSendMessage !== 'function') return;

  const sendMessage = () => {
    const message = chatInput.value.trim();
    const scope = (scopeSelect.value as 'global' | 'local') || 'global';
    if (message) {
      onSendMessage(message, scope);
      chatInput.value = '';
    }
  };

  sendBtn.addEventListener('click', sendMessage);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
}

export function addMessageToBox(from: string, message: string, isMine: boolean, scope: 'global' | 'local' = 'global') {
  const targetBoxId = scope === 'global' ? 'chat-box-global' : 'chat-box-local';
  const chatBox = document.getElementById(targetBoxId) as HTMLDivElement;
  if (!chatBox) return;

  const msgElement = document.createElement('div');

  if (from === '관리자') {
    msgElement.textContent = message;
    msgElement.className = 'admin-message';
  } else {
    msgElement.textContent = `${isMine ? '나' : from}: ${message}`;
    msgElement.className = isMine ? 'my-message' : 'other-message';
  }

  chatBox.appendChild(msgElement);
  chatBox.scrollTop = chatBox.scrollHeight;
}
