/* =============================================
   THE CORRIDOIO - JavaScript unificato
   Usato da tutte le pagine del giornalino
   ============================================= */

/* ----- BRO-AI TOGGLE (comune a tutte le pagine) ----- */
function toggleBroAi() {
    const popup = document.querySelector('.ai-popup');
    if (popup) popup.classList.toggle('open');
}

/* ----- FUNZIONI POPUP GENERICI (index.html e giornalino.html) ----- */
function openPopup(id) {
    const popup = document.getElementById(id);
    if (popup) popup.classList.add('active');
}

function closePopup(id) {
    const popup = document.getElementById(id);
    if (popup) popup.classList.remove('active');
}

/* Chiudi popup cliccando fuori (archivio index.html) */
document.addEventListener('DOMContentLoaded', function () {

    document.querySelectorAll('.popup').forEach(function (p) {
        p.addEventListener('click', function (e) {
            if (e.target === p) p.classList.remove('active');
        });
    });

    /* Chiudi popup-slide con ESC (giornalino.html) */
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            document.querySelectorAll('.popup-slide.active, .popup.active').forEach(function (popup) {
                popup.classList.remove('active');
            });
        }
    });
});

/* ----- NEWSLETTER (index.html) ----- */
function saveEmail() {
    const email = document.getElementById('email');
    const msg   = document.getElementById('msg');
    if (!email || !msg) return;

    if (email.value.includes('@') && email.value.includes('.')) {
        msg.style.color = '#0fffff';
        msg.innerHTML   = '✅ Iscrizione completata!';
        email.value     = '';
    } else {
        msg.style.color = '#ff007f';
        msg.innerHTML   = '❌ Email non valida';
    }
}

/* ----- BRO-AI CHAT INTERATTIVO (pag4.html e pag5.html) ----- */
function talkToBro(message) {
    const chat = document.getElementById('ai-chat');
    if (chat && message) chat.innerHTML = '<strong>Bro-AI:</strong> ' + message;
}

/* ----- QUIZ (quiz.html) ----- */
(function () {
    if (!document.getElementById('quiz')) return; // esegui solo in quiz.html

    const allQuestions = [
        { question: "Qual è la capitale della Francia?", answers: ["Madrid","Parigi","Berlino","Roma"], correct: 1 },
        { question: "Chi ha scoperto l'America nel 1492?", answers: ["Galileo Galilei","Cristoforo Colombo","Napoleone","Leonardo da Vinci"], correct: 1 },
        { question: "Quanto fa 7 × 8?", answers: ["54","56","64","58"], correct: 1 },
        { question: "Chi ha scritto 'I Promessi Sposi'?", answers: ["Dante","Leopardi","Manzoni","Pirandello"], correct: 2 },
        { question: "In che anno è iniziata la Seconda Guerra Mondiale?", answers: ["1939","1945","1914","1922"], correct: 0 },
        { question: "Qual è il risultato di 12²?", answers: ["124","122","144","132"], correct: 2 },
        { question: "Quale pianeta è conosciuto come Pianeta Rosso?", answers: ["Venere","Giove","Marte","Saturno"], correct: 2 },
        { question: "Chi ha dipinto la Gioconda?", answers: ["Van Gogh","Michelangelo","Leonardo da Vinci","Raffaello"], correct: 2 },
        { question: "Qual è il sinonimo di 'felice'?", answers: ["Triste","Contento","Arrabbiato","Vuoto"], correct: 1 },
        { question: "Quanto fa 100 ÷ 4?", answers: ["20","30","25","15"], correct: 2 },
        { question: "Chi era il re d'Italia durante la Prima Guerra Mondiale?", answers: ["Vittorio Emanuele III","Umberto I","Garibaldi","Cavour"], correct: 0 },
        { question: "Quale tra questi è un verbo?", answers: ["Casa","Correre","Rosso","Libro"], correct: 1 },
        { question: "Quanto fa 15 + 27?", answers: ["42","41","45","40"], correct: 0 },
        { question: "Qual è il fiume più lungo d'Italia?", answers: ["Tevere","Arno","Po","Adige"], correct: 2 },
        { question: "Chi ha scritto la Divina Commedia?", answers: ["Boccaccio","Petrarca","Dante Alighieri","Ungaretti"], correct: 2 },
        { question: "Quanto fa 9 × 9?", answers: ["72","81","99","79"], correct: 1 },
        { question: "Qual è la lingua ufficiale del Brasile?", answers: ["Spagnolo","Portoghese","Francese","Inglese"], correct: 1 },
        { question: "In che secolo visse Giulio Cesare?", answers: ["I secolo a.C.","V secolo","X secolo","XV secolo"], correct: 0 },
        { question: "Qual è il contrario di 'alto'?", answers: ["Grande","Piccolo","Basso","Lungo"], correct: 2 },
        { question: "Quanto fa 50 - 18?", answers: ["32","28","30","35"], correct: 0 }
    ];

    function getRandomQuestions(arr, num) {
        return [...arr].sort(() => Math.random() - 0.5).slice(0, num);
    }

    const questions       = getRandomQuestions(allQuestions, 3);
    const questionElement = document.getElementById('question');
    const answersElement  = document.getElementById('answers');
    const nextBtn         = document.getElementById('next-btn');
    const questionNumber  = document.getElementById('question-number');
    const quizContainer   = document.getElementById('quiz');

    let currentQuestion = 0;
    let score = 0;

    function showQuestion() {
        resetState();
        const q = questions[currentQuestion];
        questionNumber.innerText = `Domanda ${currentQuestion + 1} di ${questions.length}`;
        questionElement.innerText = q.question;
        q.answers.forEach(function (answer, index) {
            const btn = document.createElement('button');
            btn.innerText = answer;
            btn.classList.add('answer-btn');
            btn.addEventListener('click', function () { selectAnswer(index, btn); });
            answersElement.appendChild(btn);
        });
    }

    function resetState() {
        nextBtn.style.display = 'none';
        answersElement.innerHTML = '';
    }

    function selectAnswer(index, button) {
        const correct = questions[currentQuestion].correct;
        document.querySelectorAll('.answer-btn').forEach(function (btn) { btn.disabled = true; });
        if (index === correct) {
            button.classList.add('correct');
            score++;
        } else {
            button.classList.add('wrong');
            document.querySelectorAll('.answer-btn')[correct].classList.add('correct');
        }
        nextBtn.style.display = 'block';
    }

    nextBtn.addEventListener('click', function () {
        currentQuestion++;
        if (currentQuestion < questions.length) {
            showQuestion();
        } else {
            showResult();
        }
    });

    function showResult() {
        let message = '';
        if      (score === 3) message = '🏆 Perfetto! Sei un genio della cultura generale!';
        else if (score === 2) message = '👏 Ottimo lavoro! Hai fatto davvero bene!';
        else if (score === 1) message = '🙂 Non male! Un po\' di allenamento e spacchi tutto!';
        else                  message = '😅 Ritenta! La prossima volta andrà meglio!';

        quizContainer.innerHTML = `
            <div class="result">
                <h2>Quiz completato!</h2>
                <div class="score">Hai ottenuto ${score} / ${questions.length}</div>
                <div class="message">${message}</div>
                <button class="restart-btn" onclick="location.reload()">🔄 Gioca ancora</button>
            </div>`;
    }

    showQuestion();
})();
