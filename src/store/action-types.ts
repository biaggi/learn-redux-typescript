export enum ActionType {
  SetMarsSize = '@mars/SetMarsSize',
  SetRobot = '@mars/SetRobot',
}

export interface ActionSetMarsSize {
  type: ActionType.SetMarsSize;
  payload: { x: number; y: number };
}

export enum Orientation {
  North = 'N',
  South = 'S',
  East = 'E',
  West = 'W',
}

export interface ActionSetRobot {
  type: ActionType.SetRobot;
  payload: {
    position: { x: number; y: number };
    orientation: Orientation;
    isLost: boolean;
  };
}

export type Action = ActionSetMarsSize | ActionSetRobot;
