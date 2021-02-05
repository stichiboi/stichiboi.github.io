import '../assets/images/autumn-road.jpg'
import '../assets/images/annie-spratt-N46IkbWUvMU-unsplash.jpg'
import '../assets/images/deborah-diem-ds_NPvoAzro-unsplash.jpg'
import '../assets/images/geran-de-klerk-qzgN45hseN0-unsplash.jpg'
import '../assets/images/andrew-neel-a_K7R1kugUE-unsplash.jpg'

const backgrounds = require('../assets/backgrounds.json').backgrounds as Background[];
import * as AssetLoader from '../../node_modules/async-assets-loader/dist/async-assets-loader.js'

const container = $('#background-container');
const changeBackgroundInterval = 25000; //in ms
const fadeDuration = 2000; //30s in ms

(function () {
    //Immediately change to a quote, then setInterval to slow down
    changeBackground();
    setTimeout(changeBackground, changeBackgroundInterval);
})();

/**
 * If index is not specified or unavailable, select a random quote
 * @param index
 */
function changeBackground(index ?: number) {
    const currId = container.attr('data-background-id');
    const id = index < backgrounds.length ? index : Math.floor(Math.random() * backgrounds.length);
    if (id.toString() !== currId) {
        const loader = new AssetLoader();
        loader.load([{
            url: `assets/${backgrounds[id].path}`,
            type: 'img'
        }], () => {
            setBackground(id);
        });
    }
}

function setBackground(id: number) {
    const background = backgrounds[id];
    container.attr('data-background-id', id);
    container.fadeOut(fadeDuration, () => {

        container.css('background-image', `url("assets/${background.path}")`);
        for (const key in background.style) {
            if (background.style.hasOwnProperty(key)) {
                document.body.style.setProperty(key, background.style[key]);
            }
        }

        container.fadeIn(fadeDuration, () => {
            setTimeout(changeBackground, changeBackgroundInterval);
        });
    });

}

interface Background {
    name: string,
    author: string,
    link: string,
    path: string,
    style: { [key: string]: string }
}
