/**
 * Chat Module
 * Connects to Cloudflare Worker backend -> OpenRouter API
 * Handles chat UI, message history, and streaming responses
 */
(function () {
  'use strict';

  // ── Configuration ──────────────────────────────────────────────────────────
  const CONFIG = {
    // Your Cloudflare Worker URL
    workerUrl: 'https://mla-chatbot.tonispraks94.workers.dev/',
    
    // Default model to use
    model: 'google/gemma-4-31b-it:free',
    
    // System prompt for the chatbot
    systemPrompt: `You are a helpful assistant for the Tonis Praks Universe website. 
    You can help visitors learn about Tonis's projects, skills, and interests. 
    Be friendly, concise, and helpful. If you don't know something, say so honestly.`,
    
    // Max messages to keep in history
    maxHistory: 20,
    
    // Enable streaming responses
    stream: true
  };

  // ── State ──────────────────────────────────────────────────────────────────
  let chatHistory = [];
  let isLoading = false;

  // ── DOM Elements ───────────────────────────────────────────────────────────
  let elements = {};

  // ── Initialize ─────────────────────────────────────────────────────────────
  function init() {
    // Get DOM elements
    elements = {
      chatMessages: document.getElementById('chat-messages'),
      chatForm: document.getElementById('chat-form'),
      chatInput: document.getElementById('chat-input'),
      chatSend: document.getElementById('chat-send'),
      chatLoading: document.getElementById('chat-loading'),
      chatSection: document.getElementById('chat-section')
    };

    // Check if chat elements exist
    if (!elements.chatForm || !elements.chatMessages) {
      console.log('[CHAT] Chat elements not found, skipping initialization');
      return;
    }

    console.log('[CHAT] Initializing chat module');

    // Bind events
    bindEvents();

    // Add welcome message
    addWelcomeMessage();

    console.log('[CHAT] Chat module initialized');
  }

  // ── Event Binding ──────────────────────────────────────────────────────────
  function bindEvents() {
    // Form submission
    elements.chatForm.addEventListener('submit', handleSubmit);

    // Input handling
    elements.chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e);
      }
    });

    // Auto-resize input
    elements.chatInput.addEventListener('input', () => {
      elements.chatInput.style.height = 'auto';
      elements.chatInput.style.height = Math.min(elements.chatInput.scrollHeight, 120) + 'px';
    });
  }

  // ── Welcome Message ────────────────────────────────────────────────────────
  function addWelcomeMessage() {
    const welcomeHTML = `
      <div class="chat-message chat-message--assistant">
        <div class="chat-message-avatar">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="chat-message-content">
          <p>Welcome! I'm here to help you explore the Tonis Praks Universe.</p>
          <p class="chat-message-hint">Ask me about projects, skills, or anything else you'd like to know.</p>
        </div>
      </div>
    `;
    elements.chatMessages.innerHTML = welcomeHTML;
  }

  // ── Handle Submit ──────────────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();

    if (isLoading) return;

    const message = elements.chatInput.value.trim();
    if (!message) return;

    // Clear input
    elements.chatInput.value = '';
    elements.chatInput.style.height = 'auto';

    // Add user message to UI
    addUserMessage(message);

    // Add to history
    chatHistory.push({ role: 'user', content: message });

    // Trim history if too long
    if (chatHistory.length > CONFIG.maxHistory) {
      chatHistory = chatHistory.slice(-CONFIG.maxHistory);
    }

    // Show loading
    setLoading(true);

    try {
      // Get response
      if (CONFIG.stream) {
        await streamResponse();
      } else {
        await getResponse();
      }
    } catch (error) {
      console.error('[CHAT] Error:', error);
      addErrorMessage('Sorry, something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // ── Get Response (Non-streaming) ──────────────────────────────────────────
  async function getResponse() {
    const response = await fetch(CONFIG.workerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: CONFIG.model,
        messages: [
          { role: 'system', content: CONFIG.systemPrompt },
          ...chatHistory
        ],
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.choices && data.choices[0]) {
      const assistantMessage = data.choices[0].message.content;
      chatHistory.push({ role: 'assistant', content: assistantMessage });
      addAssistantMessage(assistantMessage);
    } else {
      throw new Error('Invalid response format');
    }
  }

  // ── Stream Response ────────────────────────────────────────────────────────
  async function streamResponse() {
    const response = await fetch(CONFIG.workerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: CONFIG.model,
        messages: [
          { role: 'system', content: CONFIG.systemPrompt },
          ...chatHistory
        ],
        stream: true
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Create assistant message element
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message chat-message--assistant';
    messageDiv.innerHTML = `
      <div class="chat-message-avatar">
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="chat-message-content">
        <p class="streaming-text"></p>
      </div>
    `;
    elements.chatMessages.appendChild(messageDiv);

    const streamingText = messageDiv.querySelector('.streaming-text');
    let fullText = '';

    // Read the stream
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop(); // Keep incomplete line in buffer

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            if (parsed.choices && parsed.choices[0] && parsed.choices[0].delta) {
              const content = parsed.choices[0].delta.content;
              if (content) {
                fullText += content;
                streamingText.textContent = fullText;
                scrollToBottom();
              }
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    }

    // Add to history
    chatHistory.push({ role: 'assistant', content: fullText });
  }

  // ── Add User Message ───────────────────────────────────────────────────────
  function addUserMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message chat-message--user';
    messageDiv.innerHTML = `
      <div class="chat-message-avatar">
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      </div>
      <div class="chat-message-content">
        <p>${escapeHTML(text)}</p>
      </div>
    `;
    elements.chatMessages.appendChild(messageDiv);
    scrollToBottom();
  }

  // ── Add Assistant Message ──────────────────────────────────────────────────
  function addAssistantMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message chat-message--assistant';
    messageDiv.innerHTML = `
      <div class="chat-message-avatar">
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="chat-message-content">
        <p>${formatText(text)}</p>
      </div>
    `;
    elements.chatMessages.appendChild(messageDiv);
    scrollToBottom();
  }

  // ── Add Error Message ──────────────────────────────────────────────────────
  function addErrorMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message chat-message--error';
    messageDiv.innerHTML = `
      <div class="chat-message-avatar">
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <div class="chat-message-content">
        <p>${escapeHTML(text)}</p>
      </div>
    `;
    elements.chatMessages.appendChild(messageDiv);
    scrollToBottom();
  }

  // ── Set Loading State ──────────────────────────────────────────────────────
  function setLoading(loading) {
    isLoading = loading;
    elements.chatSend.disabled = loading;
    elements.chatInput.disabled = loading;
    
    if (loading) {
      elements.chatLoading.classList.add('active');
    } else {
      elements.chatLoading.classList.remove('active');
    }
  }

  // ── Scroll to Bottom ───────────────────────────────────────────────────────
  function scrollToBottom() {
    elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
  }

  // ── Escape HTML ────────────────────────────────────────────────────────────
  function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ── Format Text (basic markdown-like) ──────────────────────────────────────
  function formatText(text) {
    // Escape HTML first
    let formatted = escapeHTML(text);
    
    // Bold: **text** or __text__
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/__(.*?)__/g, '<strong>$1</strong>');
    
    // Italic: *text* or _text_
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
    formatted = formatted.replace(/_(.*?)_/g, '<em>$1</em>');
    
    // Code: `text`
    formatted = formatted.replace(/`(.*?)`/g, '<code>$1</code>');
    
    // Line breaks
    formatted = formatted.replace(/\n/g, '<br>');
    
    return formatted;
  }

  // ── Public API ─────────────────────────────────────────────────────────────
  window.ChatModule = {
    init: init,
    clearHistory: () => {
      chatHistory = [];
      addWelcomeMessage();
    },
    getConfig: () => ({ ...CONFIG }),
    setConfig: (newConfig) => {
      Object.assign(CONFIG, newConfig);
    }
  };

  // ── Auto-initialize when DOM is ready ──────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
