import ReactDOM from "react-dom";
import React, {CSSProperties, useCallback, useEffect, useMemo, useRef, useState} from "react";
import Player from "./Player";
import ActionButton from "./ActionButton";
import {Cancel, PauseOutline} from "iconoir-react";
import {Dict, GameLoopFunc, ICoords} from "../types/types";
import Projectile from "./Projectile";
import {BF_SIZE, INVADER_COLUMNS, INVADER_ROWS} from "../settings";
import Invader from "./Invader";

ReactDOM.render(<App/>, document.getElementById('root'));

function App() {
    const appSize = useMemo(() => ({
        "--battlefield-width": `${BF_SIZE.w}px`,
        "--battlefield-height": `${BF_SIZE.h}px`
    } as CSSProperties), []);
    const gameLoopFunctions = useRef({} as Dict<GameLoopFunc>);
    const prevFrameTime = useRef(Date.now());
    const isPaused = useRef(false);
    const setGameLoopFunction = useCallback((id: string, func: GameLoopFunc) => {
        gameLoopFunctions.current[id] = func;
    }, []);

    const [projectiles, setProjectiles] = useState({} as Dict<JSX.Element>);
    const [invadersProjectiles, setInvadersProjectiles] = useState({} as Dict<JSX.Element>);
    const [invaders, setInvaders] = useState({} as Dict<JSX.Element>);
    const [invadersPositions, setInvadersPosition] = useState({} as Dict<ICoords>);
    const setInvaderPosition = useCallback((id: string, coords: ICoords) => {
        setInvadersPosition(prev => {
            const newPosition = {...prev};
            newPosition[id] = coords;
            return newPosition;
        });
    }, [setInvadersPosition]);
    const [playerPosition, setPlayerPosition] = useState({x: 0, y: 0} as ICoords);

    const onShoot = useCallback((coords: ICoords, isInvader?: boolean) => {
        const id = `proj-${Math.random().toString().slice(2)}-${isInvader ? 'i' : 'p'}`;
        const setFunction = isInvader ? setInvadersProjectiles : setProjectiles;
        console.log('Setting projectile', id);
        setFunction(prev => ({
            ...prev,
            [id]: <Projectile
                key={id} id={id}
                isInvaderProjectile={!!isInvader}
                startCoords={coords}
                battlefieldHeight={BF_SIZE.h}
                setGameLoopFunction={setGameLoopFunction}
                onOutOfBounds={id => {
                    delete gameLoopFunctions.current[id];
                    setFunction(prev => {
                        const newProj = {...prev};
                        delete newProj[id];
                        return newProj;
                    });
                }}
                onMove={() => {
                }}/>
        }));
    }, [setInvadersProjectiles, setProjectiles]);

    //Set invaders
    useEffect(() => {
        const invaders = {} as { [key: string]: JSX.Element };
        for (let r = 0; r < INVADER_ROWS; r++) {
            for (let c = 0; c < INVADER_COLUMNS; c++) {
                const id = `invader-${r}-${c}`;
                invaders[id] =
                    <Invader
                        key={id} id={id} column={c} row={r}
                        onShoot={coords => onShoot(coords, true)}
                        onMove={coords => setInvaderPosition(id, coords)}
                        setGameLoopFunction={setGameLoopFunction}/>
            }
        }
        setInvaders(invaders);
    }, []);

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
                {Object.values(invaders)}
                {Object.values(invadersProjectiles)}
                {Object.values(projectiles)}
            </section>
            <section className={"player-area"}>
                <Player
                    setGameLoopFunction={setGameLoopFunction}
                    onMove={coords => setPlayerPosition(coords)}
                    onShoot={coords => onShoot(coords, false)}
                />
            </section>
        </main>
    );
}