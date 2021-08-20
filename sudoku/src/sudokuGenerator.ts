import {DIFFICULTY, ICell, ISudoku} from "./types/types";

const SUDOKU_SIZE = 9;

export function generateSudoku(difficulty: DIFFICULTY): ISudoku {
    const board = Array.from({length: SUDOKU_SIZE}).map(() => [] as ICell[]);
    for (let i = 0; i < SUDOKU_SIZE; i++) {
        for (let j = 0; j < SUDOKU_SIZE; j++) {
            board[i][j] = {
                isFixed: true,
                value: Math.floor(Math.random() * 9) + 1
            } as ICell;
        }
    }

    return {content: board, solution: board, date: new Date(), difficulty, time: 0} as ISudoku;
}