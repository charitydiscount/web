import {NavigationActionTypes} from "./Actions";
import {store} from "../../index";
import {Stages} from "../../components/helper/Stages";
import {createAction} from "../helper/ActionHelper";
import {ActionTypesUnion} from "../helper/TypesHelper";


export const NavigationsAction = {
    setStageAction: (stageName: Stages) => createAction(NavigationActionTypes.SET_STAGE_ACTION, stageName),
    setFavShopsIconFill: (favShopsIconFill: boolean) => createAction(NavigationActionTypes.SET_FAV_SHOPS_ICON_FILL_ACTION, favShopsIconFill),
    resetStageAction: (stageName: Stages) => createAction(NavigationActionTypes.RESET_STAGE_ACTION, stageName)
};
export type NavigationsAction = ActionTypesUnion<typeof NavigationsAction>

export const promiseSetStage = (arg: Stages) => new Promise((resolve, reject) => {
    store.dispatch(NavigationsAction.setStageAction(arg));
    resolve();
});

export function setFavShopsIconFill(favShopsIconFill: boolean): any {
    return (dispatch: any) => {
        dispatch(NavigationsAction.setFavShopsIconFill(favShopsIconFill));
    }
}