"use strict";


const words = [
    'rápido','casa','teclado','programa','prueba','velocidad','palabra','usuario',
    'práctica','error','correcto','pantalla','ordenador','código','evento','entrada',
    'memoria','texto','sesión','tiempo','juego','tipo','espacio','borrar','carácter'
];

let text = "";
let chars = []; 
let status = []; 
let currentIndex = 0;
let isPlaying = false;
let startTime = 0;
let timerInterval = null;

let correctCount = 0;        
let totalMistakeKeystrokes = 0;
let uncorrectedMistakes = 0; 

const wordInput = document.getElementById('word-count');
const menuContent = document.querySelector('.menu-content');
const gameContent = document.querySelector('.game-content');
const typedEl = document.getElementById('typed');

(function injectStyles() {
    const css = `
    .typed-container { font-family: monospace; font-size: 28px; line-height: 1.6; color: #bbb; max-width: 900px; text-align:left; padding: 20px; background: #222; border-radius: 8px; }
    .typed-container .char { color: #bbbbbb; padding: 0 1px; white-space: pre; }
    .typed-container .char.current { text-decoration: underline; color: #fff; }
    .typed-container .char.correct { color: #fff; }
    .typed-container .char.incorrect { color: #ff6b6b; }
    .controls { margin: 12px 0; display:flex; gap:10px; align-items:center; justify-content:center; }
    .stats { margin-top:12px; display:flex; gap:16px; justify-content:center; color:#222; font-weight:600; }
    .results { margin-top:16px; background:#f0f0f0; padding:12px; border-radius:8px; display:inline-block; }
    button, input { font-size:16px; padding:8px 10px; }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
})();

(function buildGameUI() {
    if (!gameContent) return;
    gameContent.classList.add('hidden');

    const container = document.createElement('div');
    container.className = 'typed-container';
    container.id = 'typed-container';
    typedEl.replaceWith(container)
    window.typedContainer = container;

    const controls = document.createElement('div');
    controls.className = 'controls';
    controls.innerHTML = `
        <div id="wpm">WPM: 0</div>
        <button id="end-btn">End Game</button>
    `;
    gameContent.appendChild(controls);

    const results = document.createElement('div');
    results.className = 'results hidden';
    results.id = 'results';
    gameContent.appendChild(results);

    document.getElementById('end-btn').addEventListener('click', endGame);
})();

function generateText(wordCount = 50) {
    const buf = [];
    for (let i = 0; i < wordCount; i++) {
        const w = words[Math.floor(Math.random() * words.length)];
        buf.push(w);
    }
    return buf.join(' ');
}

function renderText() {
    const container = document.getElementById('typed-container');
    container.innerHTML = ''; 
    chars = text.split('');
    status = new Array(chars.length).fill('untyped');
    currentIndex = 0;
    correctCount = 0;
    totalMistakeKeystrokes = 0;
    uncorrectedMistakes = 0;

    chars.forEach((ch, idx) => {
        const span = document.createElement('span');
        span.className = 'char';
        span.dataset.index = idx;
        span.textContent = ch === ' ' ? '\u00A0' : ch;
        container.appendChild(span);
    });

    markCurrent();
}

function markCurrent() {
    const prev = document.querySelector('.typed-container .char.current');
    if (prev) prev.classList.remove('current');

    const node = document.querySelector(`.typed-container .char[data-index="${currentIndex}"]`);
    if (node) node.classList.add('current');
}

function updateWpmDisplay() {
    const wpmEl = document.getElementById('wpm');
    if (!wpmEl) return;
    const now = Date.now();
    const minutes = Math.max((now - startTime) / 60000, 1/60000);
    const wpm = Math.round((correctCount / 5) / minutes);
    wpmEl.textContent = `WPM: ${isFinite(wpm) ? wpm : 0}`;
}

function finishGame() {
    isPlaying = false;
    clearInterval(timerInterval);
    updateWpmDisplay();

    const totalChars = chars.length;
    const accuracy = Math.round((correctCount / totalChars) * 100) || 0;
    const now = Date.now();
    const minutes = Math.max((now - startTime) / 60000, 1/60000);
    const finalWpm = Math.round((correctCount / 5) / minutes);

    const results = document.getElementById('results');
    results.classList.remove('hidden');
    results.innerHTML = `
        <div><strong>Final results</strong></div>
        <div>Accuracy: ${accuracy}%</div>
        <div>Uncorrected mistakes: ${uncorrectedMistakes}</div>
        <div>Total mistake keystrokes: ${totalMistakeKeystrokes}</div>
        <div>WPM: ${finalWpm}</div>
        <div style="margin-top:8px"><button id="restart-btn">Restart</button></div>
    `;

    document.getElementById('restart-btn').addEventListener('click', () => {
        results.classList.add('hidden');
        document.querySelector('.game-content').classList.add('hidden');
        document.querySelector('.menu-content').classList.remove('hidden');
        const container = document.getElementById('typed-container');
        container.innerHTML = '';
        const wpmEl = document.getElementById('wpm');
        if (wpmEl) wpmEl.textContent = 'WPM: 0';
    });
}

function handleKeydown(event) {
    if (!isPlaying) return;
    if (event.ctrlKey || event.metaKey || event.altKey) return;

    const key = event.key;

    if (key === 'Backspace') {
        if (currentIndex === 0) return;
        currentIndex--;
        const prevSpan = document.querySelector(`.typed-container .char[data-index="${currentIndex}"]`);
        const prevStatus = status[currentIndex];
        if (prevStatus === 'incorrect') {
            uncorrectedMistakes = Math.max(0, uncorrectedMistakes - 1);
        } else if (prevStatus === 'correct') {
            correctCount = Math.max(0, correctCount - 1);
        }
        status[currentIndex] = 'untyped';
        prevSpan.classList.remove('correct', 'incorrect');
        markCurrent();
        updateWpmDisplay();
        event.preventDefault();
        return;
    }

    if (key.length !== 1) return;

    if (currentIndex >= chars.length) return;

    const expected = chars[currentIndex];
    const span = document.querySelector(`.typed-container .char[data-index="${currentIndex}"]`);

    if (key === expected) {
        status[currentIndex] = 'correct';
        span.classList.remove('incorrect');
        span.classList.add('correct');
        correctCount++;
    } else {
        if (status[currentIndex] !== 'incorrect') {
            uncorrectedMistakes++;
        }
        status[currentIndex] = 'incorrect';
        span.classList.remove('correct');
        span.classList.add('incorrect');
        totalMistakeKeystrokes++;
    }

    currentIndex++;
    markCurrent();
    updateWpmDisplay();

    if (currentIndex >= chars.length) {
        finishGame();
    }
}

function startGame() {
    const count = parseInt(wordInput.value, 10);
    if (!Number.isInteger(count) || count <= 0) {
        alert('Ingrese un número entero mayor que 0');
        return;
    }

    text = generateText(count);
    document.querySelector('.menu-content').classList.add('hidden');
    const game = document.querySelector('.game-content');
    game.classList.remove('hidden');

    renderText();

    isPlaying = true;
    startTime = Date.now();
    timerInterval = setInterval(updateWpmDisplay, 800);
    window.focus();
    const results = document.getElementById('results');
    if (results) results.classList.add('hidden');
}

function endGame() {
    if (!isPlaying) {
        document.querySelector('.game-content').classList.add('hidden');
        document.querySelector('.menu-content').classList.remove('hidden');
        return;
    }
    finishGame();
}

document.addEventListener('keydown', handleKeydown);

window.startGame = startGame;
window.endGame = endGame;
