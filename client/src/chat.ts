import { initChatUI } from './ui';
import { initChatNetwork, sendChatMessage } from './network';

export function initChat(): void {
  initChatNetwork();
  initChatUI(sendChatMessage);
}
