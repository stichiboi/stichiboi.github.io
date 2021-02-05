import {convertInputToTime, displayNotification, formatTime} from "./utils";

const rowAlarmTemplate = $('#row-alarm-template > div');
const display = $('#alarm .time-display');

const alarms = {} as { [key: string]: NodeJS.Timeout }
let alarmID = 0;
$('#add-alarm').on('click', () => {
    addAlarm();
});

const timezoneOffset = (new Date()).getTimezoneOffset() * 60000;//In ms
runClock();

function runClock() {
    display.text(getCurrentTime());
    setInterval(() => {
        display.text(getCurrentTime())
    }, 1000);
}

function getCurrentTime() {
    const time = Date.now() - timezoneOffset;
    return formatTime(time);
}

function addAlarm() {
    const newAlarm = rowAlarmTemplate.clone();
    newAlarm.insertAfter('#add-alarm');
    const id = alarmID++;
    newAlarm.attr('data-alarm-id', id);
    newAlarm.children('.remove-alarm').on('click', event => {
        delete alarms[id];
        $(event.currentTarget).parent().remove();
    });

    newAlarm.find('.time-input-group > .time-input').on('keydown', event => {
        if (event.key === 'Enter' || event.key === 'Return') {
            setAlarm(newAlarm);
        } else {
            stopAlarm(newAlarm);
        }
    });

    newAlarm.find('.alarm-toggle').on('click', event => {
        if (event.currentTarget.classList.contains('toggled')) {
            stopAlarm(newAlarm);
        } else {
            setAlarm(newAlarm);
        }
    });
}

function setAlarm(alarm: JQuery) {
    const target = convertInputToTime(alarm.find('.time-input-group > .time-input'));
    const now = getCurrentTime().split(':').map((value, index) => {
        return parseInt(value) * Math.pow(60, 2 - index);
    }).reduce((prev, curr) => {
        return prev + curr
    });

    let delay = target - now * 1000;
    while (delay < 0) {
        delay += 3600 * 24 * 1000
    }
    // console.log({target, delay});
    displayNotification('Alarm time!', '', delay, () => stopAlarm(alarm)).then(timeout => {
        if (timeout) {
            const id = alarm.attr('data-alarm-id');
            alarms[id] = timeout;
        }
    });
    alarm.find('.alarm-toggle').addClass('toggled');
}

function stopAlarm(alarm: JQuery) {
    const id = alarm.attr('data-alarm-id');
    if (alarms[id]) {
        clearTimeout(alarms[id]);
    }
    delete alarms[id];
    alarm.find('.alarm-toggle').removeClass('toggled');
}