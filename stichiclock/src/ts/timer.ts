import {
    convertInputToTime,
    displayNotification,
    formatTime,
    isDisplayRunning,
    toggleStartButton,
    toggleTime
} from "./utils";

const display = $('#timer .time-display');
const inputs = display.find('.time-input');
let timerDuration: number;
let startTime: number;
let notification: NodeJS.Timeout;

$('#timer .start').on('click', event => {
    const button = event.currentTarget;
    toggleStartButton(button);
    toggleTime(display, startTimer);
});

$('#timer .reset').on('click', () => {
    const initialTime = parseInt(display.attr('data-initial-duration'));
    if (initialTime && !isNaN(initialTime)) {
        setTimeToInput(initialTime);
    }
});

inputs.on('keydown', event => {
    if (event.key === 'Enter' || event.key === 'Return') {
        $('#timer .start').trigger('click');
    }
})

inputs.on('keyup', () => {
    //When the user changes the inputs manually, then the initial duration should be saved again
    display.attr('data-save-initial-duration', 'true');
    setTimerDuration();
});

$('#timer .timer-add-time').on('click', event => {
    const value = parseInt(event.currentTarget.innerText);
    if (!isNaN(value)) {
        const minutesInput = $('#timer-minutes');
        const currTime = convertInputToTime(inputs);
        const target = currTime + value * 60000;
        setTimeToInput(target);
        minutesInput.trigger('keyup');
    }
});


function setTimerDuration() {
    startTime = Date.now();
    timerDuration = convertInputToTime(inputs);
    if (isDisplayRunning(display)) {
        if (notification) {
            clearTimeout(notification);
        }
        displayNotification('Timer is up!', ''
            // + `Start: ${formatTime(startTime)}\n`
            // + `End: ${formatTime(startTime + timerDuration)}\n`
            + `Duration: ${formatTime(timerDuration)}`, timerDuration).then(res => {
            if (res) {
                notification = res;
            }
        });
    }
}

function startTimer(id: string) {
    setTimerDuration();
    if (display.attr('data-save-initial-duration') !== 'false') {
        //Save start time so it can be resetted
        display.attr('data-initial-duration', timerDuration);
        display.attr('data-save-initial-duration', 'false');
    }

    function updateTimer() {
        if (display.attr('data-running') === id) {
            const currTime = Date.now();
            const delta = currTime - startTime;
            const remainingTime = timerDuration - delta;
            // console.log({timerDuration, remainingTime, delta});

            setTimeToInput(remainingTime);
            if (remainingTime > 0) {
                setTimeout(updateTimer, 1000);
            } else {
                stopTimer();
            }
        }
    }

    setTimeout(updateTimer, 900);
}

function stopTimer() {
    //Visually stop timer
    $('#timer .stop').trigger('click');
    //Play sound

}

function setTimeToInput(ms: number) {
    let asString;
    if (ms < 0) {
        asString = ['00', '00', '00'];
    } else {
        asString = formatTime(ms).split(':');
    }
    for (let i = 0; i < asString.length; i++) {
        (inputs[i] as HTMLInputElement).value = asString[i];
    }
}
