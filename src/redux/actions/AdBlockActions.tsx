import {createAction} from "../helper/ActionHelper";
import { AdBlockActionTypes } from "./Actions";
import {ActionTypesUnion} from "../helper/TypesHelper";

export const AdBlockAction = {
    setAdBlockActive: (isActive: boolean) => createAction(AdBlockActionTypes.SET_AD_BLOCK_ACTIVE, isActive),
};

export function setAdBlockActive(isActive: boolean): any {
    return (dispatch: any) => {
        dispatch(AdBlockAction.setAdBlockActive(isActive));
    }
}

export type AdBlockAction = ActionTypesUnion<typeof AdBlockAction>