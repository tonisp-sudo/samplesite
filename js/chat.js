/**
 * Chat Widget Module
 * Compact chat widget with minimize/maximize controls
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
  let isMaximized = false;
  let isMinimized = false;

  // ── DOM Elements ───────────────────────────────────────────────────────────
  let widget, toggle, box, messages, form, input, sendBtn;
  let minimizeBtn, maximizeBtn, closeBtn;
  let iconOpen, iconClose;

  // ── Initialize ─────────────────────────────────────────────────────────────
  function init() {
    widget = document.getElementById('chat-widget');
    toggle = document.getElementById('chat-toggle');
    box = document.getElementById('chat-box');
    messages = document.getElementById('chat-messages');
    form = document.getElementById('chat-form');
    input = document.getElementById('chat-input');
    sendBtn = document.getElementById('chat-send');
    minimizeBtn = document.getElementById('chat-minimize');
    maximizeBtn = document.getElementById('chat-maximize');
    closeBtn = document.getElementById('chat-close');
    iconOpen = document.getElementById('chat-icon-open');
    iconClose = document.getElementById('chat-icon-close');

    if (!widget || !toggle || !box) {
      console.log('[CHAT] Widget elements not found');
      return;
    }

    // Bind events
    toggle.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', closeChat);
    minimizeBtn.addEventListener('click', toggleMinimize);
    maximizeBtn.addEventListener('click', toggleMaximize);
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

  // ── Toggle Chat (Open/Close) ───────────────────────────────────────────────
  function toggleChat() {
    if (isOpen) {
      closeChat();
    } else {
      openChat();
    }
  }

  function openChat() {
    isOpen = true;
    box.classList.remove('chat-box-hidden');
    iconOpen.style.display = 'none';
    iconClose.style.display = 'block';
    
    // Reset minimize/maximize states
    if (isMinimized) toggleMinimize();
    if (isMaximized) toggleMaximize();
    
    input.focus();
  }

  function closeChat() {
    isOpen = false;
    isMinimized = false;
    isMaximized = false;
    box.classList.add('chat-box-hidden');
    box.classList.remove('chat-minimized', 'chat-maximized');
    iconOpen.style.display = 'block';
    iconClose.style.display = 'none';
  }

  // ── Toggle Minimize ────────────────────────────────────────────────────────
  function toggleMinimize() {
    isMinimized = !isMinimized;
    
    if (isMinimized) {
      box.classList.add('chat-minimized');
      // Update minimize button icon to restore
      minimizeBtn.innerHTML = `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
    } else {
      box.classList.remove('chat-minimized');
      // Restore minimize icon
      minimizeBtn.innerHTML = `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path d="M5 12h14" stroke-linecap="round"/>
      </svg>`;
    }
  }

  // ── Toggle Maximize ────────────────────────────────────────────────────────
  function toggleMaximize() {
    isMaximized = !isMaximized;
    
    if (isMaximized) {
      box.classList.add('chat-maximized');
      // Update maximize button icon to restore
      maximizeBtn.innerHTML = `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path d="M4 14h6v6M14 4h6v6M14 14l6 6M4 4l6 6" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
    } else {
      box.classList.remove('chat-maximized');
      // Restore maximize icon
      maximizeBtn.innerHTML = `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
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
