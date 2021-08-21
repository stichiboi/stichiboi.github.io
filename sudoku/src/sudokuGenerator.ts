import {Board, DIFFICULTY, ICell, ICoords, InvalidBoardError, ISudoku, SUDOKU_VALIDITY} from "./types/types";
import puzzles from './puzzles.json';

const SUDOKU_SIZE = 9;
const SUDOKU_ROOT = Math.floor(Math.sqrt(SUDOKU_SIZE));

// const puzzles = JSON.parse(require('./puzzles.json')) as string[];
const difficultyRangeSize = puzzles.length / DIFFICULTY.__LENGTH;
const SUDOKU_SIZE_ARR = Array.from({length: SUDOKU_SIZE});

export function generateSudoku(difficulty: DIFFICULTY): ISudoku {
    const ind = Math.floor((Math.random() + difficulty) * difficultyRangeSize);
    const asString = puzzles[ind];
    const board = stringToBoard(asString);
    //TODO Apply transformation

    //Find solution
    const startTime = Date.now();
    const solution = solve(board);
    const solveTime = Date.now() - startTime;
    console.log(`Solve time: ${solveTime}ms`);

    //Convert board to ICell[][]
    const puzzle = SUDOKU_SIZE_ARR.map(() => [] as ICell[]);
    loop((x, y) =>
        puzzle[y][x] = {
            value: board[y][x],
            notes: new Set<number>(),
            isFixed: !!board[y][x]
        } as ICell
    );

    setHints(puzzle, solution, Math.round((DIFFICULTY.__LENGTH - difficulty) * 4 ));
    return {
        date: new Date(), difficulty, time: 0,
        puzzle, solution
    } as ISudoku;
}

function stringToBoard(s: string): Board {
    const board = SUDOKU_SIZE_ARR.map(() => [] as number[]);
    loop((j, i) => {
        const ind = i * SUDOKU_SIZE + j;
        board[i][j] = parseInt(s[ind]);
    });
    return board;
}

function solve(board: Board): Board {
    //Generate 3D array, SUDOKU_SIZE^3. The most nested dimension keeps track of which numbers are allowed, based on array index
    const possibleValues = SUDOKU_SIZE_ARR.map((_v, y) => {
        return SUDOKU_SIZE_ARR.map((_v, x) => {
            if (board[y][x]) return [];
            return SUDOKU_SIZE_ARR.map(() => true);
        });
    });
    //Find cell with least amount of possible values
    loop((x, y) => {
        const value = board[y][x];
        if (value) {
            const ind = value - 1; //Decrease since array is 0-based
            visitDeps(x, y, (tx, ty) => {
                possibleValues[ty][tx][ind] = false;
            });
        }
    });

    function getPossibleValues(x: number, y: number): number[] {
        const out = [] as number[];
        possibleValues[y][x].forEach((v, i) => v && out.push(i + 1));
        return out;
    }

    //Find cell with min values
    //Copy board (to optimize, all the cells with only one possible value will be set)
    const tempBoard = board.map(a => a.slice());
    let minArr = SUDOKU_SIZE_ARR as number[], minX = 0, minY = 0;
    loop((x, y) => {
        if (!board[y][x]) {
            const values = getPossibleValues(x, y);

            if (values.length === 0) throw InvalidBoardError;

            //This wont update any dependent cells, nor check if the value is still available
            if (values.length === 1) tempBoard[y][x] = values[0];

            if (values.length < minArr.length) {
                minArr = values;
                minX = x;
                minY = y;
            }
        }
    });

    //Else set one of those values
    for (const v of minArr) {
        //If the only available number was a single, this will set it again
        tempBoard[minY][minX] = v;
        //If the board is complete, return the board
        //Else return call recursively
        //If the recursive is successful, return it
        //Else remove the set value and try another one
        const validity = checkValidity(tempBoard);
        if (validity === SUDOKU_VALIDITY.Ok) return tempBoard;
        else if (validity === SUDOKU_VALIDITY.Empty) {
            try {
                return solve(tempBoard);
            } catch (e) {
                //Invalid board
            }
        }
    }
    throw InvalidBoardError;
}

