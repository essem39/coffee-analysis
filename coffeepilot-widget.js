(function() {
  const WORKER_URL = 'https://coffeepilot.esem39.workers.dev';

  const styles = `
    #coffeepilot-widget {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    #coffeepilot-button {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #6F4E37 0%, #8B6F47 100%);
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s;
    }

    #coffeepilot-button:hover {
      transform: scale(1.05);
    }

    #coffeepilot-button svg {
      width: 28px;
      height: 28px;
      fill: white;
    }

    #coffeepilot-chat {
      position: fixed;
      bottom: 90px;
      right: 20px;
      width: 420px;
      max-width: calc(100vw - 40px);
      height: 750px;
      max-height: calc(100vh - 120px);
      background: white;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.12);
      display: none;
      flex-direction: column;
      overflow: hidden;
    }

    #coffeepilot-chat.open {
      display: flex;
    }

    .chat-header {
      background: linear-gradient(135deg, #6F4E37 0%, #8B6F47 100%);
      color: white;
      padding: 16px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .chat-header h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
    }

    .chat-close {
      background: none;
      border: none;
      color: white;
      font-size: 24px;
      cursor: pointer;
      padding: 0;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 12px;
      background: #f8f9fa;
    }

    .message {
      margin-bottom: 10px;
      display: flex;
      gap: 8px;
    }

    .message.user {
      flex-direction: row-reverse;
    }

    .message-avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: linear-gradient(135deg, #6F4E37 0%, #8B6F47 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 600;
      font-size: 12px;
      flex-shrink: 0;
    }

    .message.user .message-avatar {
      background: #e9ecef;
      color: #495057;
    }

    .message-content {
      max-width: 70%;
      padding: 8px 12px;
      border-radius: 12px;
      background: white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      word-break: break-word;
      font-size: 14px;
      line-height: 1.4;
    }

    .message-content a {
      color: #6F4E37;
      text-decoration: underline;
      font-weight: 500;
    }

    .message-content a:hover {
      color: #8B6F47;
    }

    .search-button {
      display: inline-block;
      padding: 10px 20px;
      background: linear-gradient(135deg, #6F4E37 0%, #8B6F47 100%);
      color: white !important;
      text-decoration: none !important;
      border-radius: 20px;
      font-weight: 600;
      font-size: 14px;
      transition: transform 0.2s, box-shadow 0.2s;
      box-shadow: 0 3px 10px rgba(102, 126, 234, 0.3);
      margin: 5px 0;
    }

    .search-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
    }

    .tip-block {
      margin-top: 10px;
      padding: 8px 12px;
      background: #fff3cd;
      border-left: 3px solid #ffc107;
      border-radius: 6px;
      font-size: 14px;
      line-height: 1.4;
    }

    .help-block {
      margin-top: 8px;
      padding: 8px 12px;
      background: #e3f2fd;
      border-left: 3px solid #2196f3;
      border-radius: 6px;
      font-size: 14px;
      line-height: 1.4;
    }

    .message.user .message-content {
      background: linear-gradient(135deg, #6F4E37 0%, #8B6F47 100%);
      color: white;
    }

    .message.user .message-content a {
      color: white;
      text-decoration: underline;
    }

    .message.user .message-content a:hover {
      opacity: 0.8;
    }

    .message.typing .message-content {
      background: white;
      padding: 16px;
    }

    .typing-dots {
      display: flex;
      gap: 6px;
    }

    .typing-dots span {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #6F4E37;
      animation: typing 1.4s infinite;
    }

    .typing-dots span:nth-child(2) {
      animation-delay: 0.2s;
    }

    .typing-dots span:nth-child(3) {
      animation-delay: 0.4s;
    }

    @keyframes typing {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-10px); }
    }

    .chat-input {
      padding: 16px;
      background: white;
      border-top: 1px solid #e9ecef;
      display: flex;
      gap: 8px;
    }

    #voice-button {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: 2px solid #6F4E37;
      background: white;
      color: #6F4E37;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      flex-shrink: 0;
    }

    #voice-button:hover {
      background: #f8f9fa;
    }

    #voice-button.recording {
      background: #dc3545;
      border-color: #dc3545;
      color: white;
      animation: pulse 1.5s infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    #voice-button svg {
      width: 20px;
      height: 20px;
      fill: currentColor;
    }

    .chat-input input {
      flex: 1;
      padding: 10px 14px;
      border: 1px solid #e9ecef;
      border-radius: 24px;
      font-size: 13px;
      outline: none;
      transition: border-color 0.2s;
    }

    .chat-input input:focus {
      border-color: #6F4E37;
    }

    #send-button {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: none;
      background: linear-gradient(135deg, #6F4E37 0%, #8B6F47 100%);
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s;
      flex-shrink: 0;
    }

    #send-button:hover:not(:disabled) {
      transform: scale(1.05);
    }

    #send-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    #send-button svg {
      width: 20px;
      height: 20px;
      fill: white;
    }

    @media (max-width: 768px) {
      #coffeepilot-chat {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        width: 100% !important;
        height: 100% !important;
        max-width: 100% !important;
        max-height: 100% !important;
        border-radius: 0 !important;
        margin: 0 !important;
      }

      #coffeepilot-button {
        bottom: 20px;
        right: 20px;
      }
    }
  `;

  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);

  const widget = document.createElement('div');
  widget.id = 'coffeepilot-widget';
  widget.innerHTML = `
    <button id="coffeepilot-button" aria-label="Открыть чат">
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
      </svg>
    </button>
    <div id="coffeepilot-chat">
      <div class="chat-header">
        <h3>✈️ CoffeePilot</h3>
        <button class="chat-close" aria-label="Закрыть чат">×</button>
      </div>
      <div class="chat-messages"></div>
      <div class="chat-input">
        <button id="voice-button" aria-label="Голосовой ввод">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
          </svg>
        </button>
        <input type="text" placeholder="Напишите ваш вопрос..." />
        <button id="send-button" disabled aria-label="Отправить">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(widget);

  const button = document.getElementById('coffeepilot-button');
  const chat = document.getElementById('coffeepilot-chat');
  const closeBtn = chat.querySelector('.chat-close');
  const messagesContainer = chat.querySelector('.chat-messages');
  const input = chat.querySelector('.chat-input input');
  const voiceButton = document.getElementById('voice-button');
  const sendButton = document.getElementById('send-button');

  let conversationHistory = [];

  // Voice input setup
  let recognition = null;
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = 'ru-RU';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      input.value = transcript;
      sendButton.disabled = false;
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      voiceButton.classList.remove('recording');
    };

    recognition.onend = () => {
      voiceButton.classList.remove('recording');
    };
  }

  voiceButton.addEventListener('click', () => {
    if (!recognition) {
      alert('Голосовой ввод не поддерживается вашим браузером');
      return;
    }

    if (voiceButton.classList.contains('recording')) {
      recognition.stop();
    } else {
      recognition.start();
      voiceButton.classList.add('recording');
    }
  });

  button.addEventListener('click', () => {
    chat.classList.toggle('open');
    if (chat.classList.contains('open')) {
      input.focus();
      if (conversationHistory.length === 0) {
        addMessage('bot', 'Привет! Я CoffeePilot, ваш персональный бариста. Помогу подобрать кофе, расскажу о заваривании или найду промокоды. Чем могу помочь? ☕');
      }
    }
  });

  closeBtn.addEventListener('click', () => {
    chat.classList.remove('open');
  });

  input.addEventListener('input', () => {
    sendButton.disabled = !input.value.trim();
  });

  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !sendButton.disabled) {
      sendMessage();
    }
  });

  sendButton.addEventListener('click', sendMessage);

  function addMessage(sender, text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = sender === 'user' ? 'В' : '✈️';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    
    // Check if message contains coffeespecialty.ru URL
    const searchUrlMatch = text.match(/(https:\/\/coffeespecialty\.ru\/[^\s]+)/);
    
    if (searchUrlMatch && sender === 'bot') {
      const url = searchUrlMatch[1];
      
      // Determine button text based on URL
      let buttonText = '☕ Открыть';
      if (url.includes('/shop.html')) buttonText = '☕ Магазин';
      else if (url.includes('/promocodes.html')) buttonText = '🔥 Промокоды';
      else if (url.includes('/specialty-micro-lots')) buttonText = '✨ Микролоты 2025';
      else if (url.includes('/premium-collection.html')) buttonText = '👑 Премиум коллекция';
      else if (url.includes('/grind-guide.html')) buttonText = '📖 Гайд по помолу';
      else if (url.includes('/kak-hranit-kofe')) buttonText = '📦 Как хранить кофе';
      else if (url.includes('/espresso-masterclass')) buttonText = '☕ Мастер-класс эспрессо';
      else if (url.includes('/dekaf-guide')) buttonText = '🌙 Гайд по декафу';
      else if (url.includes('/tea-guide')) buttonText = '🍵 Гайд по чаю';
      else if (url.includes('/budget-barista')) buttonText = '🛠️ Оборудование';
      else if (url.includes('/tasty-partners')) buttonText = '🤝 Tasty Coffee';
      
      // Split text into parts
      const beforeUrl = text.substring(0, searchUrlMatch.index).trim();
      const afterUrl = text.substring(searchUrlMatch.index + url.length).trim();
      
      // Extract "Совет" block if exists
      const tipMatch = afterUrl.match(/💡\s*Совет:([^!?\.]*[!?\.]+)/);
      let mainText = afterUrl;
      let tipText = null;
      let helpText = null;
      
      if (tipMatch) {
        tipText = '💡 Совет:' + tipMatch[1].trim();
        mainText = afterUrl.substring(0, tipMatch.index).trim();
        const afterTip = afterUrl.substring(tipMatch.index + tipMatch[0].length).trim();
        
        // Extract "Могу ли я помочь" block
        const helpMatch = afterTip.match(/Могу ли я помочь.*/);
        if (helpMatch) {
          helpText = helpMatch[0].trim();
        } else if (afterTip) {
          mainText += ' ' + afterTip;
        }
      } else {
        // Try to find "Могу ли я помочь" without tip
        const helpMatch = afterUrl.match(/Могу ли я помочь.*/);
        if (helpMatch) {
          helpText = helpMatch[0].trim();
          mainText = afterUrl.substring(0, helpMatch.index).trim();
        }
      }
      
      // Text before URL
      if (beforeUrl) {
        const beforeNode = document.createElement('p');
        beforeNode.style.margin = '0 0 10px 0';
        beforeNode.textContent = beforeUrl;
        content.appendChild(beforeNode);
      }
      
      // Button
      const button = document.createElement('a');
      button.href = url;
      button.target = '_blank';
      button.rel = 'noopener noreferrer';
      button.className = 'search-button';
      button.innerHTML = buttonText;
      content.appendChild(button);
      
      // Main text after URL
      if (mainText) {
        const mainNode = document.createElement('p');
        mainNode.style.margin = '10px 0 0 0';
        mainNode.textContent = mainText;
        content.appendChild(mainNode);
      }
      
      // Tip block
      if (tipText) {
        const tipNode = document.createElement('div');
        tipNode.className = 'tip-block';
        tipNode.textContent = tipText;
        content.appendChild(tipNode);
      }
      
      // Help block
      if (helpText) {
        const helpNode = document.createElement('div');
        helpNode.className = 'help-block';
        helpNode.textContent = helpText;
        content.appendChild(helpNode);
      }
    } else {
      // Regular message
      content.textContent = text;
    }
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function showTyping() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message typing';
    typingDiv.innerHTML = `
      <div class="message-avatar">✈️</div>
      <div class="message-content">
        <div class="typing-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    `;
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return typingDiv;
  }

  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    addMessage('user', text);
    input.value = '';
    sendButton.disabled = true;

    conversationHistory.push({
      role: 'user',
      content: text
    });

    const typingIndicator = showTyping();

    try {
      const response = await fetch(`${WORKER_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: conversationHistory
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      typingIndicator.remove();

      if (data.error) {
        addMessage('bot', `Ошибка: ${data.error}`);
      } else {
        addMessage('bot', data.response);
        conversationHistory.push({
          role: 'assistant',
          content: data.response
        });
      }
    } catch (error) {
      typingIndicator.remove();
      console.error('Error:', error);
      addMessage('bot', 'Извините, произошла ошибка. Попробуйте ещё раз.');
    }
  }
})();
