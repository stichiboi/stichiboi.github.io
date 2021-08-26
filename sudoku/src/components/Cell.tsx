import React, {useCallback} from "react";
import {CELL_HIGHLIGHT, ICell} from "../types/types";

export default function Cell({
                                 cell,
                                 onClick,
                                 highlight
                             }: { cell: ICell, onClick: () => unknown, highlight?: CELL_HIGHLIGHT }) {

    const formatNotes = useCallback((notes: Set<number>) => {
        return [...notes]
            .sort((a, b) => a < b ? -1 : 1)
            .map(n => (
                <p key={n}>{n}</p>
            ));
    }, []);

    const highlightClass = highlight ? CELL_HIGHLIGHT[highlight].toLowerCase() : '';

    return (
        <button
            className={`button-action fill ${highlightClass ? 'highlight-' + highlightClass : ''} ${cell.isFixed ? '--fixed' : ''}`}
            onClick={onClick}>
            {cell.value || <div className={"cell-notes"}>{formatNotes(cell.notes)}</div>}
        </button>
    )
}