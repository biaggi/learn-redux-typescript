import { marsReducer, MarsState } from './marsReducer';
import { moveRobotLeft, setMarsSize, setRobot } from './action-creators';
import assert from 'assert';
import { Orientation } from './action-types';
const setupMarsAndRobot = () => {
  let state: MarsState = {};
  state = marsReducer(state, setMarsSize({ x: 5, y: 3 }));
  const robot = {
    position: { x: 5, y: 3 },
    orientation: Orientation.North,
    isLost: false,
  };
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
});
