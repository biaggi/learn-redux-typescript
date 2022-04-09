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

export const marsReducer = (
  state: MarsState = initialState,
  action: Action
) => {
  const { type } = action;

  switch (type) {
    case ActionType.SetMarsSize:
      state.marsSize = { ...action.payload };
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
