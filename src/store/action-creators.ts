import { RootState } from '.';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { MarsState, Orientation, Robot } from './marsReducer';
import {
  ActionType,
  ActionSetMarsSize,
  ActionSetRobot,
  ActionMoveRobotLeft,
  ActionMoveRobotRight,
  ActionMoveRobotFront,
  ActionSetRobotLost,
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

export const setRobot = (robot: Robot): ActionSetRobot => {
  console.log('action creator', {
    type: ActionType.SetRobot,
    payload: { ...robot },
  });
  return {
    type: ActionType.SetRobot,
    payload: { ...robot },
  };
};

export const setRobotLost = (): ActionSetRobotLost => {
  return {
    type: ActionType.SetRobotLost,
  };
};

export const moveRobotLeft = (): ActionMoveRobotLeft => {
  return {
    type: ActionType.MoveRobotLeft,
  };
};

export const moveRobotRight = (): ActionMoveRobotRight => {
  return {
    type: ActionType.MoveRobotRight,
  };
};

export const moveRobotFront = (): ActionMoveRobotFront => {
  return {
    type: ActionType.MoveRobotFront,
  };
};

const isOutOfBounds = (state: RootState) => {
  if (!state || !state.mars.robot || !state.mars.marsSize) {
    return false;
  }
  const { position } = state.mars.robot;
  // out of bounds check
  const correctionMap = {
    [Orientation.North]: { x: 0, y: 1 },
    [Orientation.South]: { x: 0, y: -1 },
    [Orientation.East]: { x: 1, y: 0 },
    [Orientation.West]: { x: -1, y: 0 },
  };

  const correction = correctionMap[state.mars.robot.orientation];
  const correctedX = position.x + correction.x;
  const correctedY = position.y + correction.y;
  return (
    correctedX < 0 ||
    correctedX > state.mars.marsSize.x ||
    correctedY < 0 ||
    correctedY > state.mars.marsSize.y
  );
};

export const moveRobot = createAsyncThunk<void, string, { state: RootState }>(
  ActionType.MoveRobot,
  async (orders: string, thunkApi) => {
    return new Promise((resolve, reject) => {
      orders.split('').every((order) => {
        switch (order) {
          case 'L':
            thunkApi.dispatch(moveRobotLeft());
            break;
          case 'R':
            thunkApi.dispatch(moveRobotRight());
            break;
          case 'F':
            if (isOutOfBounds(thunkApi.getState())) {
              console.log('robot lost', JSON.stringify(thunkApi.getState()));
              thunkApi.dispatch(setRobotLost());
              reject(thunkApi.rejectWithValue('LOST'));
              return false;
            }
            thunkApi.dispatch(moveRobotFront());
            break;
          default:
            console.log('option not found, skipping', order);
        }
        console.log(
          'robot current position',
          JSON.stringify(thunkApi.getState())
        );
        return true;
      });
      resolve();
    });
  }
);
