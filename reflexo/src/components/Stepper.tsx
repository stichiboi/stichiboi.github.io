import React, {useEffect, useState} from "react";
import {Minus, Plus} from "iconoir-react";

export default function Stepper({saveKey, onChange}: { saveKey: string, onChange: (value: number) => void }) {

    const [value, setValue] = useState(getValue());

    useEffect(() => setValue(getValue()), [saveKey]);

    useEffect(() => {
        localStorage.setItem(saveKey, value.toString());
        if (value <= 0) {
            setValue(1);
        } else {
            onChange(value);
        }
    }, [value]);

    function getValue() {
        return parseInt(localStorage.getItem(saveKey) || '3');
    }

    function changeTriesCount(modifier: number) {
        setValue(prev => prev + modifier);
    }

    return (
        <div className={"stepper --spacing"}>
            <p className={"text-info"}>{"Tries"}</p>
            <div className={"stepper-controls --spacing"}>
                <button onClick={() => changeTriesCount(-1)}>
                    <Minus/>
                </button>
                <p>{value}</p>
                <button onClick={() => changeTriesCount(1)}>
                    <Plus/>
                </button>
            </div>
        </div>
    )
}