export function getLetterWidths(log?: boolean) {
    const cont = document.getElementById('letter-width-container');

    const letters = genCharArray('A', 'Z');
    letters.push(' ', '-');
    letters.forEach(l => {
        const paragraph = document.createElement('p');
        paragraph.appendChild(document.createTextNode(l));
        paragraph.style.width = 'fit-content';
        cont.appendChild(paragraph);
    });
    const widths = {} as { [key: string]: number };
    for (let i = 0; i < cont.children.length; i++) {
        const child = cont.children[i];
        widths[child.textContent] = child.getBoundingClientRect().width;
    }
    if (log)
        console.log(JSON.stringify(widths));
    return widths;

    function genCharArray(charA, charZ) {
        const a = [];
        let i = charA.charCodeAt(0), j = charZ.charCodeAt(0);
        for (; i <= j; ++i) {
            a.push(String.fromCharCode(i));
        }
        return a;
    }
}