import { setRobot } from './action-creators';
import { Action, ActionType } from './action-types';

export enum Orientation {
  North = 'N',
  South = 'S',
  East = 'E',
  West = 'W',
}

const MAXSIZE = 50;
export interface Robot {
  position: { x: number; y: number };
  isLost: boolean;
  orientation: Orientation;
  move?: 'pending' | 'fulfilled' | 'rejected';
}

export interface MarsState {
  marsSize?: { x: number; y: number };
  lostRobots?: { x: number; y: number }[];
  robot?: Robot;
}

export const initialState: MarsState = {};

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
    Orientation.West,
    Orientation.North,
  ];
  if (!state.robot || !state.marsSize) {
    return state;
  }
  const currentOrientation = state.robot?.orientation;
  const index = orientations.indexOf(currentOrientation, 1);
  const nextOrientation =
    Direction.LEFT === direction
      ? orientations[index - 1]
      : orientations[index + 1];
  return { ...state, robot: { ...state.robot, orientation: nextOrientation } };
};

export const marsReducer = (
  state: MarsState = initialState,
  action: Action
): MarsState => {
  const { type } = action;
  console.log(action);

  switch (type) {
    // resets mars
    case ActionType.SetMarsSize:
      const { x, y } = action.payload;
      const checkSize = (value: number) => (value > MAXSIZE ? MAXSIZE : value);
      return {
        ...initialState,
        marsSize: { x: checkSize(x), y: checkSize(y) },
      };
    case ActionType.SetRobot:
      if (!state.marsSize) {
        console.log('world not initialized');
        return {};
      }
      console.log('setrobot', { ...state, robot: { ...action.payload } });
      return { ...state, robot: { ...action.payload } };
    case ActionType.MoveRobotLeft:
      // if no robot, return state
      if (!state.robot) return state;
      return moveRobot(state, Direction.LEFT);
    case ActionType.MoveRobotRight:
      // if no robot, return state
      if (!state.robot) return state;
      return moveRobot(state, Direction.RIGHT);
    case ActionType.SetRobotLost:
      // if no robot, return state
      if (!state.robot) return state;
      return { ...state, robot: { ...state.robot, isLost: true } };
    case ActionType.MoveRobotFront:
      // if no robot, return state
      if (!state.robot || !state.marsSize) return state;
      const { position, orientation } = state.robot;
      if (!position) return state;

      // otherwise, just move
      switch (orientation) {
        case Orientation.North:
          return {
            ...state,
            robot: {
              ...state.robot,
              position: { ...state.robot.position, y: position.y + 1 },
            },
          };
        case Orientation.South:
          return {
            ...state,
            robot: {
              ...state.robot,
              position: { ...state.robot.position, y: position.y - 1 },
            },
          };
        case Orientation.East:
          return {
            ...state,
            robot: {
              ...state.robot,
              position: { ...state.robot.position, x: position.x + 1 },
            },
          };
        case Orientation.West:
          return {
            ...state,
            robot: {
              ...state.robot,
              position: { ...state.robot.position, x: position.x - 1 },
            },
          };
        default:
          console.log('Id like to know how can this happen', orientation);
      }
    default:
      console.log(`Action ${type} not found`);
  }
  return state;
};
