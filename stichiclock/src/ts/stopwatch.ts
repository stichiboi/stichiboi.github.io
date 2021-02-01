/**
 * Sets the functionality for the stopwatch section
 */
import {formatTime, toggleStartButton, toggleTime} from "./utils";

const display = $('#stopwatch .time-display');
let accumulated = 0;

$('#stopwatch .start').on('click', event => {
    const button = event.currentTarget;
    toggleStartButton(button);
    toggleTime(display, startStopwatch);
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


/**
 * @param id The run ID is required to avoid overlapping:
 * if the user presses the start/stop button in a short time span, the previous
 * run of updateTimer() does not stay alive since the ID does not match
 */
function startStopwatch(id: string) {
    const startTime = Date.now() - accumulated;

    function updateStopwatch() {
        const currTime = Date.now();
        const delta = currTime - startTime;
        accumulated = delta;
        if (display.attr('data-running') === id) {
            display.text(formatTime(delta));
            setTimeout(updateStopwatch, 1000);
        }
    }
    updateStopwatch();
}
