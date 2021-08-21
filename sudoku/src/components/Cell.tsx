import React from "react";
import {CELL_HIGHLIGHT, ICell} from "../types/types";

export default function Cell({
                                 cell,
                                 onClick,
                                 highlight
                             }: { cell: ICell, onClick: () => unknown, highlight?: CELL_HIGHLIGHT }) {
    return (
        <button
            className={`button-action fill ${highlight ? 'highlight-' + CELL_HIGHLIGHT[highlight].toLowerCase() : ''}`}
            onClick={onClick}>
            {cell.value || cell.notes}
        </button>
    )
}