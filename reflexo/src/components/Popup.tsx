import React, {useState} from "react";

export default function Popup({icon, children}: { icon: JSX.Element, children: React.ReactNode }) {
    const [toggled, setToggled] = useState(false);

    return (
        <div className={"popup-container"}>
            <button onClick={() => setToggled(prev => !prev)}>
                {icon}
            </button>
            <div className={`popup ${toggled ? 'toggled' : ''} --vertical --spacing`}>
                {children}
            </div>
        </div>
    )
}