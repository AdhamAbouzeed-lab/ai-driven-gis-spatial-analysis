import { t } from '../utils/i18n.js';
import { setState, getState, onStateChange } from '../state.js';

let aiModule = null;
let aiInitialized = false;

async function ensureAI(messages) {
  if (!aiModule) {
    aiModule = await import('../ai/AIAssistant.js');
  }
  if (!aiInitialized) {
    aiModule.initAI(messages);
    aiInitialized = true;
  }
  return aiModule;
}

export function initChatPanel() {
  const input = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send');
  const messages = document.getElementById('chat-messages');
  const quickPrompts = document.getElementById('quick-prompts');
  if (!input || !sendBtn || !messages) return;

  const send = async () => {
    const text = input.value.trim();
    if (!text) return;
    const mod = await ensureAI(messages);
    mod.sendMessage(text);
    input.value = '';
  };

  sendBtn.addEventListener('click', send);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') send();
  });
  // Warm the AI chunk on first focus (not on page load) so the network
  // fetch overlaps with the user typing instead of delaying startup.
  input.addEventListener('focus', () => ensureAI(messages), { once: true });

  if (quickPrompts) {
    quickPrompts.addEventListener('click', (e) => {
      const btn = e.target.closest('.quick-prompt');
      if (!btn) return;
      const prompt = btn.dataset.prompt;
      if (prompt) {
        input.value = prompt;
        send();
      }
    });
  }

  onStateChange((update) => {
    if (update.aiPrompt) {
      input.value = update.aiPrompt;
      send();
      setState({ aiPrompt: null });
    }
  });
}
