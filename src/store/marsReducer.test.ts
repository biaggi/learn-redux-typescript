import { marsReducer, MarsState, Orientation } from './marsReducer';
import {
  moveRobotFront,
  moveRobotLeft,
  moveRobotRight,
  setMarsSize,
  setRobot,
} from './action-creators';
import assert from 'assert';
const setupMarsAndRobot = (
  marsSize = { x: 5, y: 3 },
  robot = {
    position: { x: 5, y: 3 },
    orientation: Orientation.North,
    isLost: false,
  }
) => {
  let state: MarsState = {};
  state = marsReducer(state, setMarsSize(marsSize));
  return { state: marsReducer(state, setRobot(robot)), robot };
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
    assert.deepEqual(state.robot, robot);
  });
  it('can let a robot move left', () => {
    let { state, robot } = setupMarsAndRobot();
    state = marsReducer(state, moveRobotLeft());
    assert.equal(state.robot?.orientation, Orientation.East);
  });
  it('can let a robot move right', () => {
    let { state, robot } = setupMarsAndRobot();
    state = marsReducer(state, moveRobotRight());
    assert.equal(state.robot?.orientation, Orientation.West);
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

      assert.deepEqual(
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
});
