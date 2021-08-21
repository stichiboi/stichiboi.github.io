import React, {useCallback, useEffect, useMemo, useState} from "react";
import {Board, CELL_HIGHLIGHT, DIFFICULTY, InvalidBoardError, ISudoku, SUDOKU_VALIDITY} from "../types/types";
import {Cancel, Check, EditPencil, QuestionMark, WifiRounded} from "iconoir-react";
import ActionButton from "./ActionButton";
import SudokuGrid from "./SudokuGrid";
import Cell from "./Cell";
import {checkValidity, loop, visitDeps} from "../sudokuGenerator";

interface ICoords {
    x: number,
    y: number
}

const HINT_PENALTY = 30000; //30 sec
const CHECK_PENALTY = 30000; //30 sec

export default function Sudoku({sudoku, onExit}: { sudoku: ISudoku, onExit: (playAgain?: boolean) => unknown }) {
    const [, setStartTime] = useState(0);
    const formatTimer = useCallback((timer: number) => {
        const date = new Date(timer);
        const m = date.getMinutes(), s = date.getSeconds();
        return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
    }, []);
    const root = useMemo(() => Math.floor(Math.sqrt(sudoku.solution.length)), [sudoku.solution]);
    const [timer, setTimer] = useState('--:--');
    const [noteMode, setNoteMode] = useState(false);
    const [selected, setSelected] = useState<ICoords>();
    const [isComplete, setIsComplete] = useState(false);
    const [timerId, setTimerId] = useState(0);

    const [_triggerReset, _setTriggerReset] = useState(0);
    const triggerReset = useCallback(() => _setTriggerReset(prev => ++prev), []);

    const [_triggerCheck, _setTriggerCheck] = useState(0);
    const triggerCheck = useCallback(() => _setTriggerCheck(prev => ++prev), []);

    const [_triggerRender, _setTriggerRender] = useState(0);
    const triggerRender = useCallback(() => _setTriggerRender(prev => ++prev), []);
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
        setStartTime(Date.now() - sudoku.time);
        triggerRender();
        setIsComplete(false);
    }, [_triggerReset]);

    useEffect(() => {
        if (timerId) clearInterval(timerId);
        const id = setInterval(() => {
            setStartTime(startTime => {
                sudoku.time = Date.now() - startTime;
                setTimer(formatTimer(sudoku.time));
                return startTime;
            });
        }, 500);
        setTimerId(id as unknown as number);
        return () => clearInterval(id);
    }, [_triggerReset]);

    useEffect(() => {
        if (isComplete) clearInterval(timerId);
    }, [isComplete]);

    useEffect(() => {
        try {
            const asBoard = Array.from({length: sudoku.puzzle.length}).map(() => []) as Board;
            loop(((x, y) => {
                const value = sudoku.puzzle[y][x].value;
                if (!value) throw InvalidBoardError;
                asBoard[y][x] = value;
            }));
            const validity = checkValidity(asBoard, false);
            if (validity === SUDOKU_VALIDITY.Ok) setIsComplete(true);
        } catch (e) {
            //Incomplete
        }
    }, [_triggerCheck]);

    function setNumber(number: number, coords?: ICoords) {
        actionWrapper(() => {
            coords ||= selected;
            if (!coords) return;
            const cell = sudoku.puzzle[coords.y][coords.x];
            if (cell.isFixed) return;
            if (noteMode && !coords) {
                if (cell.notes.has(number)) cell.notes.delete(number);
                else cell.notes.add(number);
            } else {
                cell.value = number;
                //Remove notes from dependent cells
                visitDeps(coords.x, coords.y, ((tx, ty) => {
                    sudoku.puzzle[ty][tx].notes.delete(number);
                }));
                triggerCheck();
            }
        }, true);
    }

    function erase() {
        actionWrapper(() => {
            if (!selected) return;
            const cell = sudoku.puzzle[selected.y][selected.x];
            if (cell.isFixed) return;
            cell.value = 0;
            cell.notes.clear();
        }, true);
    }

    function check() {

    }

    function actionWrapper(callback: () => unknown, needsRender?: boolean) {
        if (isComplete) return;
        callback();
        if (needsRender) triggerRender();
    }

    function giveHint() {
        actionWrapper(() => {
            setStartTime(prev => prev - HINT_PENALTY);
            const freeCells = [] as ICoords[];
            loop((x, y) => {
                if (!sudoku.puzzle[y][x].value) freeCells.push({x, y});
            });
            for (const c of freeCells) {
                setNumber(sudoku.solution[c.y][c.x], c);
                sudoku.puzzle[c.y][c.x].isFixed = true;
            }
            // if (freeCells.length) {
            //     const ind = Math.floor(Math.random() * freeCells.length);
            //     const coords = freeCells[ind];
            //     setSelected(coords);
            //     setNumber(sudoku.solution[coords.y][coords.x], coords);
            // }
        });
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
                <ActionButton icon={<Cancel/>} onClick={() => onExit()}/>
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
            <div className={`popup sudoku-complete --spacing --vertical ${isComplete ? 'toggled' : ''}`}>
                <p>{`Completed in ${timer}`}</p>
                <div className={"button-group --spacing"}>
                    <button className={"button-cta --quiet"} onClick={() => onExit()}>{"Menu"}</button>
                    <button className={"button-cta"} onClick={() => {
                        onExit(true);
                        triggerReset();
                    }}>{"Play again"}</button>
                </div>
            </div>
        </div>
    );
}