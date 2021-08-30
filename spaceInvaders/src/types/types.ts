export enum MOVE_DIR {LEFT = -1, STILL, RIGHT, DOWN}

export interface Dict<T> {
    [key: string]: T;
}

export interface IGameLoopProps {
    setGameLoopFunction: (id: string, func: GameLoopFunc) => unknown,
    onMove: (coords: ICoords) => unknown
}

export type GameLoopFunc = (dt: number) => unknown;

export interface IPlayerProps extends IGameLoopProps {
    onShoot: (coords: ICoords) => unknown
}

export interface IProjectileProps extends IGameLoopProps {
    battlefieldHeight: number,
    id: string,
    onOutOfBounds: (id: string) => unknown,
    isInvaderProjectile: boolean,
    startCoords: ICoords
}

export interface IInvaderProps extends IPlayerProps {
    id: string,
    column: number,
    row: number
}


export interface ICoords {
    x: number,
    y: number
}