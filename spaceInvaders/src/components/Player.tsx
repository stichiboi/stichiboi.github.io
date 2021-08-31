import React, {useCallback, useEffect, useRef, useState} from "react";
import StarshipIcon from '../icons/starship.svg';
import {IPlayerProps, MOVE_DIR} from "../types/types";
import {BF_SIZE, SHIP_RELOAD, SHIP_SIZE, SHIP_SPEED} from "../settings";

export default function Player({
                                   setGameLoopFunction,
                                   onMove,
                                   onShoot
                               }: IPlayerProps) {
    const canShoot = useRef(true);
    const reloadTimer = useRef(SHIP_RELOAD);
    const isShooting = useRef(true);

    const position = useRef((BF_SIZE.w - SHIP_SIZE.w) / 2);
    const [positionStyle, _setPositionStyle] = useState({} as React.CSSProperties);
    const setPositionStyle = useCallback((position: number) => {
        _setPositionStyle({"--position-x": `${position}px`} as React.CSSProperties);
    }, [_setPositionStyle]);
    const moveDirection = useRef(MOVE_DIR.STILL);

    const shoot = useCallback(() => {
        if (canShoot.current) {
            onShoot({x: position.current + SHIP_SIZE.w / 2, y: BF_SIZE.h - SHIP_SIZE.h});
            canShoot.current = false;
            reloadTimer.current = 0;
        }
    }, [position, canShoot, onShoot]);

    //Game loop
    useEffect(() => {
        function setPosition(dt: number) {
            const dPos = moveDirection.current * SHIP_SPEED * dt;
            const nextPosition = position.current + dPos;
            const bounds = BF_SIZE.w - SHIP_SIZE.w;
            if (nextPosition >= 0 && nextPosition <= bounds) {
                position.current = nextPosition;
            } else {
                position.current = moveDirection.current === MOVE_DIR.LEFT ? 0 : bounds;
            }
            onMove({x: position.current, y: BF_SIZE.h - SHIP_SIZE.h});
            setPositionStyle(position.current);
        }

        setPosition(0);
        setGameLoopFunction("player", (dt) => {
            reloadTimer.current += dt;
            if (reloadTimer.current >= SHIP_RELOAD && isShooting.current) {
                canShoot.current = true;
                shoot();
            }
            if (moveDirection.current !== MOVE_DIR.STILL) {
                setPosition(dt);
            }
        });
    }, []);

    //Set commands
    useEffect(() => {
        window.addEventListener('keydown', ev => {
            const key = ev.key;
            switch (key) {
                case "ArrowLeft":
                    moveDirection.current = MOVE_DIR.LEFT;
                    break;
                case "ArrowRight":
                    moveDirection.current = MOVE_DIR.RIGHT;
                    break;
            }
        });
        window.addEventListener('keyup', ev => {
            const key = ev.key;
            switch (key) {
                case "ArrowLeft":
                    if (moveDirection.current === MOVE_DIR.LEFT)
                        moveDirection.current = MOVE_DIR.STILL;
                    break;
                case "ArrowRight":
                    if (moveDirection.current === MOVE_DIR.RIGHT)
                        moveDirection.current = MOVE_DIR.STILL;
                    break;
            }
        });
    }, []);

    return (
        <div className={"game-component"} style={positionStyle}>
            <StarshipIcon/>
        </div>
    )
}