import { ActionType, ActionSetMarsSize } from './action-types';
export const setMarsSize = (x: number, y: number): ActionSetMarsSize => {
  return {
    type: ActionType.SetMarsSize,
    payload: { x, y },
  };
};