function setHints(puzzle: ICell[][], solution: Board, count: number) {
    const freeCells = getFreeCells(puzzle);
    for (let i = 0; i < count && freeCells.length; i++) {
        const ind = Math.floor(Math.random() * freeCells.length);
        const c = freeCells[ind];
        const cell = puzzle[c.y][c.x];
        cell.value = solution[c.y][c.x];
        cell.isFixed = true;
        freeCells.splice(ind, 1);
    }
}

export function getFreeCells(puzzle: ICell[][]): ICoords[] {
    const freeCells = [] as ICoords[];
    loop((x, y) => {
        if (!puzzle[y][x].value) freeCells.push({x, y});
    });
    return freeCells;
}

export function checkValidity(board: Board, checkForCompleteness = true): SUDOKU_VALIDITY {
    try {
        //Check filled
        if (checkForCompleteness)
            loop(((x, y) => {
                if (!board[y][x]) throw InvalidBoardError;
            }));
        //Check rows
        for (let i = 0; i < board.length; i++) {
            const set = new Set<number>();
            for (let j = 0; j < board[i].length; j++) {
                set.add(board[i][j]);
            }
            if (set.size !== SUDOKU_SIZE) return SUDOKU_VALIDITY.InvalidEntry;
        }
        //Check columns
        for (let i = 0; i < board.length; i++) {
            const set = new Set<number>();
            for (let j = 0; j < board[i].length; j++) {
                set.add(board[j][i]);
            }
            if (set.size !== SUDOKU_SIZE) return SUDOKU_VALIDITY.InvalidEntry;
        }
        //Check squares
        for (let i = 0; i < SUDOKU_SIZE; i++) {
            const set = new Set<number>();
            const bx = i % SUDOKU_ROOT * SUDOKU_ROOT;
            const by = Math.floor(i / SUDOKU_ROOT) * SUDOKU_ROOT;
            for (let j = 0; j < SUDOKU_SIZE; j++) {
                const x = j % SUDOKU_ROOT + bx;
                const y = Math.floor(j / SUDOKU_ROOT) + by;
                set.add(board[y][x]);
            }
            if (set.size !== SUDOKU_SIZE) return SUDOKU_VALIDITY.InvalidEntry;
        }

        return SUDOKU_VALIDITY.Ok;
    } catch (e) {
        return SUDOKU_VALIDITY.Empty;
    }
}

export function loop(callback: (x: number, y: number) => unknown) {
    for (let i = 0; i < SUDOKU_SIZE; i++) {
        for (let j = 0; j < SUDOKU_SIZE; j++) {
            callback(j, i);
        }
    }
}

export function visitDeps(x: number, y: number, callback: (tx: number, ty: number) => unknown) {
    //Visit row
    SUDOKU_SIZE_ARR.forEach((_v, tx) => tx !== x && callback(tx, y));
    //Visit column
    SUDOKU_SIZE_ARR.forEach((_v, ty) => ty !== y && callback(x, ty));
    //Visit square
    const sx = Math.floor(x / SUDOKU_ROOT) * SUDOKU_ROOT, sy = Math.floor(y / SUDOKU_ROOT) * SUDOKU_ROOT;
    SUDOKU_SIZE_ARR.forEach((_v, i) => {
        const tx = sx + i % SUDOKU_ROOT;
        const ty = sy + Math.floor(i / SUDOKU_ROOT);
        //Use && instead of || to avoid double checking cells in the same row and column
        if (tx !== x && ty !== y)
            callback(tx, ty);
    });
}

function gradeSudokus() {
    Promise.all(puzzles.slice(0, 2500).map(gradeSudoku))
        .then(res => {
            console.log('Sorting');
            res.sort((a, b) => a.score < b.score ? -1 : 1);
            console.log('Done sorting');
            console.log(res.map(v => v.s));
        });
}

function gradeSudoku(s: string) {
    return new Promise<{ score: number, s: string }>(resolve => {
        const board = stringToBoard(s);
        //TODO Apply transformation
        const times = 1;
        //Find solution
        let total = 0, min = Number.MAX_SAFE_INTEGER, max = 0;
        for (let i = 0; i < times; i++) {
            const startTime = Date.now();
            solve(board);
            const t = Date.now() - startTime;
            total += t;
            min = Math.min(min, t);
            max = Math.max(max, t);
        }
        console.log({avg: total / times, min, max, total});
        resolve({score: total / times, s});
    });
}

// gradeSudokus();