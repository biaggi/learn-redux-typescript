export enum ActionType {
  SetMarsSize = '@mars/SetMarsSize',
  SetRobot = '@mars/SetRobot',
  MoveRobotLeft = '@mars/robot/left',
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

export interface ActionMoveRobotLeft {
  type: ActionType.MoveRobotLeft;
}

export type Action = ActionSetMarsSize | ActionSetRobot | ActionMoveRobotLeft;
