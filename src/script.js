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
        else if (event.key === 'Space') {
            if (inputBuffer.length <= 0) return;
            let spaceSeparated = inputBuffer.join() + " ";
            inputBuffer.push(spaceSeparated);
        }
    }

    inputBuffer.push(event.key);
}
e

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
    if (wordInput.value instanceof Number == false) {
        alert("Solo numeros permitidos");
        return;
    }
    else if (wordInput.value == null) {
        alert("Solo numeros permitidos");
        return;
    }

    textToType = generateText(wordInput.value);
    currentWord = 0;
    isPlaying = true;


}


console.log(generateText())




document.addEventListener('keydown', inputHandler);