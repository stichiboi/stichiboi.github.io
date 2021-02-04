import '../assets/images/autumn-road.jpg'
import '../assets/images/annie-spratt-N46IkbWUvMU-unsplash.jpg'
import '../assets/images/deborah-diem-ds_NPvoAzro-unsplash.jpg'
import '../assets/images/geran-de-klerk-qzgN45hseN0-unsplash.jpg'
import '../assets/images/andrew-neel-a_K7R1kugUE-unsplash.jpg'

const backgrounds = require('../assets/backgrounds.json').backgrounds;
import * as AssetLoader from '../../node_modules/async-assets-loader/dist/async-assets-loader.js'

const container = $('#background-container');

(function () {
    const changeBackgroundInterval = 30000; //30s in ms
    //Immediately change to a quote, then setInterval to slow down
    changeBackground();
    setInterval(changeBackground, changeBackgroundInterval);
})();

/**
 * If index is not specified or unavailable, select a random quote
 * @param index
 */
function changeBackground(index ?: number) {
    const currId = container.attr('data-background-id');
    const id = index < backgrounds.length ? index : Math.floor(Math.random() * backgrounds.length);
    if (id.toString() !== currId) {
        let isLoaded = false;
        const loader = new AssetLoader();
        loader.load([{
            url: `assets/${backgrounds[id].path}`,
            type: 'img'
        }], () => {
            isLoaded = true;
        });

        container.attr('data-background-id', id);
        container.fadeOut(2000, () => {
            let interval = setInterval(() => {
                if (isLoaded) {
                    setBackground(backgrounds[id]);
                    container.fadeIn(2000);
                    clearInterval(interval);
                }
            }, 100);
        });
    }
}

function setBackground(background: Background) {
    container.css('background-image', `url("assets/${background.path}")`);
    for (const key in background.style) {
        if (background.style.hasOwnProperty(key)) {
            document.body.style.setProperty(key, background.style[key]);
        }
    }
}

interface Background {
    name: string,
    author: string,
    link: string,
    path: string,
    style: { [key: string]: string }
}
