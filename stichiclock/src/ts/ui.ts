import * as Flickity from '../../node_modules/flickity/dist/flickity.pkgd.min'
import '../../node_modules/flickity/dist/flickity.min.css'

const mainNavIcons = $('#main-navigation .icon');

var flky = new Flickity('.gallery', {
    contain: true,
    prevNextButtons: false,
    friction: 0.3,
    pageDots: false,
    wrapAround: true,
    dragThreshold: 5,
    initialIndex: 1,
    setGallerySize: false,
    on: {
        change: function (index) {
            selectNavIcon(mainNavIcons[index]);
        }
    }
});

mainNavIcons.on('click', event => {
    selectNavIcon(event.currentTarget);
    flky.select(mainNavIcons.index(event.currentTarget));
});

function selectNavIcon(icon: HTMLElement) {
    mainNavIcons.removeClass('is-selected');
    icon.classList.add('is-selected');
}
