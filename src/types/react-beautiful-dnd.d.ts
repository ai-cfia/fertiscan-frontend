declare module "react-beautiful-dnd" {
  import * as React from "react";

  export type DraggableLocation = {
    droppableId: string;
    index: number;
  };

  export type DraggableId = string;
  export type DroppableId = string;

  export interface DropResult {
    draggableId: DraggableId;
    type: string;
    source: DraggableLocation;
    destination?: DraggableLocation;
    reason: "DROP" | "CANCEL";
    combine?: {
      draggableId: DraggableId;
      droppableId: DroppableId;
    };
    mode: "FLUID" | "SNAP";
  }

  export interface DraggableProvided {
    innerRef: (element?: HTMLElement | null) => any;
    draggableProps: {
      style?: React.CSSProperties;
      "data-rbd-draggable-context-id": string;
      "data-rbd-draggable-id": string;
    };
    dragHandleProps: {
      "data-rbd-drag-handle-draggable-id": string;
      "data-rbd-drag-handle-context-id": string;
      role: string;
      tabIndex: number;
      draggable: boolean;
      onDragStart: React.DragEventHandler<any>;
    } | null;
  }

  export interface DroppableProvided {
    innerRef: (element?: HTMLElement | null) => any;
    droppableProps: {
      "data-rbd-droppable-id": string;
      "data-rbd-droppable-context-id": string;
    };
    placeholder?: React.ReactElement<any> | null;
  }

  export interface DragStart {
    draggableId: DraggableId;
    type: string;
    source: DraggableLocation;
    mode: "FLUID" | "SNAP";
  }

  export interface DragUpdate extends DragStart {
    destination?: DraggableLocation;
    combine?: {
      draggableId: DraggableId;
      droppableId: DroppableId;
    };
  }

  export interface DragDropContextProps {
    onDragEnd: (result: DropResult) => void;
    onDragStart?: (initial: DragStart) => void;
    onDragUpdate?: (initial: DragUpdate) => void;
    children?: React.ReactNode;
  }

  export interface DroppableProps {
    droppableId: string;
    type?: string;
    direction?: "vertical" | "horizontal";
    isDropDisabled?: boolean;
    isCombineEnabled?: boolean;
    ignoreContainerClipping?: boolean;
    children?: (
      provided: DroppableProvided,
      snapshot: any,
    ) => React.ReactElement<any>;
  }

  export interface DraggableProps {
    draggableId: string;
    index: number;
    isDragDisabled?: boolean;
    disableInteractiveElementBlocking?: boolean;
    children?: (
      provided: DraggableProvided,
      snapshot: any,
    ) => React.ReactElement<any>;
  }

  export interface DragDropContextState {}

  export class DragDropContext extends React.Component<
    DragDropContextProps,
    DragDropContextState
  > {}

  export class Droppable extends React.Component<DroppableProps, any> {}

  export class Draggable extends React.Component<DraggableProps, any> {}
}
