import React, {useEffect, useState} from "react";
import ChevronIcon from '../icons/chevron-thin.svg';
import {DIFFICULTY} from "../types/types";

export default function Stepper({
                                    saveKey,
                                    onChange,
                                    min,
                                    max
                                }: { saveKey: string, onChange: (value: number) => void, min?: number, max?: number }) {

    const [value, setValue] = useState(getValue());

    useEffect(() => setValue(getValue()), [saveKey]);

    useEffect(() => {
        localStorage.setItem(saveKey, value.toString());
        onChange(value);
    }, [value]);

    function getValue() {
        return parseInt(localStorage.getItem(saveKey) || '3');
    }

    function changeTriesCount(modifier: number) {
        setValue(prev => {
            if (min !== undefined && prev + modifier < min || max !== undefined && prev + modifier > max) {
                return prev;
            }
            return prev + modifier;
        });
    }

    return (
        <div className={"stepper --spacing"}>
            <div className={"stepper-controls --spacing"}>
                <button onClick={() => changeTriesCount(-1)}>
                    <ChevronIcon/>
                </button>
                <p>{DIFFICULTY[value]}</p>
                <button onClick={() => changeTriesCount(1)}>
                    <ChevronIcon style={{transform: "rotateZ(180deg)"}}/>
                </button>
            </div>
        </div>
    )
}