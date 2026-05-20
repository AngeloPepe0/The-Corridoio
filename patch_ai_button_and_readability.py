from pathlib import Path
import re

css_snippet = '''
        /* BRO-AI E TESTO LEGIBILE */
        body {
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        p, li, .content-box, .main-content-text, .article-content, .intro-text, .quote, .comment-bubble, .recap-card p, .social-embed, .info-card p, .popup-content p {
            font-family: 'Arial', sans-serif;
            font-size: 1rem;
            font-weight: 600;
            line-height: 1.7;
            letter-spacing: 0.01em;
            color: #222;
        }
        .ai-toggle {
            width: 70px;
            height: 70px;
            background: linear-gradient(135deg, #9c27b0, #6a1b9a);
            border: 4px solid #000;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2.2rem;
            box-shadow: 4px 4px 0 #000;
            transition: all 0.2s;
            user-select: none;
        }
        .ai-toggle:hover {
            transform: scale(1.05);
        }
        .ai-popup {
            position: fixed;
            bottom: 110px;
            right: 22px;
            width: 320px;
            max-width: calc(100vw - 40px);
            background: #fff;
            border: 5px solid #000;
            box-shadow: 8px 8px 0 #000;
            display: none;
            flex-direction: column;
            z-index: 9998;
        }
        .ai-popup.open { display: flex; }
        .ai-title {
            background: #ff007f;
            color: #fff;
            padding: 10px 12px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 4px solid #000;
            font-weight: bold;
        }
        .ai-content {
            padding: 12px;
            font-family: 'Arial', sans-serif;
            font-size: 0.95rem;
            line-height: 1.6;
            color: #222;
        }
        .ai-buttons {
            display: grid;
            gap: 8px;
            margin-top: 10px;
        }
        .ai-chip {
            background: #0fffff;
            border: 2px solid #000;
            padding: 8px 10px;
            cursor: pointer;
            font-weight: bold;
            text-align: left;
        }
        .ai-chip:hover { background: #fffb00; }
'''

html_snippet = '''
    <div id="bro-ai">
        <div class="ai-toggle" onclick="toggleBroAi()">❓</div>
        <div class="ai-popup">
            <div class="ai-title"><span>🤖 BRO-AI v2.0</span></div>
            <div class="ai-content">
                <p>Premi il tondino per aprire il bot e trovare subito la pagina o l'aiuto che ti serve.</p>
                <div class="ai-buttons">
                    <button class="ai-chip" onclick="broAiTip('aiuto')">🛠️ Aiuto rapido</button>
                    <button class="ai-chip" onclick="broAiTip('trucco')">✨ Consiglio utile</button>
                </div>
            </div>
        </div>
    </div>
'''

script_snippet = '''
    <script>
        function toggleBroAi() {
            const popup = document.querySelector('.ai-popup');
            if (popup) popup.classList.toggle('open');
        }
        function broAiTip(type) {
            const text = document.querySelector('#bro-ai .ai-content p');
            if (!text) return;
            if (type === 'aiuto') {
                text.innerHTML = '<strong>Bro-AI:</strong> Cerca qui la pagina giusta e leggi le istruzioni chiare.';
            } else if (type === 'trucco') {
                text.innerHTML = '<strong>Bro-AI:</strong> Usa il menu laterale e segui i titoli principali per trovare subito quello che cerchi.';
            }
        }
    </script>
'''

for path in sorted(Path('.').glob('*.html')):
    text = path.read_text(encoding='utf-8')
    changed = False
    if '</style>' in text and '/* BRO-AI E TESTO LEGIBILE */' not in text:
        text = text.replace('</style>', css_snippet + '</style>')
        changed = True
    if 'id="bro-ai"' not in text:
        if '</body>' in text:
            text = text.replace('</body>', html_snippet + script_snippet + '</body>')
            changed = True
    if 'function toggleBroAi' not in text and '</body>' in text and 'id="bro-ai"' in text:
        text = text.replace('</body>', script_snippet + '</body>')
        changed = True
    if changed:
        path.write_text(text, encoding='utf-8')
        print(f'Updated {path}')
