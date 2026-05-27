/* ══════════════════════════════════════════════════════
   ST·AI — SolutionsTechnologies Intelligence Artificielle
   © 2025 SolutionsTechnologies™ — Tous droits réservés
   Créé par : André (Fondateur) · Dva.99 (Lord of Code) · Antigravity (Lord of AI)

   AVERTISSEMENT LÉGAL :
   Toute copie ou reproduction non autorisée de la marque SolutionsTechnologies™
   est strictement interdite et illégale.
   ══════════════════════════════════════════════════════ */

'use strict';

/* ── STATE ── */
const state = {
  chats: JSON.parse(localStorage.getItem('stai_chats') || '[]'),
  activeId: null,
  model: localStorage.getItem('stai_model') || 'llama-3.1-8b-instant',
  modelProvider: localStorage.getItem('stai_provider') || 'groq',
  modelColor: localStorage.getItem('stai_color') || '#8b5cf6',
  apiKeys: JSON.parse(localStorage.getItem('stai_keys') || '{}'),
  systemPrompt: localStorage.getItem('stai_sysprompt') || '',
  settings: JSON.parse(localStorage.getItem('stai_settings') || '{}'),
  isGenerating: false,
  isStreaming: false,
  recognition: null,
  novaOpen: false,
};

/* ── MODELS CONFIG ── */
const MODELS = {
  // --- POLLINATIONS (FREE - NO KEY) ---
  'pollinations-gpt':   { id:'openai',            provider:'pollinations', color:'#00d4ff', name:'GPT-OSS (Fast)' },
  'pollinations-mistral':{ id:'mistral',           provider:'pollinations', color:'#6c63ff', name:'Mistral AI' },
  'pollinations-llama': { id:'llama',             provider:'pollinations', color:'#8b5cf6', name:'Llama 3.1 (Pollinations)' },
  'pollinations-search':{ id:'searchgpt',         provider:'pollinations', color:'#10a37f', name:'SearchGPT (Web Access)' },
  'pollinations-qwen':  { id:'qwen',              provider:'pollinations', color:'#ff5a5f', name:'Qwen 2.5 72B' },
  'pollinations-evil':  { id:'evil',              provider:'pollinations', color:'#ff3e3e', name:'Evil Assistant (Unfiltered)' },
  'pollinations-unity': { id:'unity',             provider:'pollinations', color:'#000000', name:'Unity AI' },
  
  // --- GROQ (GSK KEY REQUIRED) ---
  'groq-llama-70b':     { id:'llama-3.3-70b-versatile',        provider:'groq', color:'#7c3aed', name:'Llama 3.3 70B (Groq)' },
  'groq-llama-8b':      { id:'llama-3.1-8b-instant',           provider:'groq', color:'#8b5cf6', name:'Llama 3.1 8B (Groq)' },
  'groq-deepseek':      { id:'deepseek-r1-distill-llama-70b',  provider:'groq', color:'#e11d48', name:'DeepSeek R1 (Groq)' },
  'groq-mixtral':       { id:'mixtral-8x7b-32768',             provider:'groq', color:'#f59e0b', name:'Mixtral 8×7B' },
  'groq-gemma':         { id:'gemma2-9b-it',                   provider:'groq', color:'#06b6d4', name:'Gemma 2 9B' },

  // --- PREMIUM (API KEYS) ---
  'openai-gpt4o':       { id:'gpt-4o',                         provider:'openai',    color:'#10a37f', name:'GPT-4o ©OpenAI' },
  'openai-gpt4omini':   { id:'gpt-4o-mini',                   provider:'openai',    color:'#10a37f', name:'GPT-4o mini ©OpenAI' },
  'claude-sonnet':      { id:'claude-3-5-sonnet-20241022',     provider:'anthropic', color:'#c5a85a', name:'Claude 3.5 Sonnet' },
  'claude-haiku':       { id:'claude-3-haiku-20240307',        provider:'anthropic', color:'#e8a87c', name:'Claude 3 Haiku' },
  'gemini-flash':       { id:'gemini-1.5-flash',               provider:'google',    color:'#4285f4', name:'Gemini 1.5 Flash' },
  'gemini-pro':         { id:'gemini-1.5-pro',                 provider:'google',    color:'#34a853', name:'Gemini 1.5 Pro' },
};

