var inputBuffer = [];
var textToType = [];
var currentWord = 0;
var isPlaying = false;
const words = [
    'rapido', 'casa', 'teclado', 'programa', 'prueba', 'velocidad', 'palabra', 'usuario',
    'practica', 'error', 'correcto', 'pantalla', 'ordenador', 'codigo', 'eveno', 'entrada',
    'memoria', 'texto', 'sesion', 'tiempo', 'juego', 'tipo', 'espacio', 'borrar', 'caracter'
];

function inputHandler(event) {
    if (!isPlaying) return;
    if (event.ctrlKey || event.metaKey || event.altKey) return;

    if (event.key.length !== 1) {
        if (event.key === 'Backspace') {
            if (inputBuffer.length <= 0) return;
            inputBuffer.pop();
            return;
        }
        else if (event.key === ' ' || event.code === 'Space') {
            if (inputBuffer.length <= 0) return;
            let spaceSeparated = inputBuffer.join();
            inputBuffer.push(spaceSeparated);
        }
    }

    inputBuffer.push(event.key);
}

function renderTyped() {
    const el = document.getElementById('typed');
    if (!el) return;
    el.textContent = inputBuffer.join('');
}


function generateText(wordCount = 50) {
    let textBuffer = [];
    for (let i = 0; i < wordCount; i++) {
        let word = words[Math.floor(Math.random() * words.length)];
        textBuffer.push(word);
    }
    return textBuffer;
}

function startGame() {
    const wordInput = document.getElementById('word-count');
    const count = parseInt(wordInput.value, 10);
    if (!Number.isInteger(count) || count <= 0) {
        alert("Solo números permitidos, mayor que 0");
        return;
    }

    textToType = generateText(wordInput.value);
    currentWord = 0;
    isPlaying = true;


}


console.log(generateText())




document.addEventListener('keydown', inputHandler);


// me quede en lo de Only push printable keys into inputBuffer (guard with if (event.key.length === 1)).
// esta al final del 2.inputHandler(event)

// Summary of inputHandler issues and fixes:
//Detect Space with (event.key === ' ' || event.code === 'Space').
//Use inputBuffer.join('') to build the typed string (no commas).
//Only push printable keys into inputBuffer (guard with if (event.key.length === 1)).