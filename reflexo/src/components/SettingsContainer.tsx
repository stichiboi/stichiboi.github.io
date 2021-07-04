import React, {useContext, useState} from "react";
import {SettingsContext} from "./App";
import Stepper from "./Stepper";
import {Settings} from "iconoir-react";
import Popup from "./Popup";

const NUM_TRIES_KEY = 'reflexo-num-tries';

export default function SettingsContainer({
                                              clearLocalScore
                                          }: { clearLocalScore: () => void }) {

    const {setNumberOfTries} = useContext(SettingsContext);
    return (
        <Popup icon={<Settings/>}>
            <p className={"text-header"}>{"Settings"}</p>
            <Stepper saveKey={NUM_TRIES_KEY} onChange={setNumberOfTries}/>
            <button className={"button-cta"} onClick={clearLocalScore}>
                {"Reset best score"}
            </button>
        </Popup>
    )
}