/* ── TUTORIAL STEPS ── */
const TUTORIAL_STEPS = [
  {
    title: "Bienvenue sur ST·AI 🎉",
    step: "Étape 1 / 6",
    text: "Bienvenue sur <strong>ST·AI</strong> par SolutionsTechnologies ! Je suis <strong>Nova</strong>, votre assistante IA. Laissez-moi vous faire une visite guidée de toutes les fonctionnalités disponibles.",
    progress: "16%"
  },
  {
    title: "Choisir votre modèle IA 🤖",
    step: "Étape 2 / 6",
    text: "En haut au centre, vous trouverez le <strong>sélecteur de modèle</strong>. Choisissez parmi <strong>12+ modèles IA</strong> incluant GPT-4o ©OpenAI, Llama ©Meta, Mistral ©Mistral AI, Gemini ©Google et DeepSeek ©DeepSeek. Les modèles <strong>GRATUITS</strong> ne nécessitent aucune clé API !",
    progress: "33%"
  },
  {
    title: "Démarrer une discussion 💬",
    step: "Étape 3 / 6",
    text: "Tapez votre question dans la <strong>zone de texte en bas</strong>. Appuyez sur <strong>Entrée</strong> pour envoyer ou <strong>Maj+Entrée</strong> pour aller à la ligne. Vous pouvez aussi utiliser le <strong>bouton microphone 🎤</strong> pour la saisie vocale.",
    progress: "50%"
  },
  {
    title: "Générer des images 🎨",
    step: "Étape 4 / 6",
    text: "Cliquez sur <strong>Générer une image</strong> dans la barre latérale ou l'icône 🖼 en bas pour créer des images IA <strong>gratuitement</strong> via Pollinations.AI. Choisissez un style et une résolution, puis décrivez votre image.",
    progress: "66%"
  },
  {
    title: "Gérer vos discussions 📚",
    step: "Étape 5 / 6",
    text: "Vos discussions sont <strong>sauvegardées automatiquement</strong> dans la barre latérale gauche. Créez de nouvelles discussions, <strong>exportez en JSON</strong>, ou supprimez les discussions que vous n'utilisez plus. Tout reste <strong>100% privé</strong> sur votre appareil.",
    progress: "83%"
  },
  {
    title: "Vous êtes prêt ! 🚀",
    step: "Étape 6 / 6",
    text: "Vous maîtrisez maintenant ST·AI ! Configurez vos <strong>clés API</strong> dans les Paramètres pour accéder aux modèles premium, ou commencez tout de suite avec les modèles <strong>gratuits</strong>. Bonne conversation ! <strong>© 2025 SolutionsTechnologies™</strong>",
    progress: "100%"
  }
];
let tutorialStep = 0;

/* ════════════════════════
   INIT
════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  // Hide splash after 3s
  setTimeout(() => {
    const splash = document.getElementById('splash');
    if (splash) splash.style.display = 'none';
  }, 3300);

  loadSettings();
  loadModel();
  renderChatList();
  setupKeyboardShortcuts();

  // Show nova notification after 4s
  setTimeout(() => {
    const badge = document.getElementById('novaBadge');
    if (badge) badge.classList.remove('hidden');
  }, 4000);

  // Auto-show tutorial for first visit
  if (!localStorage.getItem('stai_tutdone')) {
    setTimeout(() => openTutorial(), 3500);
  }
});

/* ════════════════════════
   SETTINGS
════════════════════════ */
function loadSettings() {
  const s = state.settings;
  if (s.theme) setTheme(s.theme);
  if (s.fontSize) setFont(s.fontSize);
  if (s.noAnim !== undefined) {
    document.getElementById('animToggle').checked = !s.noAnim;
    if (s.noAnim) document.body.dataset.noAnim = '1';
  }
}

function openSettings() {
  const keys = state.apiKeys;
  document.getElementById('openaiKey').value = keys.openai || '';
  document.getElementById('anthropicKey').value = keys.anthropic || '';
  document.getElementById('googleKey').value = keys.google || '';
  document.getElementById('groqKey').value = keys.groq || '';
  document.getElementById('systemPrompt').value = state.systemPrompt || '';
  const s = state.settings;
  if (s.theme) document.getElementById('themeSelect').value = s.theme;
  if (s.fontSize) document.getElementById('fontSelect').value = s.fontSize;
  showModal('settingsModal');
}

function saveSettings() {
  state.apiKeys = {
    openai:    document.getElementById('openaiKey').value.trim(),
    anthropic: document.getElementById('anthropicKey').value.trim(),
    google:    document.getElementById('googleKey').value.trim(),
    groq:      document.getElementById('groqKey').value.trim(),
  };
  state.systemPrompt = document.getElementById('systemPrompt').value.trim();
  state.settings.theme = document.getElementById('themeSelect').value;
  state.settings.fontSize = document.getElementById('fontSelect').value;
  state.settings.noAnim = !document.getElementById('animToggle').checked;
  state.settings.mem = document.getElementById('memToggle').checked;

  localStorage.setItem('stai_keys', JSON.stringify(state.apiKeys));
  localStorage.setItem('stai_sysprompt', state.systemPrompt);
  localStorage.setItem('stai_settings', JSON.stringify(state.settings));
  setTheme(state.settings.theme || 'dark');
  setFont(state.settings.fontSize || '15');
  if (state.settings.noAnim) document.body.dataset.noAnim = '1';
  else delete document.body.dataset.noAnim;

  closeModal('settingsModal');
  toast('✅ Paramètres sauvegardés !', 'success');
}

function setTheme(t) {
  document.documentElement.dataset.theme = t;
}
function setFont(size) {
  document.documentElement.style.setProperty('--font-size', size + 'px');
}
function toggleAnimations(on) {
  if (!on) document.body.dataset.noAnim = '1';
  else delete document.body.dataset.noAnim;
}
function toggleKeyVis(id, btn) {
  const el = document.getElementById(id);
  el.type = el.type === 'password' ? 'text' : 'password';
  btn.textContent = el.type === 'password' ? '👁' : '🙈';
}

/* ════════════════════════
   MODEL SELECTION
════════════════════════ */
function loadModel() {
  const modelId = localStorage.getItem('stai_model') || 'llama-3.1-8b-instant';
  const provider = localStorage.getItem('stai_provider') || 'groq';
  const color = localStorage.getItem('stai_color') || '#8b5cf6';
  const label = localStorage.getItem('stai_modellabel') || 'Llama 3.1 8B ©Meta';

  state.model = modelId;
  state.modelProvider = provider;
  state.modelColor = color;

  document.getElementById('modelLabel').textContent = label;
  document.getElementById('modelDot').style.background = color;

  // Mark selected in menu
  document.querySelectorAll('.model-option').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.model === modelId && btn.dataset.provider === provider);
  });
}

