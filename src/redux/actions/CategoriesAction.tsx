import {createAction} from "../helper/ActionHelper";
import {CategoryActionTypes} from "./Actions";
import {ActionTypesUnion} from "../helper/TypesHelper";

export const CategoriesAction = {
    setCurrentCategory: (currentCategory: String) => createAction(CategoryActionTypes.SET_CURRENT_CATEGORY_ACTION, currentCategory)
};

export function setCurrentCategory(currentCategory: String): any {
    if (currentCategory) {
        return (dispatch: any) => {
            dispatch(CategoriesAction.setCurrentCategory(currentCategory));
        }
    }
}

export type CategoriesAction = ActionTypesUnion<typeof CategoriesAction>