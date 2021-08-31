import ReactDOM from "react-dom";
import React, {CSSProperties, Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef, useState} from "react";
import Player from "./Player";
import ActionButton from "./ActionButton";
import {Cancel, PauseOutline} from "iconoir-react";
import {Dict, GameLoopFunc, ICoords, IRect, ISize} from "../types/types";
import Projectile from "./Projectile";
import {BF_SIZE, INVADER_COLUMNS, INVADER_ROWS, INVADER_SIZE, PROJ_SIZE, SHIP_SIZE} from "../settings";
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
    const projPositions = useRef({} as Dict<ICoords>);

    const [invadersProjectiles, setInvadersProjectiles] = useState({} as Dict<JSX.Element>);
    const invadersProjPositions = useRef({} as Dict<ICoords>);

    const [invaders, setInvaders] = useState({} as Dict<JSX.Element>);
    const invadersPositions = useRef({} as Dict<ICoords>);

    const playerPosition = useRef({} as ICoords);

    const coordsToRect = useCallback((dic: Dict<ICoords>, size: ISize) => {
        return Object.keys(dic).reduce((prev, curr) => {
            prev[curr] = {...dic[curr], ...size};
            return prev;
        }, {} as Dict<IRect>);
    }, []);

    const checkCollision = useCallback((target: IRect, objects: Dict<IRect>) => {
        return Object.keys(objects).find(id => {
            const obj = objects[id];
            return (target.x < obj.x + obj.w &&
                target.x + target.w > obj.x &&
                target.y < obj.y + obj.h &&
                target.y + target.h > obj.y);
        });
    }, []);

    const checkCollisions = useRef(() => {

        function deleteProjectile(id: string,
                                  posDic: React.MutableRefObject<Dict<ICoords>>,
                                  elementsSetState: Dispatch<SetStateAction<Dict<JSX.Element>>>) {
            delete gameLoopFunctions.current[id];
            delete posDic.current[id];
            elementsSetState(prev => {
                const next = {...prev};
                delete next[id];
                return next;
            });
        }

        //Player - Projectiles
        const hitPlayer = checkCollision(
            {...playerPosition.current, ...SHIP_SIZE},
            coordsToRect(invadersProjPositions.current, PROJ_SIZE)
        );
        if (hitPlayer) {
            deleteProjectile(hitPlayer, invadersProjPositions, setInvadersProjectiles);
        }

        //Invaders - Projectiles
        const projectilesRect = coordsToRect(projPositions.current, PROJ_SIZE);
        Object.keys(invadersPositions.current).forEach(id => {
            const rect = {...invadersPositions.current[id], ...INVADER_SIZE};
            const hitInvader = checkCollision(rect, projectilesRect);
            if (hitInvader) {
                delete gameLoopFunctions.current[id];
                delete invadersPositions.current[id];
                setInvaders(prev => {
                    const newInv = {...prev};
                    delete newInv[id];
                    return newInv;
                });

                deleteProjectile(hitInvader, projPositions, setProjectiles);
                delete projectilesRect[hitInvader];
            }
        });
    });

    const onShoot = useCallback((coords: ICoords, isInvader?: boolean) => {
        const id = `proj-${Math.random().toString().slice(2)}-${isInvader ? 'i' : 'p'}`;
        const setFunction = isInvader ? setInvadersProjectiles : setProjectiles;
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
                    isInvader ? delete invadersProjPositions.current[id] : delete projPositions.current[id];
                    setFunction(prev => {
                        const newProj = {...prev};
                        delete newProj[id];
                        return newProj;
                    });
                }}
                onMove={coords => {
                    isInvader ? invadersProjPositions.current[id] = coords : projPositions.current[id] = coords;
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
                        onMove={coords => invadersPositions.current[id] = coords}
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
                //Check collisions
                checkCollisions.current();
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
                <section className={"player-area"}>
                    <Player
                        setGameLoopFunction={setGameLoopFunction}
                        onMove={coords => playerPosition.current = coords}
                        onShoot={coords => onShoot(coords, false)}
                    />
                </section>
            </section>
        </main>
    );
}