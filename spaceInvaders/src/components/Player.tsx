import React, {useCallback, useEffect, useState} from "react";
import StarshipIcon from '../icons/starship.svg';

const MOVE_SPEED = 5;
const RELOAD_TIME = 500;

export default function Player({onMove, onShoot}: { onMove: (x: number) => unknown, onShoot: () => unknown }) {
    const [canShoot, setCanShoot] = useState(true);
    const [reloading, setReloading] = useState(false);
    const [position, setPosition] = useState(0);

    const shoot = useCallback(() => {
        if (canShoot) {
            onShoot();
            setCanShoot(false);
        }
    }, []);

    useEffect(() => {
        if (!canShoot && !reloading) {
            setReloading(true);
            setTimeout(() => {
                setReloading(false);
            }, RELOAD_TIME);
        }
    }, [canShoot]);

    useEffect(() => {
        if (!reloading) {
            setCanShoot(true);
        }
    }, [reloading]);

    useEffect(() => {
        onMove(position);
    }, [position]);

    //Set commands
    useEffect(() => {
        window.addEventListener('keydown', ev => {
            const key = ev.key;
            switch (key) {
                case "Space":
                    shoot();
                    break;
                case "ArrowLeft":
                    setPosition(prev => prev - MOVE_SPEED);
                    break;
                case "ArrowRight":
                    setPosition(prev => prev + MOVE_SPEED);
                    break;
            }
        });
    }, []);


    return (
        <div className={"starship-container"}>
            <StarshipIcon/>
        </div>
    )
}