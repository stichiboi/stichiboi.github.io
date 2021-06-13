import {groupsFilename} from "../settings";

const data = {
    isReady: false,
    groups: [] as string[][]
}
$.getJSON(`src/assets/${groupsFilename}`).then(json => {
    display.children('.circle-loader').fadeOut();
    data.isReady = true;
    data.groups = json;
});

let intervalId: any;
const speed = 1 / 2500;
const changePeriod = 100;
const display = $('#word-display');
const startButton = $('#start-button');

const state = {
    isPlaying: false,
    startTime: 0,
    pauseTime: 0
}

startButton.on('click', () => {
    if (!state.isPlaying && data.isReady) {
        startButton.addClass('playing');
        //Slide by the delta time since last pause
        const startTime = Date.now() - (state.pauseTime - state.startTime);
        startInterval(startTime);
        state.isPlaying = true;
        state.startTime = startTime;
    } else {
        startButton.removeClass('playing');
        state.isPlaying = false;
        state.pauseTime = Date.now();
        if (intervalId) {
            clearInterval(intervalId);
        }
    }
})

function startInterval(startTime: number) {
    let iteration = Math.floor(Math.random() * 100);
    //Divide by 2 to compensate sin in range 0-2
    const length = (data.groups.length - 1) / 2;
    intervalId = setInterval(() => {
        const delta = (Date.now() - startTime) * speed;
        //Normalize sin function in range 0-2
        const gId = Math.round((Math.sin(delta) + 1) * length);
        const group = data.groups[gId];
        const word = group[iteration % group.length];
        display.text(word);
        iteration++;
    }, changePeriod);
}