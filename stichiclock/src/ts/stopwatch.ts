/**
 * Sets the functionality for the stopwatch section
 */

const display = $('#stopwatch .time-display');
let runningId = 0;
let accumulated = 0;

$('#stopwatch .start').on('click', event => {
    const button = event.currentTarget;
    toggleButton(button);
    toggleTimer();
});

$('#stopwatch .reset').on('click', () => {
    display.attr('data-resetted', 'true');
    //This button will exist only if the stopwatch is currently running
    const stopButton = $('#stopwatch .stop');
    if(stopButton){
        stopButton.trigger('click');
    }
    accumulated = 0;
    display.text(formatTime(0));
});

function toggleButton(button: HTMLElement) {
    button.classList.toggle('start');
    button.classList.toggle('stop');
    if (button.classList.contains('stop')) {
        button.innerText = 'Stop';
    } else {
        button.innerText = 'Start';
    }
}

function toggleTimer() {
    const currRun = display.attr('data-running');
    if (!currRun || currRun === '0') {
        display.attr('data-resetted', 'false');
        runningId++;
        display.attr('data-running', runningId);
        startTimer(runningId);
    } else {
        display.attr('data-running', 0);
    }
}

/**
 * @param id The run ID is required to avoid overlapping:
 * if the user presses the start/stop button in a short time span, the previous
 * run of updateTimer() does not stay alive since the ID does not match
 */
function startTimer(id: number) {
    const startTime = Date.now() - accumulated;

    function updateTimer() {
        const currTime = Date.now();
        const delta = currTime - startTime;
        if (display.attr('data-running') === id.toString()) {
            display.text(formatTime(delta));
            accumulated = delta;
            setTimeout(updateTimer, 1000);
        }
    }

    updateTimer();
}

function formatTime(ms: number) {
    return new Date(ms).toISOString().substr(11, 8)
}