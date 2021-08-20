import React from "react";

export function Toggle({
                           isToggled,
                           onToggle,
                           leftIcon,
                           rightIcon,
                           className
                       }: { isToggled: boolean, onToggle: () => void, leftIcon: JSX.Element, rightIcon: JSX.Element, className?: string }): JSX.Element {
    return (
        <button className={`toggle-container --spacing  ${isToggled ? 'toggled' : ''} ${className || ''}`}
                onClick={() => onToggle()}>
            {leftIcon}
            <div className={`toggle`}>
                <span className="toggle-slider"/>
            </div>
            {rightIcon}
        </button>
    )
}