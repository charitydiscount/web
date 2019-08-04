import {CategoryActionTypes} from "../actions/Actions";
import {CategoriesAction} from "../actions/CategoriesAction";

interface ICategoryState {
    currentCategory: String
}

const initialState: ICategoryState = {
    currentCategory: ''
};

export default function (state: ICategoryState = initialState, action: CategoriesAction): ICategoryState {
    switch (action.type) {
        case CategoryActionTypes.SET_CURRENT_CATEGORY_ACTION:
            return {
                ...state,
                currentCategory: action.payload
            };
        default:
            return state;
    }
}