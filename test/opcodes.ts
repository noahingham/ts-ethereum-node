
import { expect, should } from 'chai';
should();
import 'mocha';
import { N256 } from 'ts-ethereum-vm';
import { runCode } from './testUtil';

describe('OpCodes', () => {
  it('CALLDATALOAD', () => {
    const state = runCode('6000356000 52 60016000F3', '04');
    state.returnValue.toString('hex').should.equal('04');
  });
});
