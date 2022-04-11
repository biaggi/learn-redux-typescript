import { marsReducer, Orientation } from './marsReducer';
export * from './marsReducer';
import { moveRobot, setMarsSize, setRobot } from './action-creators';

import {
  configureStore,
  createStore,
  combineReducers,
  applyMiddleware,
} from '@reduxjs/toolkit';
import { ActionType } from './action-types';

import thunk from 'redux-thunk';

// this shouldn't be needed if you read documentation, but... try to remove it ;-)
export const store = configureStore({
  reducer: combineReducers({ mars: marsReducer }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

/*
store.subscribe(() => {
  console.log(store.getState());
})
*/
/*
store.dispatch(setMarsSize({ x: 5, y: 3 }));
store.dispatch(
  setRobot({
    position: { x: 1, y: 1 },
    orientation: Orientation.North,
    isLost: false,
  })
);
store.dispatch(moveRobot('FRFRFRFRFRFR'));
*/