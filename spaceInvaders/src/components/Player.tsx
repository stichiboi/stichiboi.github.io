import React, {useCallback, useEffect, useRef, useState} from "react";
import StarshipIcon from '../icons/starship.svg';
import {IPlayerProps} from "../types/types";

const MOVE_SPEED = 8 / 30;
const SHIP_WIDTH = 25;
const RELOAD_TIME = 500;

enum MOVE {LEFT = -1, STILL, RIGHT}

export default function Player({
                                   battlefieldWidth,
                                   setGameLoopFunction,
                                   onMove,
                                   onShoot
                               }: IPlayerProps) {
    const canShoot = useRef(true);
    const reloadTimer = useRef(RELOAD_TIME);
    const isShooting = useRef(true);

    const position = useRef((battlefieldWidth - SHIP_WIDTH) / 2);
    const [positionStyle, _setPositionStyle] = useState({} as React.CSSProperties);
    const setPositionStyle = useCallback((position: number) => {
        _setPositionStyle({"--position-x": `${position}px`} as React.CSSProperties);
    }, [_setPositionStyle]);
    const moveDirection = useRef(MOVE.STILL);

    const shoot = useCallback(() => {
        if (canShoot.current) {
            onShoot({x: position.current + SHIP_WIDTH / 2, y: 0});
            canShoot.current = false;
            reloadTimer.current = 0;
        }
    }, [position, canShoot, onShoot]);

    //Game loop
    useEffect(() => {
        function setPosition(dt: number) {
            const dPos = moveDirection.current * MOVE_SPEED * dt;
            const nextPosition = position.current + dPos;
            const bounds = battlefieldWidth - SHIP_WIDTH;
            if (nextPosition >= 0 && nextPosition <= bounds) {
                position.current = nextPosition;
            } else {
                position.current = moveDirection.current === MOVE.LEFT ? 0 : bounds;
            }
            onMove({x: position.current, y: 0});
            setPositionStyle(position.current);
        }

        setPosition(0);
        setGameLoopFunction("player", (dt) => {
            reloadTimer.current += dt;
            if (reloadTimer.current >= RELOAD_TIME && isShooting.current) {
                canShoot.current = true;
                shoot();
            }
            if (moveDirection.current !== MOVE.STILL) {

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
                    moveDirection.current = MOVE.LEFT;
                    break;
                case "ArrowRight":
                    moveDirection.current = MOVE.RIGHT;
                    break;
            }
        });
        window.addEventListener('keyup', ev => {
            const key = ev.key;
            switch (key) {
                case "ArrowLeft":
                    if (moveDirection.current === MOVE.LEFT)
                        moveDirection.current = MOVE.STILL;
                    break;
                case "ArrowRight":
                    if (moveDirection.current === MOVE.RIGHT)
                        moveDirection.current = MOVE.STILL;
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