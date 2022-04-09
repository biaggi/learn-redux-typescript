import { Action, ActionType, Orientation } from './action-types';

export interface MarsState {
  marsSize?: { x: number; y: number };
  lostRobots?: { x: number; y: number }[];
  robot?: {
    position: { x: number; y: number };
    isLost: boolean;
    orientation: Orientation;
  };
}

const initialState: MarsState = {};
const MAXSIZE = 50;

export const marsReducer = (
  state: MarsState = initialState,
  action: Action
) => {
  const { type } = action;
  const orientations = [
    Orientation.West,
    Orientation.North,
    Orientation.East,
    Orientation.South,
    Orientation.East,
    Orientation.North,
  ];
  switch (type) {
    case ActionType.SetMarsSize:
      const { x, y } = action.payload;
      const checkSize = (value: number) => (value > MAXSIZE ? MAXSIZE : value);
      state.marsSize = { x: checkSize(x), y: checkSize(y) };
      return state;
    case ActionType.SetRobot:
      if (!state.marsSize) return {};
      state.robot = { ...action.payload };
      return state;
    case ActionType.MoveRobotLeft:
      if (!state.robot) {
        return state;
      }
      const currentOrientation = state.robot?.orientation;
      const index = orientations.indexOf(currentOrientation)
      state.robot.orientation = orientations[index + 1]
      return state;
    default:
      console.log(`Action ${type} not found`);
  }
  return state;
};
