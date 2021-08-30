import React, {useEffect, useMemo, useState} from "react";
import {IProjectileProps} from "../types/types";
import ProjectileIcon from '../icons/projectile.svg';
import {PROJ_SIZE, PROJ_SPEED, SHIP_SIZE} from "../settings";

export default function Projectile({
                                       id,
                                       setGameLoopFunction,
                                       onMove,
                                       onOutOfBounds,
                                       battlefieldHeight,
                                       isInvaderProjectile,
                                       startCoords
                                   }: IProjectileProps) {

    const [position, setPosition] = useState(startCoords.y);
    const positionStyle = useMemo(() => ({
            "--position-x": `${startCoords.x - PROJ_SIZE.w / 2}px`,
            "--position-y": `${position}px`
        } as React.CSSProperties),
        [position]);
    useEffect(() => {
        setGameLoopFunction(id, (dt) => {
            const dPos = PROJ_SPEED * dt * (isInvaderProjectile ? -1 : 1);
            setPosition(prev => prev + dPos);
        });
    }, []);

    useEffect(() => {
        if (position < battlefieldHeight + SHIP_SIZE.h * 2 && position > -PROJ_SIZE.h * 4) {
            onMove({x: startCoords.x - PROJ_SIZE.w / 2, y: position});
        } else {
            onOutOfBounds(id);
        }
    }, [position]);

    return (
        <div className={`game-component projectile ${isInvaderProjectile ? 'invader-projectile' : ''}`}
             style={positionStyle}>
            <ProjectileIcon/>
        </div>
    )
}