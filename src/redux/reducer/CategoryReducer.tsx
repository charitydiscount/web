import {CategoryActionTypes} from "../actions/Actions";
import {CategoriesAction} from "../actions/CategoriesAction";

interface ICategoryState {
    currentCategory: String,
    selections: boolean[]
}

const initialState: ICategoryState = {
    currentCategory: '',
    selections: []
};

export default function (state: ICategoryState = initialState, action: CategoriesAction): ICategoryState {
    switch (action.type) {
        case CategoryActionTypes.SET_CURRENT_CATEGORY_ACTION:
            return {
                ...state,
                currentCategory: action.payload
            };
        case CategoryActionTypes.SET_SELECTIONS_ACTION:
            return {
                ...state,
                selections: action.payload
            };
        default:
            return state;
    }
}