import { eventbus } from "./EventBus"
import Input from "../Model/Input-Model"

export const FormClickActions = eventbus<{
  ModifyClick: (inputInfo:Input)=>void
  ApproveClick: (inputInfo:Input)=>void
}>()