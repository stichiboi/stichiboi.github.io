const ring = $('#ring-template');
const planetary = $('#planetary-container');
const maxRings = 6;
$('#planetary > .circle').on('click', addRing);

//Set initial rings
for (let i = 0; i < 4; i++) {
    addRing();
}

function addRing() {
    planetary.prepend(generateNewRing(ring));
    planetary.children().each((index, ring) => {
        const jRing = $(ring);
        const size = index * 120 + 40;
        jRing.css('--size', `${size}px`);
    });

    if (planetary.children().length > maxRings) {
        const lastChild = planetary.children(`*:nth-child(n+${maxRings})`);
        lastChild.fadeOut(300, () => {
            lastChild.remove();
        });
    }
}

function generateNewRing(template: JQuery) {
    const newRing = template.clone();
    const planetColor = Math.random() > 0.5 ? generateColor() : generateGradient();
    newRing.css("--planet-color", planetColor);
    newRing.css("--planet-size", `${Math.random() * 20 + 10}px`);
    newRing.css('--revolution', `${Math.random() * 30 + 10}s`);
    //Start at a random time
    newRing.css("animation-delay", `-${Math.random() * 20 + 10}s`);
    return newRing;
}

function generateColor() {
    return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
}

function generateGradient() {
    const angle = Math.random() * 360;
    const col1 = generateColor(), col2 = generateColor();
    return `linear-gradient(${angle}deg, ${col1}, ${col2})`;
}