import { Action, ActionType } from './action-types';

export enum Orientation {
  North = 'N',
  South = 'S',
  East = 'E',
  West = 'W',
}

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
  const nextOrientation =
    Direction.LEFT === direction
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
  // if robot is lost, is lost, cannot do anything
  if (state.robot && state.robot.isLost) return state;

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
      // if no robot, return state
      if (!state.robot) return state;
      return moveRobot(state, Direction.LEFT);
    case ActionType.MoveRobotRight:
      // if no robot, return state
      if (!state.robot) return state;
      return moveRobot(state, Direction.RIGHT);
    case ActionType.MoveRobotFront:
      // if no robot, return state
      if (!state.robot) return state;
      const { position, orientation } = state.robot;

      switch (orientation) {
        case Orientation.North:
          position.y = position.y + 1;
          return state;
        case Orientation.South:
          position.y = position.y - 1;
          return state;
        case Orientation.East:
          position.x = position.x + 1;
          return state;
        case Orientation.West:
          position.x = position.x - 1;
          return state;
        default:
          console.log('Id like to know how can this happen');
      }
    default:
      console.log(`Action ${type} not found`);
  }
  return state;
};
