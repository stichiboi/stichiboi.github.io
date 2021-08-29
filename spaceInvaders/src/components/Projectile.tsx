import React, {useEffect, useMemo, useState} from "react";
import {IProjectileProps} from "../types/types";
import ProjectileIcon from '../icons/projectile.svg';

const PROJECTILE_SPEED = -15 / 30;
const PROJECTILE_HEIGHT = 14;
const PROJECTILE_WIDTH = 6;

export default function Projectile({
                                       id,
                                       setGameLoopFunction,
                                       xCoordinate,
                                       onMove,
                                       onOutOfBounds,
                                       battlefieldHeight
                                   }: IProjectileProps) {

    const [position, setPosition] = useState(battlefieldHeight - PROJECTILE_HEIGHT / 2);
    const positionStyle = useMemo(() => ({
            "--position-x": `${xCoordinate - PROJECTILE_WIDTH / 2}px`,
            "--position-y": `${position}px`
        } as React.CSSProperties),
        [position]);
    useEffect(() => {
        setGameLoopFunction(id, (dt) => {
            const dPos = PROJECTILE_SPEED * dt;
            setPosition(prev => prev + dPos);
        });
    }, []);

    useEffect(() => {
        if (position < -PROJECTILE_HEIGHT * 3) {
            onOutOfBounds(id);
        } else {
            onMove({x: xCoordinate - PROJECTILE_WIDTH / 2, y: position});
        }
    }, [position]);

    return (
        <div className={"game-component projectile"} style={positionStyle}>
            <ProjectileIcon/>
        </div>
    )
}