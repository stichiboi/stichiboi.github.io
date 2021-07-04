import React, {useContext, useEffect, useState} from "react";
import {PlayOutline, Settings, Heart} from 'iconoir-react';
import {ResultType, SettingsContext} from "./App";
import SettingsContainer from "./SettingsContainer";
import Results from "./Results";
import Info from "./Info";

export const LOCAL_SCORE_KEY = 'reflexo-best-score';

export function getLocalScore() {
    const localSave = localStorage.getItem(LOCAL_SCORE_KEY);
    if (localSave) {
        return parseInt(localSave);
    }
}

export default function UI({
                               running,
                               onStart,
                               results
                           }: { running: boolean, onStart: () => void, results: ResultType[] }) {

    const [localScore, setLocalScore] = useState<undefined | number>();
    const {numberOfTries} = useContext(SettingsContext);

    useEffect(() => {
        const score = getLocalScore();
        setLocalScore(score);
    });

    return (
        <div className={`main-ui ${running ? 'hidden' : ''} --vertical --spacing`}>
            {!running && results.length ?
                <Results results={results}/>
                :
                <div className={"popup toggled --vertical --spacing"}>
                    <p className={"text-header"}>{"How to"}</p>
                    <p>
                        {"The objective is to measure your eye-hand reaction time."}<br/>
                        {"After you press play, wait for the green screen: click it as soon as it appears."}<br/>
                        {`After ${numberOfTries} round${numberOfTries > 1 ? 's' : ''}, your average time will be calculated.`}<br/>
                        {"Try it a couple of times to see if you can improve!"}
                    </p>
                </div>
            }
            <button className={`start-button`} onClick={onStart}>
                <PlayOutline/>
            </button>
            <footer className={"main-ui-footer"}>
                <SettingsContainer
                    clearLocalScore={() => {
                        localStorage.removeItem(LOCAL_SCORE_KEY);
                        setLocalScore(undefined);
                    }}
                />
                {localScore !== undefined ?
                    <p>{`Best: ${localScore} ms`}</p> : ''
                }
                <Info/>
            </footer>
        </div>
    )
}