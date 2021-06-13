import {readJSON, saveData} from "./utils";
import {groupsFilename, rangeWidth} from "../settings";

const directory = "src/assets";
const fileName = "words_dictionary.json";

const letterWidths = {
    "A": 11.5625,
    "B": 10.671875,
    "C": 10.671875,
    "D": 11.5625,
    "E": 9.78125,
    "F": 8.90625,
    "G": 11.5625,
    "H": 11.5625,
    "I": 5.328125,
    "J": 6.234375,
    "K": 11.5625,
    "L": 9.78125,
    "M": 14.234375,
    "N": 11.5625,
    "O": 11.5625,
    "P": 8.90625,
    "Q": 11.5625,
    "R": 10.671875,
    "S": 8.90625,
    "T": 9.78125,
    "U": 11.5625,
    "V": 11.5625,
    "W": 15.109375,
    "X": 11.5625,
    "Y": 11.5625,
    "Z": 9.78125,
    "-": 5.328125
};

const minWordCount = 5;
const shiftWidth = Object.values(letterWidths).reduce((prev, curr) => Math.min(prev, curr), Infinity);

readJSON(`${directory}/${fileName}`).then(json => {
    const words = Object.keys(json);
    //Since the input JSON is sorted, words with similar roots are all next to each other
    shuffle(words);

    const wordsLength = words.map(word => {
        const w = word.toUpperCase();
        return {
            w, l: calculateWidth(w, letterWidths)
        }
    });

    wordsLength.sort((a, b) => {
        return a.l > b.l ? 1 : -1;
    });

    const groups = [] as string[][];
    wordsLength.forEach(c => {
        const gId = Math.floor((c.l - shiftWidth) / rangeWidth);
        groups[gId] ||= [];
        groups[gId].push(c.w);
    });

    const filtered = groups.filter(arr => arr.length >= minWordCount);

    saveData(`${directory}/${groupsFilename}`, filtered);
});

function calculateWidth(word: string, widths: { [key: string]: number }) {
    let tot = 0;
    for (const l of word) {
        tot += widths[l] || 0;
    }
    return tot;
}

function shuffle(array: any[]) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}
