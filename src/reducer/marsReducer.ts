/*
export enum DirectionsEnum {
  N = "N",
  S = "S",
  E = "E",
  W = "W",
}
*/
export interface MarsState {
  lostRobots: { x: number; y: number }[];
  currentRobot: {
    position: { x: number; y: number };
    isLost: boolean;
    //    facing: DirectionsEnum;
  };
}

export interface Action {
  type: string;
}
/*
const initialState: number = 0;
const MarsReducer = (state: MarsState, action: Action) => {
  return state;
};
*/
