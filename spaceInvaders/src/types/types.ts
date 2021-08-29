export interface IGameLoopProps {
    setGameLoopFunction: (id: string, func: GameLoopFunc) => unknown,
    onMove: (coords: ICoords) => unknown
}

export type GameLoopFunc = (dt: number) => unknown;

export interface IPlayerProps extends IGameLoopProps {
    battlefieldWidth: number,
    onShoot: (coords: ICoords) => unknown
}

export interface IProjectileProps extends IGameLoopProps {
    battlefieldHeight: number,
    xCoordinate: number,
    id: string,
    onOutOfBounds: (id: string) => unknown
}


export interface ICoords {
    x: number,
    y: number
}