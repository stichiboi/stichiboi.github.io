export interface ICell {
    value: number,
    notes: Set<number>,
    isFixed: boolean
}

export interface ISudoku {
    puzzle: ICell[][],
    date: Date,
    time: number,
    difficulty: DIFFICULTY,
    solution: number[][]
}

export enum DIFFICULTY {Trivial, Easy, Medium, Hard, __LENGTH}

export enum CELL_HIGHLIGHT {None, Soft, Main, Error}

export class InvalidBoardError extends Error {
}