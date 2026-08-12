import { t } from '../utils/i18n.js';
import { handleMessage } from './Commands.js';

let messagesContainer = null;
let selectedRegion = null;

export function initAI(container) {
  messagesContainer = container;
  // Welcome message is already in HTML
}

export function setSelectedRegion(name) {
  selectedRegion = name;
}

export async function sendMessage(text) {
  if (!messagesContainer) return;

  // User message
  const userDiv = document.createElement('div');
  userDiv.className = 'chat-msg user';
  userDiv.innerHTML = `
    <div class="chat-bubble user">${escapeHtml(text)}</div>
    <div class="w-5 h-5 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0 mt-0.5 text-[9px] font-bold text-white">U</div>
  `;
  messagesContainer.appendChild(userDiv);
  scrollToBottom();

  // Typing indicator
  const typingDiv = document.createElement('div');
  typingDiv.className = 'chat-msg';
  typingDiv.id = 'typing-indicator';
  typingDiv.innerHTML = `
    <div class="w-5 h-5 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0 mt-0.5">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
    </div>
    <div class="chat-bubble ai">
      <div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>
    </div>
  `;
  messagesContainer.appendChild(typingDiv);
  scrollToBottom();

  // Simulate processing delay
  await new Promise(r => setTimeout(r, 800 + Math.random() * 600));

  const indicator = document.getElementById('typing-indicator');
  if (indicator) indicator.remove();

  const response = await handleMessage(text, selectedRegion);

  const aiDiv = document.createElement('div');
  aiDiv.className = 'chat-msg';
  aiDiv.innerHTML = `
    <div class="w-5 h-5 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0 mt-0.5">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
    </div>
    <div class="chat-bubble ai">${response}</div>
  `;
  messagesContainer.appendChild(aiDiv);
  scrollToBottom();
}

function scrollToBottom() {
  if (messagesContainer) {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