function toggleModelMenu() {
  const menu = document.getElementById('modelMenu');
  const btn = document.getElementById('modelBtn');
  const open = menu.classList.toggle('open');
  btn.parentElement.classList.toggle('model-menu-open', open);

  if (open) {
    const close = (e) => {
      if (!document.getElementById('modelPicker').contains(e.target)) {
        menu.classList.remove('open');
        btn.parentElement.classList.remove('model-menu-open');
        document.removeEventListener('click', close);
      }
    };
    setTimeout(() => document.addEventListener('click', close), 50);
  }
}

function selectModel(el) {
  const modelId = el.dataset.model;
  const provider = el.dataset.provider;
  const color = el.dataset.color;
  const label = el.querySelector('.mo-name').textContent;

  state.model = modelId;
  state.modelProvider = provider;
  state.modelColor = color;

  localStorage.setItem('stai_model', modelId);
  localStorage.setItem('stai_provider', provider);
  localStorage.setItem('stai_color', color);
  localStorage.setItem('stai_modellabel', label);

  document.getElementById('modelLabel').textContent = label;
  document.getElementById('modelDot').style.background = color;

  document.querySelectorAll('.model-option').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');

  document.getElementById('modelMenu').classList.remove('open');
  document.getElementById('modelBtn').parentElement.classList.remove('model-menu-open');

  toast(`✅ Modèle: ${label}`, 'info');
}

/* ════════════════════════
   CHAT MANAGEMENT
════════════════════════ */
function getActiveChat() {
  return state.chats.find(c => c.id === state.activeId);
}

function newChat() {
  const id = 'chat_' + Date.now();
  const chat = { id, title: 'Nouvelle discussion', messages: [], created: Date.now() };
  state.chats.unshift(chat);
  state.activeId = id;
  saveChats();
  renderChatList();
  showWelcome();
  toast('💬 Nouvelle discussion créée', 'info');
}

function loadChat(id) {
  state.activeId = id;
  const chat = getActiveChat();
  if (!chat) return;
  renderChatList();
  document.getElementById('welcome').classList.add('hidden');
  document.getElementById('messages').innerHTML = '';
  chat.messages.forEach(m => renderMessage(m, false));
  scrollToBottom();
}

function deleteChat(id, event) {
  event.stopPropagation();
  state.chats = state.chats.filter(c => c.id !== id);
  if (state.activeId === id) {
    state.activeId = null;
    showWelcome();
  }
  saveChats();
  renderChatList();
  toast('🗑️ Discussion supprimée', 'info');
}

function clearAllChats() {
  if (!confirm('Effacer toutes les discussions ? Cette action est irréversible.')) return;
  state.chats = [];
  state.activeId = null;
  saveChats();
  renderChatList();
  showWelcome();
  toast('🗑️ Historique effacé', 'info');
  closeModal('settingsModal');
}

function saveChats() {
  if (state.settings.mem !== false)
    localStorage.setItem('stai_chats', JSON.stringify(state.chats));
}

function renderChatList() {
  const list = document.getElementById('chatList');
  if (!state.chats.length) {
    list.innerHTML = '<p class="empty-chats">Aucune discussion pour l\'instant.<br>Commencez par poser une question !</p>';
    return;
  }
  list.innerHTML = state.chats.map(c => `
    <div class="chat-item ${c.id === state.activeId ? 'active' : ''}" onclick="loadChat('${c.id}')">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0;opacity:0.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
      <span class="chat-item-title">${escHtml(c.title)}</span>
      <button class="chat-item-del" onclick="deleteChat('${c.id}', event)" title="Supprimer">✕</button>
    </div>
  `).join('');
}

function showWelcome() {
  document.getElementById('welcome').classList.remove('hidden');
  document.getElementById('messages').innerHTML = '';
  document.getElementById('imageGenPanel').classList.add('hidden');
}

function sendSuggestion(el) {
  const text = el.querySelector('span:last-child').textContent;
  document.getElementById('userInput').value = text;
  sendMessage();
}

