/**
 * Chat Widget Module
 * Compact chat widget that connects to Cloudflare Worker -> OpenRouter
 */
(function () {
  'use strict';

  // ── Configuration ──────────────────────────────────────────────────────────
  const CONFIG = {
    workerUrl: 'https://mla-chatbot.tonispraks94.workers.dev/',
    model: 'google/gemma-4-31b-it:free',
    systemPrompt: 'You are a helpful assistant for the Tonis Praks Universe website. Be friendly, concise, and helpful.',
    maxHistory: 20
  };

  // ── State ──────────────────────────────────────────────────────────────────
  let chatHistory = [];
  let isLoading = false;
  let isOpen = false;

  // ── DOM Elements ───────────────────────────────────────────────────────────
  let widget, toggle, box, messages, form, input, sendBtn;

  // ── Initialize ─────────────────────────────────────────────────────────────
  function init() {
    widget = document.getElementById('chat-widget');
    toggle = document.getElementById('chat-toggle');
    box = document.getElementById('chat-box');
    messages = document.getElementById('chat-messages');
    form = document.getElementById('chat-form');
    input = document.getElementById('chat-input');
    sendBtn = document.getElementById('chat-send');

    if (!widget || !toggle || !box) {
      console.log('[CHAT] Widget elements not found');
      return;
    }

    // Bind events
    toggle.addEventListener('click', toggleChat);
    form.addEventListener('submit', handleSubmit);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e);
      }
    });

    // Add welcome message
    addMessage('bot', "Hi! I'm Tonis's assistant. Ask me anything about projects or skills.");

    console.log('[CHAT] Widget initialized');
  }

  // ── Toggle Chat ────────────────────────────────────────────────────────────
  function toggleChat() {
    isOpen = !isOpen;
    const iconOpen = document.getElementById('chat-icon-open');
    const iconClose = document.getElementById('chat-icon-close');

    if (isOpen) {
      box.classList.remove('chat-box-hidden');
      iconOpen.style.display = 'none';
      iconClose.style.display = 'block';
      input.focus();
    } else {
      box.classList.add('chat-box-hidden');
      iconOpen.style.display = 'block';
      iconClose.style.display = 'none';
    }
  }

  // ── Handle Submit ──────────────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    if (isLoading) return;

    const message = input.value.trim();
    if (!message) return;

    // Clear input
    input.value = '';

    // Add user message
    addMessage('user', message);
    chatHistory.push({ role: 'user', content: message });

    // Trim history
    if (chatHistory.length > CONFIG.maxHistory) {
      chatHistory = chatHistory.slice(-CONFIG.maxHistory);
    }

    // Show loading
    isLoading = true;
    sendBtn.disabled = true;

    try {
      console.log('[CHAT] Sending to:', CONFIG.workerUrl);
      console.log('[CHAT] Payload:', { model: CONFIG.model, messages: chatHistory.length });

      const response = await fetch(CONFIG.workerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: CONFIG.model,
          messages: [
            { role: 'system', content: CONFIG.systemPrompt },
            ...chatHistory
          ]
        })
      });

      console.log('[CHAT] Response status:', response.status);
      const data = await response.json();
      console.log('[CHAT] Response data:', data);

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status} - ${data.error?.message || 'Unknown error'}`);
      }

      if (data.choices && data.choices[0] && data.choices[0].message) {
        const reply = data.choices[0].message.content;
        chatHistory.push({ role: 'assistant', content: reply });
        addMessage('bot', reply);
      } else {
        throw new Error('Invalid response format: ' + JSON.stringify(data));
      }
    } catch (error) {
      console.error('[CHAT] Error:', error);
      addMessage('error', `Error: ${error.message}`);
    } finally {
      isLoading = false;
      sendBtn.disabled = false;
      input.focus();
    }
  }

  // ── Add Message ────────────────────────────────────────────────────────────
  function addMessage(type, text) {
    const msg = document.createElement('div');
    msg.className = `chat-msg chat-msg-${type}`;
    msg.textContent = text;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  }

  // ── Auto-initialize ────────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
