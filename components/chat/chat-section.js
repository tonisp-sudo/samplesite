/**
 * ChatSection — MLA Knowledge Assistant
 * Vanilla JavaScript — No modules, no frameworks
 * Mock responses only. No backend connection.
 */
(function () {
  'use strict';

  // ── DOM References ──────────────────────────────────────────────────────────
  var messages = document.getElementById('chat-messages');
  var form = document.getElementById('chat-form');
  var input = document.getElementById('chat-input');
  var loading = document.getElementById('chat-loading');

  // ── State ───────────────────────────────────────────────────────────────────
  var busy = false;

  // ── Mock Responses ──────────────────────────────────────────────────────────
  var mocks = [
    { keywords: ['beef', 'cattle', 'nutrition'], answer: 'MLA provides beef cattle nutrition guidelines covering energy, protein, mineral, and vitamin requirements. The Beef Cattle Nutrition Guide outlines feeding strategies for breeding herds, growing cattle, and feedlot operations.', sources: [{ title: 'Beef Cattle Nutrition Guide', url: 'https://www.mla.com.au/beef-cattle-nutrition' }, { title: 'Feedbase Planning Tool', url: 'https://www.mla.com.au/feedbase' }] },
    { keywords: ['lamb', 'carcase', 'grading', 'meat'], answer: 'The AUS-MEAT language is used for carcase classification. Lamb carcases are graded based on fat depth, muscle score, and carcase weight. MSA (Meat Standards Australia) provides eating quality predictions.', sources: [{ title: 'AUS-MEAT Language Manual', url: 'https://www.ausmeat.com.au/language' }, { title: 'MSA Grading Guidelines', url: 'https://www.mla.com.au/grading' }] },
    { keywords: ['mla', 'program', 'research'], answer: 'MLA invests in research and development programs focused on productivity, profitability, and sustainability across the Australian red meat industry.', sources: [{ title: 'MLA Programs Overview', url: 'https://www.mla.com.au/programs' }, { title: 'Research and Development', url: 'https://www.mla.com.au/research' }] },
    { keywords: ['sustainability', 'carbon', 'environment'], answer: 'MLA supports producers through the Carbon Neutral by 2030 (CN30) initiative, including methane reduction research and carbon farming practices.', sources: [{ title: 'Carbon Neutral 2030', url: 'https://www.mla.com.au/cn30' }] },
    { keywords: ['market', 'export', 'trade'], answer: 'Australia is a major red meat exporter. MLA develops market access across Japan, South Korea, China, and the United States.', sources: [{ title: 'Global Market Access', url: 'https://www.mla.com.au/markets' }] },
    { keywords: ['genetic', 'breeding', 'ebv'], answer: 'Estimated Breeding Values (EBVs) predict genetic merit. BREEDPLAN provides EBVs for fertility, growth, carcase, and maternal traits.', sources: [{ title: 'BREEDPLAN Documentation', url: 'https://www.mla.com.au/breedplan' }] },
    { keywords: ['health', 'disease', 'biosecurity'], answer: 'MLA provides resources on livestock health management, disease prevention, and biosecurity protocols.', sources: [{ title: 'Livestock Health Guide', url: 'https://www.mla.com.au/health' }] },
    { keywords: ['price', 'cost', 'market'], answer: 'MLA publishes market reports including Cattle, Lamb, and Goat Price Indicators with current pricing data.', sources: [{ title: 'Market Reports', url: 'https://www.mla.com.au/markets/reports' }] }
  ];

  var fallback = 'I could not find information about that in the MLA knowledge base.';

  // ── Helpers ─────────────────────────────────────────────────────────────────

  function scrollBottom() {
    messages.scrollTop = messages.scrollHeight;
  }

  function escape(text) {
    var d = document.createElement('div');
    d.appendChild(document.createTextNode(text));
    return d.innerHTML;
  }

  function findResponse(text) {
    var lower = text.toLowerCase();
    for (var i = 0; i < mocks.length; i++) {
      for (var j = 0; j < mocks[i].keywords.length; j++) {
        if (lower.indexOf(mocks[i].keywords[j]) !== -1) return mocks[i];
      }
    }
    return null;
  }

  // ── Add Message ─────────────────────────────────────────────────────────────

  function addMessage(text, type, sources) {
    var div = document.createElement('div');
    div.className = 'chat-message chat-message--' + type;

    var avatar = type === 'assistant'
      ? '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" stroke-linecap="round" stroke-linejoin="round"/></svg>'
      : '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    var html = '<div class="chat-message-avatar">' + avatar + '</div>';
    html += '<div class="chat-message-content"><p>' + escape(text) + '</p>';

    if (sources && sources.length > 0) {
      html += '<div class="chat-citations"><div class="chat-citations-label">Sources</div>';
      for (var i = 0; i < sources.length; i++) {
        html += '<a class="chat-citation" href="' + escape(sources[i].url) + '" target="_blank" rel="noopener noreferrer">' + escape(sources[i].title) + '</a>';
      }
      html += '</div>';
    }

    html += '</div>';
    div.innerHTML = html;
    messages.appendChild(div);
    scrollBottom();
  }

  // ── Process Message ─────────────────────────────────────────────────────────

  function send(text) {
    if (busy) return;
    text = text.trim();
    if (!text) return;

    busy = true;
    addMessage(text, 'user');
    input.value = '';
    loading.classList.add('active');
    input.disabled = true;

    setTimeout(function () {
      var response = findResponse(text);
      loading.classList.remove('active');
      input.disabled = false;
      input.focus();

      if (response) {
        addMessage(response.answer, 'assistant', response.sources);
      } else {
        addMessage(fallback, 'assistant');
      }

      busy = false;
    }, 800 + Math.random() * 700);
  }

  // ── Events ──────────────────────────────────────────────────────────────────

  function init() {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      send(input.value);
    });

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        send(input.value);
      }
    });

    input.focus();
    scrollBottom();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
