import React, {ReactChild, useMemo} from 'react';


export default function SudokuGrid({size, contents, isSmall} : {size: number, contents: ReactChild[], isSmall?: boolean}){
    const lineSet = useMemo(() => Array.from({length: size-1}).map((x, i) => <hr key={i}/>), [size]);

    return (
        <div className={`sudoku-grid ${isSmall ? 'small' : ''}`}>
            <div className={"sudoku-line-set"}>{lineSet}</div>
            <div className={"sudoku-line-set"}>{lineSet}</div>
            <div className={"sudoku-grid-contents"}>
                {contents.map((c, i) => <div className={"sudoku-grid-content-wrapper"} key={i}>{c}</div>)}
            </div>
        </div>
    )
}