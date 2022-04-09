export enum ActionType {
  SetMarsSize = '@mars/SetMarsSize',
}

export interface BaseAction {
  type: string;
}

export interface ActionSetMarsSize extends BaseAction {
  payload: { x: number; y: number };
}

export type Action = ActionSetMarsSize;
