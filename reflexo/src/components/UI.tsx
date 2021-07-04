import React, {useEffect, useState} from "react";
import {PlayOutline, Settings, Heart} from 'iconoir-react';
import {ResultType} from "./App";
import SettingsContainer from "./SettingsContainer";
import Results from "./Results";

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

    useEffect(() => {
        const score = getLocalScore();
        setLocalScore(score);
    });

    return (
        <div className={`main-ui ${running ? 'hidden' : ''} --vertical --spacing`}>
            {!running && results.length ?
                <Results results={results}/>
                : ''}
            <button className={`start-button`} onClick={onStart}>
                <PlayOutline/>
            </button>
            <footer className={"main-ui-footer"}>
                <SettingsContainer
                    clearLocalScore={() => {
                        localStorage.removeItem(LOCAL_SCORE_KEY);
                        setLocalScore(undefined);
                    }}
                >
                    <Settings/>
                </SettingsContainer>

                {localScore !== undefined ?
                    <p>{`Best: ${localScore} ms`}</p> : ''
                }
                <button>
                    <Heart/>
                </button>
            </footer>
        </div>
    )
}