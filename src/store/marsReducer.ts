import { Action, ActionType } from './action-types';

export interface MarsState {
  marsSize?: { x: number; y: number };
  lostRobots?: { x: number; y: number }[];
  robot?: {
    position: { x: number; y: number };
    isLost: boolean;
    //    facing: OrientationEnum;
  };
}

const initialState: MarsState = {};
const MAXSIZE = 50;

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
    default:
      console.log(`Action ${type} not found`);
  }
  return state;
};
