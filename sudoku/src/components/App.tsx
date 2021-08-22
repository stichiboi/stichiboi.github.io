import React, {useEffect, useState} from "react";
import ReactDOM from "react-dom";
import Stepper from "./Stepper";
import {Toggle} from "./Toggle";
import {HalfMoon, SunLight} from 'iconoir-react';
import {DIFFICULTY, ISudoku} from "../types/types";
import {generateSudoku} from "../sudokuGenerator";
import Sudoku from "./Sudoku";

export const SettingsContext = React.createContext({
    difficulty: DIFFICULTY.Easy,
    setDifficulty: (value: DIFFICULTY) => {
    },
    isDarkMode: false,
    setDarkMode: (value: boolean) => {
    }
});
ReactDOM.render(<App/>, document.getElementById('root'));

function App() {

    const [difficulty, setDifficulty] = useState(DIFFICULTY.Easy);
    const [isDarkMode, setDarkMode] = useState(false);
    const [sudoku, setSudoku] = useState<undefined | ISudoku>();

    useEffect(() => {
        const body = document.getElementsByTagName('body')[0];
        if (body) {
            if (isDarkMode)
                body.classList.add('dark-mode');
            else
                body.classList.remove('dark-mode');
        }
    }, [isDarkMode]);

    function buildSudoku() {
        setSudoku(generateSudoku(difficulty));
    }

    return (
        <main className={"full-size main-ui"}>
            {sudoku ?
                <Sudoku sudoku={sudoku} onExit={(playAgain) => {
                    setSudoku(playAgain ? generateSudoku(difficulty) : undefined);
                }}/>
                :
                <div className={"menu --spacing --vertical"}>
                    <div className={"difficulty-picker --vertical --spacing"}>
                        <h3>{"Difficulty"}</h3>
                        <Stepper saveKey={'stichi-sudoku-difficulty'} onChange={value => setDifficulty(value)}
                                 max={DIFFICULTY.Hard} min={DIFFICULTY.Trivial}/>
                    </div>
                    <button className={"button-cta"} onClick={buildSudoku}>
                        {"New Game"}
                    </button>
                    <Toggle
                        saveKey={"stichi-sudoku-dark-mode"}
                        onToggle={setDarkMode}
                        leftIcon={<SunLight/>}
                        rightIcon={<HalfMoon/>}
                        className={"toggle-dark-mode"}
                    />
                </div>
            }
        </main>
    );
}