import { eventbus } from "./EventBus";
import Input from "../Model/Input-Model";

export const FormClickActions = eventbus<{
  ModifyClick: (inputInfo: Input) => void;
  ApproveClick: (inputInfo: Input) => void;
  Rejected: (inputInfo: Input) => void;
  SyncProgress: (inputInfo: Input) => void;
  Focus: (inputInfo: Input) => void;
  UnFocus: (inputInfo: Input) => void;
}>();

export const MenuChannel = eventbus<{
  OpenMenu: () => void;
  CloseMenu: () => void;
}>();
