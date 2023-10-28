type MessageEventFunction<T = any> = (data: MessageEvent<T>) => void

type Setter<T> = React.Dispatch<React.SetStateAction<T>>

type GUID = `${string}-${string}-${string}-${string}-${string}`

type WebSocketData = string | ArrayBufferLike | Blob | ArrayBufferView

type ActionMessage<T = any> = {
  readonly action: import("../utils/actions").GameAction
  readonly data?: T
}

type Action<T> = (obj: T) => void

type BiAction<T1, T2> = (obj1: T1, obj2: T2) => void

type Predicate<T> = (obj: T) => boolean

type SelectedDice = {
  value: number
  index: number
}

type Position = { x: number; y: number }

type GameMap = number[][]

type DirectionalPosition = {
  at: Position
  direction: import("../game/direction").Direction
}

type Path = {
  path?: Position[] | null
  // TODO replace with DirectionalPosition
  end: Position
  direction: import("../game/direction").Direction
}

type Game = {
  readonly id: string
  readonly count: number
  readonly isGameStarted: boolean
}

type User = {
  readonly username: string
  readonly password: string
  readonly colour?: import("../game/colour").Colour
}

type Api<T = ApiRequest> = (path: string, data?: ApiRequest & T) => Promise<Response>

type ApiRequest = {
  headers?: HeadersInit
  body?: any
}

type JoinGameData = {
  readonly username: string
  readonly gameId: GUID
}

type CreateGameData = {
  readonly player: PlayerProps
  readonly spawns: DirectionalPosition[]
}