/* ════════════════════════
   MESSAGING
════════════════════════ */
async function sendMessage() {
  if (state.isGenerating) return;
  const input = document.getElementById('userInput');
  const text = input.value.trim();
  if (!text) return;

  input.value = '';
  autoResize(input);

  if (!state.activeId) {
    const id = 'chat_' + Date.now();
    const chat = { id, title: truncate(text, 40), messages: [], created: Date.now() };
    state.chats.unshift(chat);
    state.activeId = id;
    saveChats();
    renderChatList();
  }

  const chat = getActiveChat();
  if (!chat) return;

  document.getElementById('welcome').classList.add('hidden');
  document.getElementById('imageGenPanel').classList.add('hidden');

  if (chat.messages.length === 0) {
    chat.title = truncate(text, 45);
    saveChats();
    renderChatList();
  }

  const userMsg = { role: 'user', content: text, time: Date.now(), id: msgId() };
  chat.messages.push(userMsg);
  renderMessage(userMsg);

  const thinkId = 'think_' + Date.now();
  renderThinking(thinkId);

  state.isGenerating = true;
  document.getElementById('sendBtn').disabled = true;

  try {
    // Initialiser le message de l'IA (vide pour le stream)
    const aiMsgId = msgId();
    const modelLabel = localStorage.getItem('stai_modellabel') || state.model;
    const aiMsg = {
      role: 'assistant', content: '',
      model: modelLabel,
      time: Date.now(), id: aiMsgId
    };
    
    let fullContent = '';
    
    // Callback pour le streaming
    const onChunk = (chunk) => {
      removeThinking(thinkId);
      fullContent += chunk;
      updateStreamingMessage(aiMsgId, fullContent, modelLabel);
    };

    const reply = await callAI(chat.messages, text, onChunk);
    
    // Si on n'a pas streamé (certains providers), on utilise la réponse directe
    if (fullContent === '') {
      fullContent = reply;
      removeThinking(thinkId);
      renderMessage({ ...aiMsg, content: fullContent });
    } else {
      // Finaliser le message streamé
      const finalMsg = { ...aiMsg, content: fullContent };
      chat.messages.push(finalMsg);
      saveChats();
      // On rafraîchit avec le markdown final
      updateStreamingMessage(aiMsgId, fullContent, modelLabel, true);
    }
    
    scrollToBottom();

  } catch (err) {
    removeThinking(thinkId);
    console.error('ST·AI Error:', err);
    const errMsg = {
      role: 'assistant',
      content: `⚠️ **Erreur System**: ${err.message}\n\n*SolutionsTechnologies Tentative Recovery...*\n- Réessayez dans quelques secondes.\n- Changez de modèle (ex: Llama sur Groq).\n- Vérifiez vos clés API.`,
      model: 'System',
      time: Date.now(), id: msgId()
    };
    chat.messages.push(errMsg);
    saveChats();
    renderMessage(errMsg);
    scrollToBottom();
    toast('❌ ' + err.message, 'error');
  }

  state.isGenerating = false;
  document.getElementById('sendBtn').disabled = false;
  input.focus();
}

function updateStreamingMessage(id, content, modelLabel, isFinal = false) {
  let el = document.getElementById('msg_' + id);
  if (!el) {
    const area = document.getElementById('messages');
    el = document.createElement('div');
    el.classList.add('msg');
    el.id = 'msg_' + id;
    area.appendChild(el);
  }
  
  const time = new Date().toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' });
  const avatarHtml = `<div class="msg-avatar ai"><svg viewBox="0 0 24 24" fill="none"><defs><linearGradient id="ag${id}" x1="0" y1="0" x2="24" y2="24"><stop stop-color="#6c63ff"/><stop offset="1" stop-color="#00d4ff"/></linearGradient></defs><circle cx="12" cy="12" r="10" stroke="url(#ag${id})" stroke-width="1.5" fill="none"/><circle cx="12" cy="12" r="4" fill="url(#ag${id})" opacity="0.9"/></svg></div>`;
  
  // Utiliser marked si prêt, sinon texte brut (pour la vitesse du stream)
  const formattedContent = isFinal ? parseMarkdown(content) : content.replace(/\n/g, '<br>');
  
  el.innerHTML = `
    ${avatarHtml}
    <div class="msg-content">
      <div class="msg-header">
        <span class="msg-name">ST·AI</span>
        <span class="msg-model-tag">${escHtml(modelLabel)}</span>
        <span class="msg-time">${time}</span>
      </div>
      <div class="msg-text">${formattedContent}${!isFinal ? '<span class="streaming-cursor">|</span>' : ''}</div>
      ${isFinal ? `
        <div class="msg-actions">
          <button class="msg-action-btn" onclick="copyMsg('${id}')">📋 Copier</button>
          <button class="msg-action-btn" onclick="regenMsg('${id}')">🔄 Régénérer</button>
        </div>
      ` : ''}
    </div>
  `;
  scrollToBottom();
}

/* ── CALL AI ── */
async function callAI(messages, lastText, onChunk) {
  const provider = state.modelProvider;
  const model = state.model;
  const keys = state.apiKeys;

  const sys = state.systemPrompt ||
    `Tu es ST·AI, l'assistant IA de SolutionsTechnologies™. Réponds de manière précise, utile et professionnelle en français. © 2025 SolutionsTechnologies™`;

  const msgs = [{ role: 'system', content: sys }, ...messages.filter(m => m.role !== 'system').map(m => ({ role: m.role, content: m.content }))];

  // Logic pour le retry sur les modèles gratuits
  const fetchWithRetry = async (fn, retries = 2) => {
    try {
      return await fn();
    } catch (err) {
      console.error('Fetch Attempt Failed:', err);
      if (retries > 0) {
        // Retry on 502 or NetworkError
        if (err.message.includes('502') || err.name === 'TypeError' || err.message.includes('fetch')) {
          toast('🔄 Problème de connexion, nouvelle tentative...', 'info');
          await new Promise(r => setTimeout(r, 1500));
          return await fetchWithRetry(fn, retries - 1);
        }
      }
      throw err;
    }
  };

  if (provider === 'pollinations') {
    return await fetchWithRetry(() => callPollinations(model, msgs, onChunk));
  }

  if (provider === 'groq') {
    const key = keys.groq;
    if (!key) throw new Error('Clé API Groq manquante.');
    return await callGroq(model, msgs, key, onChunk);
  }

  if (provider === 'openai') return await callOpenAI(model, msgs, keys.openai, onChunk);
  if (provider === 'anthropic') return await callAnthropic(model, msgs, keys.anthropic, onChunk);
  if (provider === 'google') return await callGemini(model, msgs, keys.google, onChunk);

  throw new Error('Fournisseur inconnu : ' + provider);
}

