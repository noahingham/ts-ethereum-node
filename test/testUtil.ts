
import { MachineState as State, run, assemble } from 'ts-ethereum-vm';

export const runCode = (code: string, calldata: string, log: boolean = false): State => {
  const binary = assemble(code);
  const binaryData = assemble(calldata);
  const initialState = new State().loadCode(binary).setCallData(binaryData);
  if (log) {
    console.log(`Running code: ${binary.toString('hex')}`);
    console.log(`START => \t{${initialState}}`);
  }
  return run(initialState, log);
};
