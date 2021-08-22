import React, {useCallback, useEffect, useState} from "react";

export function Toggle({
                           saveKey,
                           onToggle,
                           leftIcon,
                           rightIcon,
                           className
                       }: { saveKey: string, onToggle: (value: boolean) => void, leftIcon: JSX.Element, rightIcon: JSX.Element, className?: string }): JSX.Element {

    const getValue = useCallback(() => {
        return localStorage.getItem(saveKey) === 'true';
    }, [saveKey]);

    const [value, setValue] = useState(getValue());

    useEffect(() => setValue(getValue()), [saveKey]);

    useEffect(() => {
        localStorage.setItem(saveKey, value.toString());
        onToggle(value);
    }, [value]);

    return (
        <button className={`toggle-container --spacing  ${value ? 'toggled' : ''} ${className || ''}`}
                onClick={() => setValue(prev => !prev)}>
            {leftIcon}
            <div className={`toggle`}>
                <span className="toggle-slider"/>
            </div>
            {rightIcon}
        </button>
    )
}