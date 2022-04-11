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
    // first robot
    store.dispatch(setRobot(initial));
    store.dispatch(moveRobot(path)).then((data) => {
      assert.deepStrictEqual(store.getState().mars.robot, expected, text);
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
  });

  it('can lost a robot', async () => {
    store.dispatch(setMarsSize({ x: 3, y: 3 }));

    const setRobotLostTest = async (
      position: { x: number; y: number },
      orientation: Orientation
    ) => {
      await sendRobot(
        {
          position: position,
          orientation: orientation,
          isLost: false,
        },
        'F',
        {
          position: position,
          orientation: orientation,
          isLost: true,
        },
        `robot heading ${orientation} should be lost`
      );
    };

    await setRobotLostTest({ x: 0, y: 3 }, Orientation.North);
    await setRobotLostTest({ x: 0, y: 0 }, Orientation.South);
    await setRobotLostTest({ x: 3, y: 0 }, Orientation.East);
    await setRobotLostTest({ x: 0, y: 2 }, Orientation.West);
  });

  it('can not lost a second robot', async () => {
    store.dispatch(setMarsSize({ x: 1, y: 1 }));

    const setTwoRobotsLostTest = async (
      position: { x: number; y: number },
      orientation: Orientation
    ) => {
      await sendRobot(
        {
          position: position,
          orientation: orientation,
          isLost: false,
        },
        'F',
        {
          position: position,
          orientation: orientation,
          isLost: true,
        },
        `robot heading ${orientation} should be lost`
      );

      await sendRobot(
        {
          position: position,
          orientation: orientation,
          isLost: false,
        },
        'F',
        {
          position: position,
          orientation: orientation,
          isLost: false,
        },
        `robot heading ${orientation} should NOT be lost`
      );
    };

    await setTwoRobotsLostTest({ x: 0, y: 3 }, Orientation.North);
    await setTwoRobotsLostTest({ x: 0, y: 0 }, Orientation.South);
    await setTwoRobotsLostTest({ x: 3, y: 0 }, Orientation.East);
    await setTwoRobotsLostTest({ x: 0, y: 2 }, Orientation.West);
  });
});
