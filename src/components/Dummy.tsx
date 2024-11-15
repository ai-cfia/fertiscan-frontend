import { StepComponentProps } from "./stepper";

export interface DummyProps extends StepComponentProps {
  dummy: string;
}

function Dummy({ dummy }: DummyProps) {
  return <div>{dummy}</div>;
}

export default Dummy;
