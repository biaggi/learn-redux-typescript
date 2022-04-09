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

enum Direction {
  LEFT,
  RIGHT,
}

const moveRobot = (state: MarsState, direction: Direction) => {
  const orientations = [
    Orientation.West,
    Orientation.North,
    Orientation.East,
    Orientation.South,
    Orientation.East,
    Orientation.North,
  ];
  if (!state.robot) {
    return state;
  }
  const currentOrientation = state.robot?.orientation;
  const index = orientations.indexOf(currentOrientation);
  const nextOrientation = Direction.LEFT === direction
    ? orientations[index + 1]
    : orientations[index - 1];
  state.robot.orientation = nextOrientation;
  return state;
};

export const marsReducer = (
  state: MarsState = initialState,
  action: Action
) => {
  const { type } = action;
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
      return moveRobot(state, Direction.LEFT);
    case ActionType.MoveRobotRight:
      return moveRobot(state, Direction.RIGHT);
    default:
      console.log(`Action ${type} not found`);
  }
  return state;
};