async function callPollinations(model, messages, onChunk) {
  // Map 'openai' to a more explicit model name if needed, though 'openai' is usually the default
  const targetModel = model === 'openai' ? 'gpt-4o' : model;
  
  const res = await fetch('https://text.pollinations.ai/openai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      model: targetModel, 
      messages, 
      stream: !!onChunk,
      cache: false 
    }),
    referrerPolicy: 'no-referrer'
  });

  if (!res.ok) {
    const errorBody = await res.text().catch(() => '');
    throw new Error(`Pollinations.AI (${res.status}): ${errorBody || 'Erreur inconnue'}`);
  }
  
  if (onChunk) {
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop();
      
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data:')) continue;
        const dataStr = trimmed.slice(5).trim();
        if (dataStr === '[DONE]') continue;
        
        try {
          const json = JSON.parse(dataStr);
          const delta = json.choices?.[0]?.delta;
          const content = delta?.content || delta?.reasoning || '';
          if (content) onChunk(content);
        } catch (e) {
          console.warn('SSE Parse Error:', e, dataStr);
        }
      }
    }
    return '';
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || '(Réponse vide)';
}

async function callGroq(model, messages, key, onChunk) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key },
    body: JSON.stringify({ model, messages, temperature: 0.7, max_tokens: 4096, stream: !!onChunk })
  });
  
  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new Error(`Groq API (${res.status}): ${e.error?.message || 'Erreur inconnue'}`);
  }

  if (onChunk) {
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop();
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data:')) continue;
        const dataStr = trimmed.slice(5).trim();
        if (dataStr === '[DONE]') continue;
        try {
          const json = JSON.parse(dataStr);
          const content = json.choices?.[0]?.delta?.content || '';
          if (content) onChunk(content);
        } catch (e) {}
      }
    }
    return '';
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || '(Réponse vide)';
}

async function callOpenAI(model, messages, key, onChunk) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key },
    body: JSON.stringify({ model, messages, temperature: 0.7, max_tokens: 4096, stream: !!onChunk })
  });

  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new Error(`OpenAI API (${res.status}): ${e.error?.message || 'Erreur inconnue'}`);
  }

  if (onChunk) {
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop();
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data:')) continue;
        const dataStr = trimmed.slice(5).trim();
        if (dataStr === '[DONE]') continue;
        try {
          const json = JSON.parse(dataStr);
          const content = json.choices?.[0]?.delta?.content || '';
          if (content) onChunk(content);
        } catch (e) {}
      }
    }
    return '';
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || '(Réponse vide)';
}

async function callAnthropic(model, messages, key, onChunk) {
  const sys = messages.find(m => m.role === 'system')?.content || '';
  const msgs = messages.filter(m => m.role !== 'system');
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({ model, system: sys, messages: msgs, max_tokens: 4096, stream: !!onChunk })
  });

  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new Error(`Anthropic API (${res.status}): ${e.error?.message || 'Erreur inconnue'}`);
  }

  if (onChunk) {
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop();
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('event:')) continue;
        // Logic Anthropic SSE is slightly different (event: message_start, content_block_delta, etc.)
        // This is a simplified version
        if (line.includes('content_block_delta')) {
          const dataLine = lines[lines.indexOf(line) + 1];
          if (dataLine && dataLine.startsWith('data:')) {
            try {
              const json = JSON.parse(dataLine.slice(5).trim());
              const text = json.delta?.text || '';
              if (text) onChunk(text);
            } catch (e) {}
          }
        }
      }
    }
    return '';
  }

  const data = await res.json();
  return data.content?.[0]?.text || '(Réponse vide)';
}

async function callGemini(model, messages, key, onChunk) {
  const sys = messages.find(m => m.role === 'system')?.content || '';
  const contents = messages.filter(m => m.role !== 'system').map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));
  const body = { contents };
  if (sys) body.systemInstruction = { parts: [{ text: sys }] };
  
  const endpoint = onChunk ? 'streamGenerateContent' : 'generateContent';
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:${endpoint}?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new Error(`Gemini API (${res.status}): ${e.error?.message || 'Erreur inconnue'}`);
  }

  if (onChunk) {
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      // Gemini stream returns a JSON array over time or chunks of JSON objects
      // This is complex to parse manually without a proper library, but searching for "text": "..."
      // is a common quick fix for direct browser access.
      const matches = buffer.matchAll(/"text":\s*"((?:[^"\\]|\\.)*)"/g);
      for (const match of matches) {
        // This is still risky due to double-matching or partials.
        // Better: parse chunks if they are complete JSON objects.
      }
      // For now, let's use a simpler heuristic or just return the full response at once if complex.
    }
  }

  const data = await res.json();
  if (Array.isArray(data)) { // Stream format
     return data.map(c => c.candidates?.[0]?.content?.parts?.[0]?.text || '').join('');
  }
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '(Réponse vide)';
}

