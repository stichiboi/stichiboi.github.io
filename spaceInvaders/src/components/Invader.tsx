import React, {useCallback, useEffect, useRef, useState} from "react";
import {IInvaderProps, MOVE_DIR} from "../types/types";
import InvaderIcon from "../icons/invader.svg";
import {BF_SIZE, INVADER_COLUMNS, INVADER_RELOAD, INVADER_SIZE, INVADER_SPACING, INVADER_SPEED} from "../settings";

export default function Invader({
                                    id,
                                    setGameLoopFunction,
                                    onMove,
                                    onShoot,
                                    column,
                                    row
                                }: IInvaderProps) {

    const xPos = useRef(column * (INVADER_SIZE.w + INVADER_SPACING.w));
    const yPos = useRef(row * (INVADER_SIZE.h + INVADER_SPACING.h));
    const isMovingDown = useRef(false);
    const downwardMovement = useRef(0);
    const moveDir = useRef(MOVE_DIR.RIGHT);
    const reloadTimer = useRef(Math.random() * INVADER_RELOAD);
    const [positionStyle, _setPositionStyle] = useState({} as React.CSSProperties);
    const setPositionStyle = useCallback((x: number, y: number) => {
        _setPositionStyle({"--position-x": `${x}px`, "--position-y": `${y}px`} as React.CSSProperties);
    }, [_setPositionStyle]);

    useEffect(() => {
        setGameLoopFunction(id, dt => {
            reloadTimer.current += dt;
            if (reloadTimer.current >= INVADER_RELOAD) {
                onShoot({
                    x: xPos.current + INVADER_SIZE.w / 2,
                    y: yPos.current + INVADER_SIZE.h
                });
                reloadTimer.current = 0;
            }

            const movementUnits = INVADER_SPEED * dt;
            if (isMovingDown.current) {
                yPos.current += movementUnits;
                downwardMovement.current += movementUnits;
                if (downwardMovement.current >= INVADER_SPACING.h + INVADER_SIZE.h) {
                    //Reverse direction, since LEFT = -1 and RIGHT = 1
                    moveDir.current *= -1;
                    isMovingDown.current = false;
                    downwardMovement.current = 0;
                }
            } else {
                const nextPosition = xPos.current + movementUnits * moveDir.current;
                const boundsRight = BF_SIZE.w
                    - (INVADER_SIZE.w + INVADER_SPACING.w)
                    * (INVADER_COLUMNS - column)
                    + INVADER_SPACING.w;
                const boundsLeft = (INVADER_SIZE.w + INVADER_SPACING.w) * column;
                if (nextPosition >= boundsLeft && nextPosition <= boundsRight) {
                    xPos.current = nextPosition;
                } else {
                    xPos.current = moveDir.current === MOVE_DIR.LEFT ? boundsLeft : boundsRight;
                    isMovingDown.current = true;
                }
            }
            onMove({x: xPos.current, y: yPos.current});
            setPositionStyle(xPos.current, yPos.current);
        });
    }, []);

    return (
        <div className={"game-component invader"} style={positionStyle}>
            <InvaderIcon/>
        </div>
    )
}