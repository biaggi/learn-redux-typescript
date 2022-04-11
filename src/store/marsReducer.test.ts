import {
  initialState,
  marsReducer,
  Robot,
  MarsState,
  Orientation,
} from './marsReducer';
import {
  moveRobotFront,
  moveRobotLeft,
  moveRobotRight,
  setMarsSize,
  setRobot,
  moveRobot,
} from './action-creators';
import assert from 'assert';

import { store } from './index';

const setupMarsAndRobot = (
  marsSize = { x: 5, y: 3 },
  robot: Robot = {
    position: { x: 5, y: 3 },
    orientation: Orientation.North,
    isLost: false,
  }
) => {
  let state: MarsState = initialState;
  state = marsReducer(state, setMarsSize(marsSize));
  return { state: marsReducer(state, setRobot(robot)), robot };
};

const sendRobot = (
  initial: Robot,
  path: string,
  expected: Robot,
  text: string
) => {
  return new Promise<void>((resolve) => {
    console.log('begin', text);
    // first robot
    console.log('sending', initial, path);
    store.dispatch(setRobot(initial));
    store.dispatch(moveRobot(path)).then((data) => {
      console.log('done moveRobot', JSON.stringify(store.getState()));
      assert.deepStrictEqual(store.getState().mars.robot, expected, text);
      console.log('resolve');
      resolve();
    });
  });
};

describe('Mars Reducer', () => {
  it('can define mars size', () => {
    const state = marsReducer({}, setMarsSize({ x: 5, y: 3 }));
    assert.equal(state.marsSize?.x, 5);
    assert.equal(state.marsSize?.y, 3);
  });

  it('cannot create mars bigger than 50', () => {
    const state = marsReducer({}, setMarsSize({ x: 55, y: 55 }));
    assert.equal(state.marsSize?.x, 50);
    assert.equal(state.marsSize?.y, 50);
  });
  it('cannot invite a robot to walk through mars if there is no mars', () => {
    const state = marsReducer(
      {},
      setRobot({
        position: { x: 5, y: 3 },
        orientation: Orientation.North,
        isLost: false,
      })
    );
    assert.equal(Object.keys(state).length, 0);
  });
  it('can let a robot enter mars', () => {
    const { state, robot } = setupMarsAndRobot();
    assert.deepStrictEqual(state.robot, robot);
  });
  it('can let a robot move left', () => {
    let { state, robot } = setupMarsAndRobot();
    state = marsReducer(state, moveRobotLeft());
    assert.equal(state.robot?.orientation, Orientation.West);
  });
  it('can let a robot move right', () => {
    let { state, robot } = setupMarsAndRobot();
    state = marsReducer(state, moveRobotRight());
    assert.equal(state.robot?.orientation, Orientation.East);
  });

  it('can let a robot move front', () => {
    const checkDirection = (
      orientation: Orientation,
      expectedX: number,
      expectedY: number
    ) => {
      let { state, robot } = setupMarsAndRobot(
        { x: 5, y: 5 },
        {
          position: { x: 2, y: 2 },
          orientation: orientation,
          isLost: false,
        }
      );
      state = marsReducer(state, moveRobotFront());

      assert.deepStrictEqual(
        state.robot,
        {
          position: { x: expectedX, y: expectedY },
          orientation: orientation,
          isLost: false,
        },
        `robot could not walk direction ${orientation}`
      );
    };
    checkDirection(Orientation.North, 2, 3);
    checkDirection(Orientation.South, 2, 1);
    checkDirection(Orientation.East, 3, 2);
    checkDirection(Orientation.West, 1, 2);
  });
  it('can understand a robot command line', async () => {
    store.dispatch(setMarsSize({ x: 5, y: 3 }));

    // first robot
    await sendRobot(
      {
        position: { x: 1, y: 1 },
        orientation: Orientation.East,
        isLost: false,
      },
      'RFRFRFRF',
      {
        position: { x: 1, y: 1 },
        orientation: Orientation.East,
        isLost: false,
      },
      'error on first robot'
    );

    console.log('segundo');
    // second robot
    await sendRobot(
      {
        position: { x: 3, y: 2 },
        orientation: Orientation.North,
        isLost: false,
      },
      'FRRFLLFFRRFLL',
      {
        position: { x: 3, y: 3 },
        orientation: Orientation.North,
        isLost: true,
      },
      'error on second robot'
    );
    console.log('tercero');
    // third robot
    await sendRobot(
      {
        position: { x: 0, y: 3 },
        orientation: Orientation.West,
        isLost: false,
      },
      'LLFFFRFLFL',
      {
        position: { x: 4, y: 2 },
        orientation: Orientation.North,
        isLost: false,
      },
      'error on third robot'
    );
    console.log('end');
  });
});
