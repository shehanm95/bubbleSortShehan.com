let data = [];
let currentIndex = 0;
let isTempFull = false;
let mistakes = 0;
let sortedBoundary = 8; // Initially, all 8 are unsorted

function init() {
    data = Array.from({ length: 8 }, () => Math.floor(Math.random() * 50) + 1);
    render();
}

function render() {
    const mainArray = document.getElementById('main-array');
    mainArray.innerHTML = '';

    data.forEach((val, i) => {
        const container = document.createElement('div');
        container.className = 'slot-container';

        const slot = document.createElement('div');
        // Class finalized if it's beyond the current sorting boundary
        slot.className = `slot ${i >= sortedBoundary ? 'finalized' : ''} ${i === currentIndex || i === currentIndex + 1 ? 'active' : ''}`;
        slot.id = `slot-${i}`;
        slot.setAttribute('ondrop', 'drop(event)');
        slot.setAttribute('ondragover', 'allowDrop(event)');

        if (val !== null) {
            const el = document.createElement('div');
            el.className = 'element';
            el.textContent = val;
            el.id = `el-${val}-${i}`;
            el.draggable = true;

            const isFirst = (i === currentIndex);
            const isSecond = (i === currentIndex + 1);

            // Access logic: only active pair can move, and only if not finalized
            if (isFirst && !isTempFull && i < sortedBoundary) {
                el.setAttribute('ondragstart', 'drag(event)');
            } else if (isSecond && isTempFull && i < sortedBoundary) {
                el.setAttribute('ondragstart', 'drag(event)');
            } else {
                el.classList.add('disabled');
                el.draggable = false;
            }
            slot.appendChild(el);
        }

        const idxLabel = document.createElement('div');
        idxLabel.className = 'index-label';
        idxLabel.textContent = `index ${i}`;

        container.appendChild(slot);
        container.appendChild(idxLabel);
        mainArray.appendChild(container);
    });

    checkIfSorted();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drop(ev) {
    ev.preventDefault();
    const dataId = ev.dataTransfer.getData("text");
    const draggedEl = document.getElementById(dataId);
    const target = ev.currentTarget;
    const val = parseInt(draggedEl.textContent);

    if (target.id === 'temp-slot' && !isTempFull) {
        if (val <= data[currentIndex + 1]) {
            addMistake("Wrong Move! " + val + " is not larger than " + data[currentIndex + 1]);
            return;
        }
        target.appendChild(draggedEl);
        isTempFull = true;
    }
    else if (target.id === `slot-${currentIndex}` && isTempFull) {
        target.appendChild(draggedEl);
    }
    else if (target.id === `slot-${currentIndex + 1}` && isTempFull && draggedEl.parentElement.id === 'temp-slot') {
        target.appendChild(draggedEl);
        isTempFull = false;
    }

    updateDataArray();
    render();
}

function addMistake(text) {
    mistakes++;
    showError(text);
    const mLabel = document.getElementById('mistake-count');
    mLabel.textContent = `You Have Done ${mistakes} Mistake${mistakes > 1 ? 's' : ''}`;
    mLabel.classList.remove('hidden');
}

function showError(text) {
    const errorMsg = document.getElementById('error-msg');
    errorMsg.textContent = text;
    errorMsg.classList.remove('hidden');
    setTimeout(() => errorMsg.classList.add('hidden'), 3000);
}

function skipOrNext() {
    if (isTempFull) return;

    // Check if swap was mandatory
    if (data[currentIndex] > data[currentIndex + 1]) {
        addMistake("Restriction: You must swap " + data[currentIndex] + " and " + data[currentIndex + 1]);
        return;
    }

    currentIndex++;

    // If we reached the end of the current unsorted portion
    if (currentIndex >= sortedBoundary - 1) {
        currentIndex = 0;
        sortedBoundary--; // The last item of the round is now officially sorted
    }

    document.getElementById('message').textContent = `Comparing index ${currentIndex} and ${currentIndex + 1}.`;
    render();
}

function updateDataArray() {
    for (let i = 0; i < 8; i++) {
        const slot = document.getElementById(`slot-${i}`);
        data[i] = slot.children.length > 0 ? parseInt(slot.children[0].textContent) : null;
    }
}

function checkIfSorted() {
    const isFullySorted = sortedBoundary <= 1;
    const congrats = document.getElementById('congrats-layer');
    if (isFullySorted) {
        congrats.classList.remove('hidden');
        // Finalize all remaining slots visually
        document.querySelectorAll('.slot').forEach(s => s.classList.add('finalized'));
    }
}

init();