import { marsReducer } from './marsReducer';
import { setMarsSize, setRobot } from './action-creators';
import assert from 'assert';
import { Orientation } from './action-types';
describe('Mars Reducer', () => {
  it('can define mars size', () => {
    const state = marsReducer({}, setMarsSize({ x: 5, y: 3 }));
    assert.equal(state.marsSize?.x, 5);
    assert.equal(state.marsSize?.y, 3);
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
});
