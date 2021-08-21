import React, {useCallback} from "react";
import {CELL_HIGHLIGHT, ICell} from "../types/types";

export default function Cell({
                                 cell,
                                 onClick,
                                 highlight
                             }: { cell: ICell, onClick: () => unknown, highlight?: CELL_HIGHLIGHT }) {

    const formatNotes = useCallback((notes: Set<number>) => {
        const components = [] as JSX.Element[];
        notes.forEach(n => components.push((
            <p key={n}>{n}</p>
        )));
        return components;
    }, []);

    return (
        <button
            className={`button-action fill ${highlight ? 'highlight-' + CELL_HIGHLIGHT[highlight].toLowerCase() : ''} ${cell.isFixed ? '--fixed' : ''}`}
            onClick={onClick}>
            {cell.value || <div className={"cell-notes"}>{formatNotes(cell.notes)}</div>}
        </button>
    )
}