const clockIDs = [] as number[];

export function formatTime(ms: number) {
    return new Date(ms).toISOString().substr(11, 8)
}

export function convertInputToTime(inputs: JQuery) {
    let time = 0;
    inputs.each(function (index) {
        const value = $(this).val().toString();
        if (value) {
            //Starts at 2 because it's the hour position (60^2)
            time += parseInt(value) * Math.pow(60, 2 - index);
        }
    });
    return time * 1000; //In milliseconds
}

export function isDisplayRunning(display: JQuery) {
    const currRun = display.attr('data-running');
    return currRun && currRun !== '-1';
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

export function toggleTime(display: JQuery, callback: (id: string) => void) {
    if (!isDisplayRunning(display)) {
        display.attr('data-resetted', 'false');
        const clockID = getClockID(display);
        const runningId = clockIDs[clockID]++;
        display.attr('data-running', runningId);
        callback(runningId.toString());
    } else {
        display.attr('data-running', -1);
    }
}

/**
 * Takes the clock ID of the display. If it does not have one, it generates it
 * @param display
 */
function getClockID(display: JQuery) {
    const clockID = display.attr('data-clock-id');
    if (!clockID) {
        const id = clockIDs.length;
        display.attr('data-clock-id', id);
        clockIDs.push(0);
        return id;
    }
    return parseInt(clockID);
}

let areNotificationsAllowed = true;

export function requestNotificationPermission() {
    if (!("Notification" in window)) {
        if (areNotificationsAllowed) {
            alert("This browser does not support desktop notification");
            areNotificationsAllowed = false;
        }
        return Promise.resolve(false);
    }
    if (Notification.permission !== 'granted') {
        return Notification.requestPermission().then(() => {
            return Notification.permission === 'granted';
        })
    }
    return Promise.resolve(true);
}

export function displayNotification(title: string, body: string, time: number, onclose?: (this: Notification, ev: Event) => any) {
    return requestNotificationPermission().then(allowed => {
        if (allowed) {
            return setTimeout(() => {
                const notification = new Notification(title, {
                    requireInteraction: true,
                    body: body
                });
                notification.onclose = onclose;
            }, time);
        }
    })

}