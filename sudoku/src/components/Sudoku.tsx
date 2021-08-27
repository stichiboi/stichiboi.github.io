import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {Board, CELL_HIGHLIGHT, DIFFICULTY, ICoords, InvalidBoardError, ISudoku, SUDOKU_VALIDITY} from "../types/types";
import {Cancel, Check, EditPencil, QuestionMark, Undo} from "iconoir-react";
import ActionButton from "./ActionButton";
import SudokuGrid from "./SudokuGrid";
import Cell from "./Cell";
import {checkValidity, getFreeCells, loop, visitDeps} from "../sudokuGenerator";
import confetti from 'canvas-confetti';

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
    const noteMode = useRef(false);
    const selected = useRef<ICoords>();
    const [isComplete, setIsComplete] = useState(false);
    const [timerId, setTimerId] = useState(0);
    const [numberCount, setNumberCount] = useState({} as { [key: number]: number });

    const [_triggerConfetti, _setTriggerConfetti] = useState(0);
    const throwConfetti = useCallback(() => _setTriggerConfetti(prev => ++prev), []);

    const [_triggerCheck, _setTriggerCheck] = useState(0);
    const triggerCheck = useCallback(() => _setTriggerCheck(prev => ++prev), []);

    const [_triggerRender, _setTriggerRender] = useState(0);
    const triggerRender = useCallback(() => _setTriggerRender(prev => ++prev), []);

    const [_triggerNoteMode, _setTriggerNoteMode] = useState(0);
    const toggleNoteMode = useCallback(() => {
        noteMode.current = !noteMode.current;
        _setTriggerNoteMode(prev => ++prev);
    }, []);

    const actionWrapper = useCallback((callback: () => unknown, needsRender?: boolean) => {
        if (isComplete) return;
        callback();
        if (needsRender) triggerRender();
    }, [sudoku, isComplete]);

    const setNumber = useCallback((number: number, coords: ICoords | undefined, isHint?: boolean) => {
        actionWrapper(() => {
            if (!coords) return;
            const cell = sudoku.puzzle[coords.y][coords.x];
            if (cell.isFixed) return;
            if (noteMode.current && !isHint) {
                if (cell.notes.has(number)) cell.notes.delete(number);
                else cell.notes.add(number);
            } else {
                if (number !== cell.value) {
                    recordNumberCount(cell.value, -1);
                    recordNumberCount(number);
                    cell.isError = false;
                    cell.value = number;
                    //Remove notes from dependent cells
                    visitDeps(coords.x, coords.y, ((tx, ty) => {
                        sudoku.puzzle[ty][tx].notes.delete(number);
                    }));
                    triggerCheck();
                }
                if (isHint) cell.isFixed = true;
            }
        }, true);
    }, [sudoku]);

    const erase = useCallback((coords: ICoords | undefined) => {
        actionWrapper(() => {
            if (!coords) return;
            const cell = sudoku.puzzle[coords.y][coords.x];
            if (cell.isFixed) return;
            recordNumberCount(cell.value, -1);
            cell.value = 0;
            cell.notes.clear();
            cell.isError = false;
        }, true);
    }, [sudoku]);

    const check = useCallback(() => {
        actionWrapper(() => {
            setStartTime(prev => prev - CHECK_PENALTY);
            loop(((x, y) => {
                const cell = sudoku.puzzle[y][x];
                if (cell.value && cell.value !== sudoku.solution[y][x]) {
                    cell.isError = true;
                }
            }));
        }, true);
    }, [sudoku]);

    const giveHint = useCallback((giveAll?: boolean) => {
        actionWrapper(() => {
            setStartTime(prev => prev - HINT_PENALTY);
            const freeCells = getFreeCells(sudoku.puzzle);
            if (giveAll) {
                for (const c of freeCells) {
                    setNumber(sudoku.solution[c.y][c.x], c);
                    sudoku.puzzle[c.y][c.x].isFixed = true;
                }
            } else if (freeCells.length) {
                const ind = Math.floor(Math.random() * freeCells.length);
                const coords = freeCells[ind];
                selected.current = coords;
                setNumber(sudoku.solution[coords.y][coords.x], coords, true);
            }
        });
    }, [sudoku]);

    const getHighlight = useCallback((x: number, y: number) => {
        const cell = sudoku.puzzle[y][x];
        if (cell.isError) return CELL_HIGHLIGHT.Error;
        if (!selected.current) return CELL_HIGHLIGHT.None;
        const sx = selected.current.x, sy = selected.current.y;
        //Is in row or column (or both)
        let high = (x === sx ? 1 : 0) + (y === sy ? 1 : 0);
        if (high) return high;
        //Same number
        const currValue = cell.value;
        if (currValue && sudoku.puzzle[sy][sx].value === currValue) return CELL_HIGHLIGHT.Soft
        //If in same block
        const bx = Math.floor(x / root), by = Math.floor(y / root);
        const bsx = Math.floor(sx / root), bsy = Math.floor(sy / root);
        if (bx === bsx && by === bsy) return CELL_HIGHLIGHT.Soft;
        return CELL_HIGHLIGHT.None;
    }, [sudoku]);

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
                                        onClick={() => {
                                            selected.current = {x, y}
                                            triggerRender();
                                        }}
                                    />);
                            })
                        }
                    />)
                }
            />
        )
    }, [_triggerRender]);

    const controls = useMemo(() => {
        return (
            <SudokuGrid size={root}
                        isSmall={true}
                        contents={Array.from({length: sudoku.solution.length})
                            .map((x, i) => {
                                const missCount = sudoku.puzzle.length - numberCount[i + 1];
                                return (
                                    <button className={"button-action fill"}
                                            onClick={() => setNumber(i + 1, selected.current)}>
                                        <p>{i + 1}</p>
                                        <div className={"cell-notes sudoku-missing-count"}>
                                            {(isNaN(missCount) || missCount === 0) ? '' : missCount}
                                        </div>
                                    </button>
                                )
                            })}/>
        )
    }, [sudoku, numberCount]);

    const noteModeButton = useMemo(() => {
        return (
            <ActionButton icon={<EditPencil/>} onClick={toggleNoteMode} isToggled={noteMode.current}/>
        )
    }, [_triggerNoteMode]);

    useEffect(() => {
        setStartTime(Date.now() - sudoku.time);
        triggerRender();
        setIsComplete(false);
        selected.current = undefined;
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
    }, [sudoku]);

    useEffect(() => {
        const temp = {} as { [key: number]: number };
        loop(((x, y) => {
            const value = sudoku.puzzle[y][x].value;
            temp[value] = (temp[value] || 0) + 1;
        }));
        setNumberCount(temp);
    }, [sudoku]);

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

    //Event listeners
    useEffect(() => {
        function keyboardEventListener(event: KeyboardEvent) {
            event.preventDefault();
            const location = selected.current;
            if (location) {
                const number = parseInt(event.key);
                if (number) {
                    setNumber(number, location);
                } else if (number === 0 || event.key === 'Backspace' || event.key === 'Clear' || event.key === 'Delete') {
                    erase(location);
                }
            }
        }

        function movementEventListener(event: KeyboardEvent) {
            function getNewLocation(location: ICoords): ICoords | undefined {
                const {x, y} = location;
                switch (event.key) {
                    case "ArrowUp":
                        return {x, y: y - 1 < 0 ? sudoku.puzzle.length - 1 : y - 1};
                    case "ArrowDown":
                        return {x, y: (y + 1) % sudoku.puzzle.length};
                    case "ArrowLeft":
                        return {y, x: x - 1 < 0 ? sudoku.puzzle.length - 1 : x - 1};
                    case "ArrowRight":
                        return {y, x: (x + 1) % sudoku.puzzle.length};
                }
            }

            if (event.key.indexOf('Arrow') !== -1 && selected.current) {
                selected.current = getNewLocation(selected.current);
                triggerRender();
            }
            if (event.key === 'n' || event.key === 'Enter' || event.key === 'Return') {
                event.preventDefault();
                toggleNoteMode();
            }

        }

        document.addEventListener('keyup', keyboardEventListener);
        document.addEventListener('keydown', movementEventListener);
        return () => {
            document.removeEventListener('keyup', keyboardEventListener);
            document.removeEventListener('keydown', movementEventListener);
        }
    }, [erase, setNumber]);

    //Confetti
    useEffect(() => {
        if (isComplete) {
            throwConfetti();
        }
    }, [isComplete]);

    useEffect(() => {
        function fire(particleRatio: number, opts?: confetti.Options) {
            const count = 200;
            const defaults = {
                origin: {y: 1}
            };
            return confetti(Object.assign({}, defaults, opts, {
                particleCount: Math.floor(count * particleRatio)
            }));
        }

        function bigConfetti() {
            fire(0.25, {
                spread: 26,
                startVelocity: 55,
            });
            fire(0.2, {
                spread: 60,
            });
            fire(0.35, {
                spread: 100,
                decay: 0.91,
            });
            fire(0.1, {
                spread: 120,
                startVelocity: 25,
                decay: 0.92,
            });
            fire(0.1, {
                spread: 120,
                startVelocity: 45,
            });
        }

        function smallConfetti() {
            fire(0.5, {
                particleCount: 100,
                spread: 70
            });
        }

        if (_triggerConfetti) {
            Math.random() > 0.5 ? smallConfetti() : bigConfetti();
        }
    }, [_triggerConfetti]);

    function recordNumberCount(number: number, op = 1) {
        //Wrapper to keep track of the number of digits in the sudoku
        setNumberCount(prev => {
            const newCount = {...prev};
            newCount[number] += op;
            return newCount;
        });
    }

    return (
        <div className={"sudoku --vertical"}>
            <header className={"sudoku-header"}>
                <ActionButton icon={<Cancel/>} onClick={() => onExit()}/>
                <p>{timer}</p>
                <h3 className={"sudoku-difficulty"}>{DIFFICULTY[sudoku.difficulty]}</h3>
            </header>
            <section className={"sudoku-board"}>{board}</section>
            <section className={"sudoku-actions --spacing"}>
                <div className={"button-group --vertical"}>
                    {noteModeButton}
                    <ActionButton icon={<Undo/>} onClick={() => erase(selected.current)}/>
                </div>
                {controls}
                <div className={"button-group --vertical"}>
                    <ActionButton icon={<Check/>} onClick={check}/>
                    <ActionButton icon={<QuestionMark/>} onClick={giveHint}/>
                </div>
            </section>
            <div onMouseEnter={throwConfetti}
                 className={`popup sudoku-complete --spacing --vertical ${isComplete ? 'toggled' : ''}`}>
                <button onClick={throwConfetti}>{`Completed in ${timer} 🎉`}</button>
                <div className={"button-group --spacing"}>
                    <button className={"button-cta"} onClick={() => onExit()}>{"Menu"}</button>
                </div>
            </div>
        </div>
    );
}