import {createAction} from "../helper/ActionHelper";
import {CategoryActionTypes} from "./Actions";
import {ActionTypesUnion} from "../helper/TypesHelper";

export const CategoriesAction = {
    setCurrentCategory: (currentCategory: String) => createAction(CategoryActionTypes.SET_CURRENT_CATEGORY_ACTION, currentCategory),
    setSelections: (selections: boolean[]) => createAction(CategoryActionTypes.SET_SELECTIONS_ACTION, selections)
};

export function setCurrentCategory(currentCategory: String): any {
    return (dispatch: any) => {
        dispatch(CategoriesAction.setCurrentCategory(currentCategory));
    }
}

export function setSelections(selections: boolean[]): any {
    if (selections) {
        return (dispatch: any) => {
            dispatch(CategoriesAction.setSelections(selections));
        }
    }
}

export type CategoriesAction = ActionTypesUnion<typeof CategoriesAction>