export interface ICell {
    value: number,
    notes: number[],
    isFixed: boolean
}

export interface ISudoku {
    content: ICell[][],
    date: Date,
    time: number,
    difficulty: DIFFICULTY,
    solution: ICell[][]
}

export enum DIFFICULTY {Trivial, Easy, Medium, Hard}

export enum CELL_HIGHLIGHT {None, Soft, Main, Error}