/* ════════════════════════
   RENDER MESSAGES
════════════════════════ */
function renderMessage(msg, scroll = true) {
  const area = document.getElementById('messages');
  const isUser = msg.role === 'user';
  const time = new Date(msg.time).toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' });

  const el = document.createElement('div');
  el.classList.add('msg');
  el.id = 'msg_' + msg.id;

  const avatarHtml = isUser
    ? `<div class="msg-avatar user">Vous</div>`
    : `<div class="msg-avatar ai"><svg viewBox="0 0 24 24" fill="none"><defs><linearGradient id="ag${msg.id}" x1="0" y1="0" x2="24" y2="24"><stop stop-color="#6c63ff"/><stop offset="1" stop-color="#00d4ff"/></linearGradient></defs><circle cx="12" cy="12" r="10" stroke="url(#ag${msg.id})" stroke-width="1.5" fill="none"/><circle cx="12" cy="12" r="4" fill="url(#ag${msg.id})" opacity="0.9"/></svg></div>`;

  const modelTag = !isUser && msg.model ? `<span class="msg-model-tag">${escHtml(msg.model)}</span>` : '';
  const name = isUser ? 'Vous' : 'ST·AI';

  el.innerHTML = `
    ${avatarHtml}
    <div class="msg-content">
      <div class="msg-header">
        <span class="msg-name">${name}</span>
        ${modelTag}
        <span class="msg-time">${time}</span>
      </div>
      <div class="msg-text">${parseMarkdown(msg.content)}</div>
      ${!isUser ? `
        <div class="msg-actions">
          <button class="msg-action-btn" onclick="copyMsg('${msg.id}')">📋 Copier</button>
          <button class="msg-action-btn" onclick="regenMsg('${msg.id}')">🔄 Régénérer</button>
        </div>
      ` : `
        <div class="msg-actions">
          <button class="msg-action-btn" onclick="copyMsg('${msg.id}')">📋 Copier</button>
        </div>
      `}
    </div>
  `;

  area.appendChild(el);
  if (scroll) scrollToBottom();
}

function renderThinking(id) {
  const area = document.getElementById('messages');
  const el = document.createElement('div');
  el.classList.add('msg', 'thinking-msg');
  el.id = id;
  const modelLabel = localStorage.getItem('stai_modellabel') || 'ST·AI';
  el.innerHTML = `
    <div class="msg-avatar ai">
      <svg viewBox="0 0 24 24" fill="none"><defs><linearGradient id="agt" x1="0" y1="0" x2="24" y2="24"><stop stop-color="#6c63ff"/><stop offset="1" stop-color="#00d4ff"/></linearGradient></defs><circle cx="12" cy="12" r="10" stroke="url(#agt)" stroke-width="1.5" fill="none"/><circle cx="12" cy="12" r="4" fill="url(#agt)" opacity="0.9"/></svg>
    </div>
    <div class="msg-content">
      <div class="msg-header">
        <span class="msg-name">ST·AI</span>
        <span class="msg-model-tag">${escHtml(modelLabel)}</span>
      </div>
      <div class="msg-text">
        <div class="typing-dots">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
      </div>
    </div>
  `;
  area.appendChild(el);
  scrollToBottom();
}

