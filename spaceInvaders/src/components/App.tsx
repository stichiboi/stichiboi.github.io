import ReactDOM from "react-dom";
import React, {CSSProperties, useCallback, useEffect, useMemo, useRef, useState} from "react";
import Player from "./Player";
import ActionButton from "./ActionButton";
import {Cancel, PauseOutline} from "iconoir-react";
import {GameLoopFunc, ICoords} from "../types/types";
import Projectile from "./Projectile";

const BF_SIZE = {
    h: 300,
    w: 300
}

ReactDOM.render(<App/>, document.getElementById('root'));

function App() {
    const appSize = useMemo(() => ({
        "--battlefield-width": `${BF_SIZE.w}px`,
        "--battlefield-height": `${BF_SIZE.h}px`
    } as CSSProperties), []);
    const gameLoopFunctions = useRef({} as { [key: string]: GameLoopFunc });
    const prevFrameTime = useRef(Date.now());
    const isPaused = useRef(false);
    const setGameLoopFunction = useCallback((id: string, func: GameLoopFunc) => {
        gameLoopFunctions.current[id] = func;
    }, []);

    const [projectiles, setProjectiles] = useState({} as { [key: string]: JSX.Element });
    const [playerPosition, setPlayerPosition] = useState({x: 0, y: 0} as ICoords);

    const onShoot = useCallback((coords: ICoords) => {
        const id = 'projectile-' + Math.random().toString().slice(2);
        setProjectiles(prev => ({
            ...prev,
            [id]: <Projectile
                key={id}
                id={id}
                battlefieldHeight={BF_SIZE.h}
                xCoordinate={coords.x}
                setGameLoopFunction={setGameLoopFunction}
                onOutOfBounds={id => {
                    delete gameLoopFunctions.current[id];
                    setProjectiles(prev => {
                        const newProj = {...prev};
                        delete newProj[id];
                        return newProj;
                    });
                }}
                onMove={() => {
                }}/>
        }));
    }, [playerPosition]);

    //Game loop
    useEffect(() => {
        const id = setInterval(() => {
            if (!isPaused.current) {
                const dt = Date.now() - prevFrameTime.current;
                Object.values(gameLoopFunctions.current).forEach(f => f(dt));
            }
            prevFrameTime.current = Date.now();
        }, 1000 / 30);
        return () => clearInterval(id);
    }, []);

    return (
        <main className={"app-container main-ui --vertical"} style={appSize}>
            <header className={"app-header"}>
                <ActionButton icon={<Cancel/>} onClick={() => console.log("quitting")}/>
                <h3>{"Score: 1120"}</h3>
                <ActionButton
                    icon={<PauseOutline/>}
                    onClick={() => isPaused.current = !isPaused.current}
                />
            </header>
            <section className={"battlefield"}>
                {Object.values(projectiles)}
            </section>
            <section className={"player-area"}>
                <Player
                    battlefieldWidth={BF_SIZE.w}
                    setGameLoopFunction={setGameLoopFunction}
                    onMove={coords => setPlayerPosition(coords)}
                    onShoot={onShoot}
                />
            </section>
        </main>
    );
}