import { ThunkAction } from 'redux-thunk';
import { AnyAction } from 'redux';
import { Orientation } from './marsReducer';
export enum ActionType {
  SetMarsSize = '@mars/SetMarsSize',
  SetRobot = '@mars/SetRobot',
  SetRobotLost = '@mars/SetRobotLost',
  MoveRobotLeft = '@mars/robot/left',
  MoveRobotRight = '@mars/robot/right',
  MoveRobotFront = '@mars/robot/front',
  MoveRobot = '@mars/robot/move',
  MoveRobotPending = '@mars/robot/move/rejected',
}
import { Robot } from './marsReducer';

export interface ActionSetMarsSize {
  type: ActionType.SetMarsSize;
  payload: { x: number; y: number };
}

export interface ActionSetRobot {
  type: ActionType.SetRobot;
  payload: Robot;
}

export interface ActionSetRobotLost {
  type: ActionType.SetRobotLost;
}

export interface ActionMoveRobotLeft {
  type: ActionType.MoveRobotLeft;
}

export interface ActionMoveRobotRight {
  type: ActionType.MoveRobotRight;
}

export interface ActionMoveRobotFront {
  type: ActionType.MoveRobotFront;
}

export interface ActionMoveRobotPending {
  type: ActionType.MoveRobotPending;
}

export interface ActionMoveRobot {
  type: ActionType.MoveRobot;
  payload: {
    orders: string;
  };
}

export type Action =
  | ActionSetMarsSize
  | ActionSetRobot
  | ActionMoveRobotLeft
  | ActionMoveRobotRight
  | ActionMoveRobotFront
  | ActionMoveRobot
  | ActionSetRobotLost
  | ActionMoveRobotPending;
