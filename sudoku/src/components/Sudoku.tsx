import React, {useCallback, useEffect, useMemo, useState} from "react";
import {CELL_HIGHLIGHT, DIFFICULTY, ISudoku} from "../types/types";
import {Cancel, Check, EditPencil, QuestionMark, WifiRounded} from "iconoir-react";
import ActionButton from "./ActionButton";
import SudokuGrid from "./SudokuGrid";
import Cell from "./Cell";
import {loop, visitDeps} from "../sudokuGenerator";

interface ICoords {
    x: number,
    y: number
}

const HINT_PENALTY = 30000; //30 sec
const CHECK_PENALTY = 30000; //30 sec

export default function Sudoku({sudoku, onExit}: { sudoku: ISudoku, onExit: () => unknown }) {
    const [startTime, setStartTime] = useState(Date.now() - sudoku.time);
    const formatTimer = useCallback((timer: number) => {
        const date = new Date(timer);
        const m = date.getMinutes(), s = date.getSeconds();
        return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
    }, []);
    const root = useMemo(() => Math.floor(Math.sqrt(sudoku.solution.length)), [sudoku.solution]);
    const [timer, setTimer] = useState('--:--');
    const [noteMode, setNoteMode] = useState(false);
    const [selected, setSelected] = useState<ICoords>();

    const [_triggerRender, _setTriggerRender] = useState(false);
    const triggerRender = useCallback(() => _setTriggerRender(prev => !prev), []);
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
                                        cell={sudoku.puzzle[y][x]}
                                        highlight={getHighlight(x, y)}
                                        onClick={() => setSelected({x, y})}
                                    />);
                            })
                        }
                    />)
                }
            />
        )
    }, [_triggerRender, selected]);

    useEffect(() => {
        const id = setInterval(() => {
            setStartTime(startTime => {
                sudoku.time = Date.now() - startTime;
                setTimer(formatTimer(sudoku.time));
                return startTime;
            });

        }, 500);
        return () => clearInterval(id);
    }, []);

    function setNumber(number: number, coords?: ICoords) {
        coords ||= selected;
        if (!coords) return;
        const cell = sudoku.puzzle[coords.y][coords.x];
        if (cell.isFixed) return;
        if (noteMode) {
            if (cell.notes.has(number)) cell.notes.delete(number);
            else cell.notes.add(number);
        } else {
            cell.value = number;
            //Remove notes from dependent cells
            visitDeps(coords.x, coords.y, ((tx, ty) => {
                sudoku.puzzle[ty][tx].notes.delete(number);
            }));
        }
        triggerRender();
    }

    function erase() {
        if (!selected) return;
        const cell = sudoku.puzzle[selected.y][selected.x];
        if (cell.isFixed) return;
        cell.value = 0;
        cell.notes.clear();
        triggerRender();
    }

    function check() {

    }

    function giveHint() {
        setStartTime(prev => prev - HINT_PENALTY);
        const freeCells = [] as ICoords[];
        loop((x, y) => {
            if (!sudoku.puzzle[y][x].value) freeCells.push({x, y});
        });
        if (freeCells.length) {
            const ind = Math.floor(Math.random() * freeCells.length);
            const coords = freeCells[ind];
            setSelected(coords);
            setNumber(sudoku.solution[coords.y][coords.x], coords);
        }
    }


    function getHighlight(x: number, y: number): CELL_HIGHLIGHT {
        if (!selected) return CELL_HIGHLIGHT.None;
        const sx = selected.x, sy = selected.y;
        //Is in row or column (or both)
        let high = (x === sx ? 1 : 0) + (y === sy ? 1 : 0);
        if (high) return high;
        //Same number
        const currValue = sudoku.puzzle[y][x].value;
        if (currValue && sudoku.puzzle[sy][sx].value === currValue) return CELL_HIGHLIGHT.Soft
        //If in same block
        const bx = Math.floor(x / root), by = Math.floor(y / root);
        const bsx = Math.floor(sx / root), bsy = Math.floor(sy / root);
        if (bx === bsx && by === bsy) return CELL_HIGHLIGHT.Soft;
        return CELL_HIGHLIGHT.None;
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
                    <ActionButton icon={<WifiRounded/>} onClick={() => erase()}/>
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