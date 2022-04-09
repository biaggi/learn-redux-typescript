import { marsReducer } from './marsReducer';
import { setMarsSize } from './action-creators';
import assert from 'assert';
describe('Mars Reducer', () => {
  it('can define mars size', () => {
    const state = marsReducer({}, setMarsSize(5, 3));
    assert.equal(state.marsSize?.x, 5);
    assert.equal(state.marsSize?.y, 3);
  });
});
