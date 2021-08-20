import React, {useCallback, useEffect, useMemo, useState} from "react";
import {CELL_HIGHLIGHT, DIFFICULTY, ISudoku} from "../types/types";
import {Cancel, Check, EditPencil, QuestionMark} from "iconoir-react";
import ActionButton from "./ActionButton";
import SudokuGrid from "./SudokuGrid";
import Cell from "./Cell";

interface ICoords {
    x: number,
    y: number
}

export default function Sudoku({sudoku, onExit}: { sudoku: ISudoku, onExit: () => unknown }) {
    const startTime = useMemo(() => Date.now() - sudoku.time, []);
    const formatTimer = useCallback((timer: number) => {
        const date = new Date(timer);
        const m = date.getMinutes(), s = date.getSeconds();
        return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
    }, []);
    const root = useMemo(() => Math.floor(Math.sqrt(sudoku.solution.length)), [sudoku.solution]);
    const [timer, setTimer] = useState('--:--');
    const [noteMode, setNoteMode] = useState(false);
    const [selected, setSelected] = useState<ICoords>();
    const board = useMemo(() => {
        return (
            <SudokuGrid
                size={root}
                contents={Array.from({length: sudoku.solution.length})
                    .map((_v, i) => <SudokuGrid
                        size={root}
                        contents={Array.from({length: sudoku.solution.length})
                            .map((_v, j) => {
                                const y = Math.floor(i / root) * root + Math.floor(j / root);
                                const x = j % root + i % root * root;
                                return (
                                    <Cell
                                        cell={sudoku.content[y][x]}
                                        highlight={getHighlight(x, y)}
                                        onClick={() => setSelected({x, y})}
                                    />);
                            })
                        }
                    />)
                }
            />
        )
    }, [selected]);

    useEffect(() => {
        const id = setInterval(() => {
            sudoku.time = Date.now() - startTime;
            setTimer(formatTimer(sudoku.time));
        }, 500);
        return () => clearInterval(id);
    }, []);

    function setNumber(number: number) {
        console.log(number);
    }

    function check() {

    }

    function giveHint() {

    }

    function erase() {

    }

    function getHighlight(x: number, y: number): CELL_HIGHLIGHT {
        if (!selected) return CELL_HIGHLIGHT.None;
        const sx = selected.x, sy = selected.y;
        let high = (x === sx ? 1 : 0) + (y === sy ? 1 : 0);
        if (!high) {
            return sudoku.content[sy][sx].value === sudoku.content[y][x].value ?
                CELL_HIGHLIGHT.Soft : CELL_HIGHLIGHT.None;
        }
        return high;
    }

    return (
        <div className={"sudoku --vertical"}>
            <header className={"sudoku-header"}>
                <ActionButton icon={<Cancel/>} onClick={onExit}/>
                <h3>{timer}</h3>
                <h3>{DIFFICULTY[sudoku.difficulty]}</h3>
            </header>
            <section className={"sudoku-board"}>{board}</section>
            <section className={"sudoku-actions --spacing"}>
                <div className={"button-group --vertical"}>
                    <ActionButton icon={<EditPencil/>} onClick={() => setNoteMode(prev => !prev)} isToggled={noteMode}/>
                    <ActionButton icon={<EditPencil/>} onClick={erase}/>
                </div>
                <SudokuGrid size={root}
                            isSmall={true}
                            contents={Array.from({length: sudoku.solution.length})
                                .map((x, i) => <ActionButton icon={i + 1} onClick={() => setNumber(i + 1)}/>)}/>
                <div className={"button-group --vertical"}>
                    <ActionButton icon={<Check/>} onClick={check}/>
                    <ActionButton icon={<QuestionMark/>} onClick={giveHint}/>
                </div>
            </section>
        </div>
    );
}