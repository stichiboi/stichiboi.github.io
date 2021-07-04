import React, {useContext, useState} from "react";
import {SettingsContext} from "./App";
import Stepper from "./Stepper";
const NUM_TRIES_KEY = 'reflexo-num-tries';

export default function SettingsContainer({
                                              clearLocalScore,
                                              children
                                          }: { clearLocalScore: () => void, children: JSX.Element }) {

    const [toggled, setToggled] = useState(false);
    const {setNumberOfTries} = useContext(SettingsContext);
    return (
        <div className={"settings-container"}>
            <button onClick={() => setToggled(prev => !prev)}>
                {children}
            </button>
            <div className={`popup ${toggled ? 'toggled' : ''} --vertical --spacing`}>
                <p className={"text-header"}>{"Settings"}</p>
                <Stepper saveKey={NUM_TRIES_KEY} onChange={setNumberOfTries}/>
                <button className={"button-cta"} onClick={clearLocalScore}>
                    {"Reset best score"}
                </button>
            </div>
        </div>
    )
}