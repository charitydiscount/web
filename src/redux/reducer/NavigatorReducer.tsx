import {NavigationActionTypes} from "../actions/Actions";
import {Stages} from "../../components/helper/Stages";
import {NavigationsAction} from "../actions/NavigationsAction";

export interface INavigationState {
    stageName: Stages,
    previousStage: Stages,
    favShopsIconFill: boolean
}

const initialState: INavigationState = {
    stageName: Stages.EMPTY,
    previousStage: Stages.EMPTY,
    favShopsIconFill: false,
};

export default function (state: INavigationState = initialState, action: NavigationsAction): INavigationState {
    switch (action.type) {
        case NavigationActionTypes.SET_STAGE_ACTION: {
            const newStageName = action.payload;
            document.body.classList.add(newStageName);
            return {
                ...state,
                stageName: newStageName,
                previousStage: state.stageName
            };
        }
        case NavigationActionTypes.RESET_STAGE_ACTION: {
            const oldStageName = action.payload;
            document.body.classList.remove(oldStageName);
            return {
                ...state,
            };
        }
        case NavigationActionTypes.SET_FAV_SHOPS_ICON_FILL_ACTION:
            return {
                ...state,
                favShopsIconFill: action.payload
            };
        default:
            return state
    }
}