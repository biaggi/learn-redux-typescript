import {
  ActionType,
  ActionSetMarsSize,
  ActionSetRobot,
  Orientation,
  ActionMoveRobotLeft,
} from './action-types';

export const setMarsSize = (marSize: {
  x: number;
  y: number;
}): ActionSetMarsSize => {
  return {
    type: ActionType.SetMarsSize,
    payload: { ...marSize },
  };
};

export const setRobot = (robot: {
  position: { x: number; y: number };
  orientation: Orientation;
  isLost: boolean;
}): ActionSetRobot => {
  return {
    type: ActionType.SetRobot,
    payload: { ...robot },
  };
};

export const moveRobotLeft = (): ActionMoveRobotLeft => {
  return {
    type: ActionType.MoveRobotLeft,
  };
};
