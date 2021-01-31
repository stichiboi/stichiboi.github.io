const clockIDs = [] as number[];

export function formatTime(ms: number) {
    return new Date(ms).toISOString().substr(11, 8)
}

export function toggleStartButton(button: HTMLElement) {
    button.classList.toggle('start');
    button.classList.toggle('stop');
    if (button.classList.contains('stop')) {
        button.innerText = 'Stop';
    } else {
        button.innerText = 'Start';
    }
}

export function toggleTime(display:JQuery, callback: (id:number) => void) {
    const currRun = display.attr('data-running');

    if (!currRun || currRun === '0') {
        display.attr('data-resetted', 'false');
        const clockID = getClockID(display);
        const runningId = clockIDs[clockID]++;
        display.attr('data-running', runningId);
        callback(runningId);
    } else {
        display.attr('data-running', -1);
    }
}

/**
 * Takes the clock ID of the display. If it does not have one, it generates it
 * @param display
 */
function getClockID(display: JQuery){
    const clockID = display.attr('data-clock-id');
    if(!clockID){
        const id = clockIDs.length;
        display.attr('data-clock-id', id);
        clockIDs.push(0);
        return id;
    }
    return parseInt(clockID);
}