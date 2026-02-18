let data = [];
let currentIndex = 0;
let isTempFull = false;

function init() {
    data = Array.from({ length: 6 }, () => Math.floor(Math.random() * 50) + 1);
    render();
}

function render() {
    const mainArray = document.getElementById('main-array');
    mainArray.innerHTML = '';

    data.forEach((val, i) => {
        const container = document.createElement('div');
        container.className = 'slot-container';

        const slot = document.createElement('div');
        slot.className = `slot ${i === currentIndex || i === currentIndex + 1 ? 'active' : ''}`;
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

            if (isFirst && !isTempFull) {
                el.setAttribute('ondragstart', 'drag(event)');
            } else if (isSecond && isTempFull) {
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
        const nextVal = data[currentIndex + 1];
        if (val <= nextVal) {
            showError("Wrong Move! No swap needed since " + val + " <= " + nextVal);
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

function showError(text) {
    const errorMsg = document.getElementById('error-msg');
    errorMsg.textContent = text;
    errorMsg.classList.remove('hidden');
    setTimeout(() => errorMsg.classList.add('hidden'), 3000);
}

function skipOrNext() {
    if (isTempFull) return;

    // RESTRICTION: Check if a swap was necessary
    const leftVal = data[currentIndex];
    const rightVal = data[currentIndex + 1];

    if (leftVal > rightVal) {
        showError("Restriction: You cannot skip! " + leftVal + " > " + rightVal + ". You must swap.");
        return;
    }

    currentIndex++;
    if (currentIndex >= 5) currentIndex = 0;
    render();
}

function updateDataArray() {
    for (let i = 0; i < 6; i++) {
        const slot = document.getElementById(`slot-${i}`);
        data[i] = slot.children.length > 0 ? parseInt(slot.children[0].textContent) : null;
    }
}

function checkIfSorted() {
    const isSorted = data.every((val, i) => i === 0 || val >= data[i - 1]);
    const congrats = document.getElementById('congrats-layer');
    if (isSorted && !data.includes(null)) {
        congrats.classList.remove('hidden');
    } else {
        congrats.classList.add('hidden');
    }
}

init();