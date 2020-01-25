import {NavigationActionTypes} from "./Actions";
import {Stages} from "../../components/helper/Stages";
import {createAction} from "../helper/ActionHelper";
import {ActionTypesUnion} from "../helper/TypesHelper";


export const NavigationsAction = {
    setStageAction: (stageName: Stages) => createAction(NavigationActionTypes.SET_STAGE_ACTION, stageName),
    resetStageAction: (stageName: Stages) => createAction(NavigationActionTypes.RESET_STAGE_ACTION, stageName)
};
export type NavigationsAction = ActionTypesUnion<typeof NavigationsAction>