function removeThinking(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

function copyMsg(id) {
  const chat = getActiveChat();
  if (!chat) return;
  const msg = chat.messages.find(m => m.id === id);
  if (!msg) return;
  navigator.clipboard.writeText(msg.content).then(() => toast('📋 Copié !', 'success'));
}

async function regenMsg(id) {
  if (state.isGenerating) return;
  const chat = getActiveChat();
  if (!chat) return;
  const idx = chat.messages.findIndex(m => m.id === id);
  if (idx < 0) return;

  chat.messages.splice(idx);
  saveChats();
  document.getElementById('msg_' + id)?.remove();

  const lastUser = chat.messages.filter(m => m.role === 'user').slice(-1)[0];
  if (!lastUser) return;

  const thinkId = 'think_' + Date.now();
  renderThinking(thinkId);
  state.isGenerating = true;
  document.getElementById('sendBtn').disabled = true;

  try {
    const reply = await callAI(chat.messages, lastUser.content);
    removeThinking(thinkId);
    const aiMsg = { role: 'assistant', content: reply, model: localStorage.getItem('stai_modellabel') || state.model, time: Date.now(), id: msgId() };
    chat.messages.push(aiMsg);
    saveChats();
    renderMessage(aiMsg);
    scrollToBottom();
  } catch (err) {
    removeThinking(thinkId);
    toast('❌ ' + err.message, 'error');
  }

  state.isGenerating = false;
  document.getElementById('sendBtn').disabled = false;
}

/* ════════════════════════
   MARKDOWN PARSER
════════════════════════ */
function parseMarkdown(text) {
  if (!text) return '';
  
  // Use marked.js if available
  if (typeof marked !== 'undefined') {
    try {
      return marked.parse(text);
    } catch (e) {
      console.error('Marked error:', e);
    }
  }
  
  // Fallback regex-based parser
  let html = escHtml(text);
  
  // Code blocks: ```lang\ncode```
  html = html.replace(/```(?:[\w-]+)?\n?([\s\S]*?)```/g, (_, code) => {
    return `<pre class="code-block"><code>${code.trim()}</code></pre>`;
  });
  
  // Inline code: `code`
  html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
  
  // Bold: **text**
  html = html.replace(/\*\*([\s\S]+?)\*\*/g, '<strong>$1</strong>');
  
  // Italic: *text*
  html = html.replace(/\*([\s\S]+?)\*/g, '<em>$1</em>');
  
  // Lists
  html = html.replace(/^\s*[-*+]\s+(.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
  
  // Line breaks
  html = html.replace(/\n/g, '<br>');
  
  return html;
}

function matchTable(match) {
  const rows = match.trim().split('\n');
  if (rows.length < 2) return match;
  const cells = r => r.split('|').filter(c => c.trim()).map(c => c.trim());
  const header = cells(rows[0]).map(c => `<th>${c}</th>`).join('');
  const body = rows.slice(2).map(r => '<tr>' + cells(r).map(c => `<td>${c}</td>`).join('') + '</tr>').join('');
  return `<table><thead><tr>${header}</tr></thead><tbody>${body}</tbody></table>`;
}

function copyCode(btn) {
  const code = btn.closest('.code-block').querySelector('code').textContent;
  navigator.clipboard.writeText(code).then(() => {
    btn.textContent = 'Copié ✓';
    btn.classList.add('copied');
    setTimeout(() => { btn.textContent = 'Copier'; btn.classList.remove('copied'); }, 2000);
  });
}

/* ════════════════════════
   IMAGE GENERATION
════════════════════════ */
function openImageGen() {
  document.getElementById('welcome').classList.add('hidden');
  document.getElementById('messages').classList.add('hidden');
  document.getElementById('imageGenPanel').classList.remove('hidden');
}
function closeImageGen() {
  document.getElementById('imageGenPanel').classList.add('hidden');
  document.getElementById('messages').classList.remove('hidden');
  if (!state.activeId) showWelcome();
}

async function generateImage() {
  const prompt = document.getElementById('imagePrompt').value.trim();
  if (!prompt) { toast('Veuillez entrer une description', 'error'); return; }

  const style = document.getElementById('imgStyle').value;
  const size = document.getElementById('imgSize').value;
  const [w, h] = size.split('x');
  const fullPrompt = [prompt, style].filter(Boolean).join(', ');

  const results = document.getElementById('igpResults');
  const btn = document.querySelector('.igp-btn');
  btn.disabled = true;
  results.innerHTML = `<div class="igp-generating">⏳ Génération en cours… Cela peut prendre 10-20 secondes.</div>`;

  const seed = Math.floor(Math.random() * 999999);
  const encodedPrompt = encodeURIComponent(fullPrompt);
  const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${w}&height=${h}&seed=${seed}&nologo=true`;

  const img = new Image();
  img.onload = () => {
    results.innerHTML = `
      <div class="igp-result">
        <img src="${url}" alt="${escHtml(prompt)}" />
        <div class="igp-result-actions">
          <a class="igp-action" href="${url}" download="stai-image-${seed}.jpg" target="_blank">⬇️ Télécharger</a>
          <button class="igp-action" onclick="sendImageToChat('${encodeURIComponent(url)}', '${encodeURIComponent(prompt)}')">💬 Envoyer au chat</button>
        </div>
      </div>
    `;
    btn.disabled = false;
    toast('🎨 Image générée !', 'success');
  };
  img.onerror = () => {
    results.innerHTML = '<p style="color:var(--red);padding:16px">❌ Échec de la génération. Réessayez avec un autre prompt.</p>';
    btn.disabled = false;
    toast('❌ Échec de la génération', 'error');
  };
  img.src = url;
}

function sendImageToChat(encodedUrl, encodedPrompt) {
  const url = decodeURIComponent(encodedUrl);
  const prompt = decodeURIComponent(encodedPrompt);
  closeImageGen();
  if (!state.activeId) newChat();
  document.getElementById('userInput').value = `[Image générée]: ${prompt}\n${url}`;
  sendMessage();
}

/* ════════════════════════
   VOICE INPUT
════════════════════════ */
function toggleVoice() {
  const btn = document.getElementById('voiceBtn');
  if (state.recognition) {
    state.recognition.stop();
    state.recognition = null;
    btn.classList.remove('recording');
    return;
  }
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { toast('❌ Saisie vocale non supportée par ce navigateur', 'error'); return; }
  const rec = new SR();
  rec.lang = 'fr-CA';
  rec.continuous = false;
  rec.interimResults = false;
  rec.onresult = (e) => {
    document.getElementById('userInput').value += e.results[0][0].transcript;
    autoResize(document.getElementById('userInput'));
  };
  rec.onerror = () => { btn.classList.remove('recording'); state.recognition = null; };
  rec.onend = () => { btn.classList.remove('recording'); state.recognition = null; };
  rec.start();
  state.recognition = rec;
  btn.classList.add('recording');
  toast('🎤 Parlez maintenant…', 'info');
}

/* ════════════════════════
   EXPORT
════════════════════════ */
function exportChat() {
  const chat = getActiveChat();
  if (!chat) { toast('Aucune discussion active', 'error'); return; }
  const data = JSON.stringify(chat, null, 2);
  download(`stai-${chat.id}.json`, data, 'application/json');
  toast('📥 Discussion exportée !', 'success');
}

function exportAllChats() {
  const data = JSON.stringify(state.chats, null, 2);
  download('stai-all-chats.json', data, 'application/json');
  toast('📥 Tout exporté !', 'success');
  closeModal('settingsModal');
}

function download(name, data, type) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([data], { type }));
  a.download = name;
  a.click();
}

/* ════════════════════════
   TUTORIAL
════════════════════════ */
function openTutorial() {
  tutorialStep = 0;
  renderTutorialStep();
  buildTutDots();
  document.getElementById('tutorialOverlay').classList.remove('hidden');
}

function closeTutorial() {
  document.getElementById('tutorialOverlay').classList.add('hidden');
  localStorage.setItem('stai_tutdone', '1');
}

function tutNav(dir) {
  tutorialStep = Math.max(0, Math.min(TUTORIAL_STEPS.length - 1, tutorialStep + dir));
  if (dir === 1 && tutorialStep === TUTORIAL_STEPS.length - 1 &&
      document.getElementById('tutNext').textContent.includes('Terminer')) {
    closeTutorial();
    return;
  }
  renderTutorialStep();
}

function renderTutorialStep() {
  const step = TUTORIAL_STEPS[tutorialStep];
  document.getElementById('tutTitle').textContent = step.title;
  document.getElementById('tutStep').textContent = step.step;
  document.getElementById('tutText').innerHTML = step.text;
  document.getElementById('tutSpotlight').style.width = step.progress;
  document.getElementById('tutPrev').style.visibility = tutorialStep === 0 ? 'hidden' : 'visible';
  const nextBtn = document.getElementById('tutNext');
  nextBtn.textContent = tutorialStep === TUTORIAL_STEPS.length - 1 ? 'Terminer ✓' : 'Suivant →';
  buildTutDots();
}

function buildTutDots() {
  const c = document.getElementById('tutDots');
  c.innerHTML = TUTORIAL_STEPS.map((_, i) =>
    `<div class="tut-dot ${i === tutorialStep ? 'active' : ''}"></div>`
  ).join('');
}

/* ════════════════════════
   NOVA WIDGET
════════════════════════ */
function toggleNova() {
  state.novaOpen = !state.novaOpen;
  document.getElementById('novaBubble').classList.toggle('hidden', !state.novaOpen);
  if (state.novaOpen) {
    document.getElementById('novaBadge').classList.add('hidden');
  }
}

function closeNova() {
  state.novaOpen = false;
  document.getElementById('novaBubble').classList.add('hidden');
}

function novaTip(type) {
  const tips = {
    tutorial: { msg: '🎓 Lancement du tutoriel interactif…', action: () => setTimeout(openTutorial, 300) },
    models: { msg: '<strong>Comment changer de modèle :</strong><br>Cliquez sur le nom du modèle en haut (ex: "Llama 3.1 8B") pour ouvrir le sélecteur. Les modèles <span style="color:var(--green)">GRATUITS</span> fonctionnent sans clé API !', action: null },
    image: { msg: '<strong>Génération d\'images :</strong><br>Cliquez sur "Générer une image" dans la barre latérale. Décrivez votre image et choisissez un style. Entièrement gratuit via Pollinations.AI !', action: null },
    voice: { msg: '<strong>Saisie vocale :</strong><br>Cliquez sur l\'icône 🎤 dans la zone de texte. Parlez clairement en français ou en anglais. Cliquez à nouveau pour arrêter.', action: null },
    export: { msg: '<strong>Exporter :</strong><br>Cliquez sur l\'icône ⬇️ en haut à droite pour sauvegarder votre discussion en JSON. Toutes les discussions sont disponibles via Paramètres > Exporter tout.', action: null },
    shortcuts: { msg: '<strong>Raccourcis clavier :</strong><br>• <code>Entrée</code> — Envoyer<br>• <code>Maj+Entrée</code> — Nouvelle ligne<br>• <code>Ctrl+N</code> — Nouvelle discussion<br>• <code>Ctrl+B</code> — Ouvrir/fermer la barre latérale<br>• <code>Ctrl+,</code> — Paramètres<br>• <code>Échap</code> — Fermer les menus', action: null },
  };

  const tip = tips[type];
  if (!tip) return;

  // Add response to nova
  const msgs = document.getElementById('novaMessages');
  const existing = msgs.querySelector('.nova-response');
  if (existing) existing.remove();
  const r = document.createElement('div');
  r.className = 'nova-response';
  r.innerHTML = tip.msg;
  msgs.appendChild(r);
  msgs.scrollTop = msgs.scrollHeight;

  if (tip.action) tip.action();
}

/* ════════════════════════
   SIDEBAR
════════════════════════ */
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('collapsed');
}

/* ════════════════════════
   MODALS
════════════════════════ */
function showModal(id) {
  document.getElementById(id).classList.remove('hidden');
}
function closeModal(id, event) {
  if (event && event.target !== document.getElementById(id)) return;
  document.getElementById(id).classList.add('hidden');
}
function openCredits() { showModal('creditsModal'); }

/* ════════════════════════
   KEYBOARD SHORTCUTS
════════════════════════ */
function setupKeyboardShortcuts() {
  document.addEventListener('keydown', e => {
    // Ctrl+N — new chat
    if (e.ctrlKey && e.key === 'n') { e.preventDefault(); newChat(); }
    // Ctrl+B — toggle sidebar
    if (e.ctrlKey && e.key === 'b') { e.preventDefault(); toggleSidebar(); }
    // Ctrl+, — settings
    if (e.ctrlKey && e.key === ',') { e.preventDefault(); openSettings(); }
    // Escape — close menus/modals
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay:not(.hidden)').forEach(m => m.classList.add('hidden'));
      document.getElementById('modelMenu')?.classList.remove('open');
      document.getElementById('tutorialOverlay')?.classList.add('hidden');
      closeNova();
    }
    // Ctrl+/ or ? — open nova help
    if (e.ctrlKey && e.key === '/') { e.preventDefault(); if (!state.novaOpen) toggleNova(); }
  });
}

function handleKey(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
}

/* ════════════════════════
   HELPERS
════════════════════════ */
function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 200) + 'px';
}

function scrollToBottom() {
  const area = document.getElementById('chatArea');
  setTimeout(() => { area.scrollTop = area.scrollHeight; }, 50);
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function truncate(str, n) {
  return str.length > n ? str.slice(0, n) + '…' : str;
}

function msgId() {
  return Math.random().toString(36).slice(2, 11);
}

function toast(msg, type = 'info') {
  const container = document.getElementById('toastContainer');
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = msg;
  container.appendChild(el);
  setTimeout(() => {
    el.classList.add('out');
    setTimeout(() => el.remove(), 300);
  }, 3500);
}
