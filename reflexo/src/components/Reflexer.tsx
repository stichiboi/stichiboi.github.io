import React, {useEffect, useState} from "react";
import {ResultType} from "./App";

const FILL_COLORS = [
    'FF595E',
    '1982C4',
    '6A4C93',
    'FFCA3A'
];

const VALID_COLORS = [
    '8AC926'
];

const TIME_RANGE = {
    start: 1000,
    end: 5000
}

export default function Reflexer({
                                     running,
                                     onResult
                                 }: { running: boolean, onResult: (result: ResultType) => void }) {

    const [color, setColor] = useState(getColor(FILL_COLORS));
    const [timeoutId, setTimeoutId] = useState(0);
    const [validTime, setValidTime] = useState<undefined | number>();

    useEffect(() => {
        if (running && !validTime) {
            if (timeoutId) {
                clearTimeout(timeoutId);
                setColor(getColor(FILL_COLORS));
            }
            const time = Math.random() * (TIME_RANGE.end - TIME_RANGE.start) + TIME_RANGE.start;
            const id = setTimeout(() => {
                setColor(getColor(VALID_COLORS));
                setValidTime(Date.now());
            }, time);
            setTimeoutId(id as unknown as number);
        } else if (!running) {
            clearTimeout(timeoutId);
            setTimeoutId(0);
        }
    }, [running, validTime]);

    function getColor(target: string[]) {
        const ind = Math.floor(Math.random() * target.length);
        return `#${target[ind]}`;
    }

    function registerEvent() {
        console.log(running);
        if (running) {
            const result = validTime ? Date.now() - validTime : 'Invalid result';
            onResult(result);
            setValidTime(undefined);
        }
    }

    return (
        <div className={"full-size reflexer"}
             style={{backgroundColor: color}}
             onClick={registerEvent}
        />
    )
}