import {DIFFICULTY, ICell, InvalidBoardError, ISudoku} from "./types/types";
import puzzles from './puzzles.json';

const SUDOKU_SIZE = 9;
// const puzzles = JSON.parse(require('./puzzles.json')) as string[];
const difficultyRangeSize = puzzles.length / DIFFICULTY.__LENGTH;
const SUDOKU_SIZE_ARR = Array.from({length: SUDOKU_SIZE});
type Board = number[][];

export function generateSudoku(difficulty: DIFFICULTY): ISudoku {
    const ind = Math.floor((Math.random() + difficulty) * difficultyRangeSize);
    const asString = puzzles[ind];
    const board = stringToBoard(asString);
    //TODO Apply transformation

    //Find solution
    const solution = solve(board);

    //Convert board to ICell[][]
    const puzzle = SUDOKU_SIZE_ARR.map(() => [] as ICell[]);
    loop((x, y) =>
        puzzle[y][x] = {
            value: board[y][x],
            notes: new Set<number>(),
            isFixed: !!board[y][x]
        } as ICell);

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

function solve(board: Board): Board | void {

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
        if (isValid(tempBoard)) return tempBoard;
        try {
            return solve(tempBoard);
        } catch (e) {
            //Invalid board
        }
    }
    throw InvalidBoardError;
}

//
// function transformBoard(board: Board): Board {
//
// }
//
// function rotate(board: Board): Board {
//
// }
//
// function switchRows(board: Board): Board {
//
// }
//
// function switchColumns(board: Board): Board {
//
// }

function isValid(board: Board): boolean {
    //TODO Check that the numbers respect the sudoku rules
    try {
        loop((x, y) => {
            if (!board[y][x]) throw InvalidBoardError;
        });
        return true;
    } catch (e) {
        return false;
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
    const arr = Array.from({length: SUDOKU_SIZE});
    //Visit row
    arr.forEach((_v, tx) => tx !== x && callback(tx, y));
    //Visit column
    arr.forEach((_v, ty) => ty !== y && callback(x, ty));
    //Visit square
    const root = Math.floor(Math.sqrt(SUDOKU_SIZE));
    const sx = Math.floor(x / root) * root, sy = Math.floor(y / root) * root;
    arr.forEach((_v, i) => {
        const tx = sx + i % root;
        const ty = sy + Math.floor(i / root);
        //Use && instead of || to avoid double checking cells in the same row and column
        if (tx !== x && ty !== y)
            callback(tx, ty);
    });
}