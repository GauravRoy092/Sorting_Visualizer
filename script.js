const n = 46;
const array = [];
let audioCtx = null;

function init() {
    for (let i = 0; i < n; i++) {
        array[i] = Math.random();
    }
    showBars();
}

function play() {
    const swaps = bubbleSort([...array]);
    animate(swaps);
}

function animate(swaps) {
    if (swaps.length === 0) {
        showBars();
        return;
    }
    const [i, j] = swaps.shift();
    [array[i], array[j]] = [array[j], array[i]];
    showBars([i, j]);

    playNote(200 + array[i] * 500);
    playNote(200 + array[j] * 500);

    setTimeout(() => {
        animate(swaps);
    }, 20);
}

function bubbleSort(array) {
    const swaps = [];
    let swapped;
    do {
        swapped = false;
        for (let i = 1; i < array.length; i++) {
            if (array[i - 1] > array[i]) {
                swaps.push([i - 1, i]);
                swapped = true;
                [array[i - 1], array[i]] = [array[i], array[i - 1]];
            }
        }
    } while (swapped);
    return swaps;
}

function showBars(indices) {
    const container = document.getElementById('container');
    container.innerHTML = "";
    for (let i = 0; i < array.length; i++) {
        const bar = document.createElement("div");
        bar.style.height = `${array[i] * 100}%`;
        bar.classList.add("bar");
        
        // Default color for unsorted bars
        bar.style.backgroundColor = "#4A90E2"; // Default color

        // Highlight bars that are being compared
        if (indices && indices.includes(i)) {
            bar.style.backgroundColor = "#FF5733"; // Color for bars being compared
        }
        
        container.appendChild(bar);
    }
}

function playNote(freq) {
    if (audioCtx == null) {
        audioCtx = new (AudioContext || webkitAudioContext || window.webkitAudioContext)();
    }
    const dur = 0.1;
    const osc = audioCtx.createOscillator();
    osc.frequency.value = freq;
    osc.start();
    osc.stop(audioCtx.currentTime + dur);
    const node = audioCtx.createGain();
    node.gain.value = 0.1;
    node.gain.linearRampToValueAtTime(0, audioCtx.currentTime + dur);
    osc.connect(node);
    node.connect(audioCtx.destination);
}
