import { AchievementActionsType } from "../actions/AchivementsAction";
import { AchievementActionTypes } from "../actions/Actions";

export interface IAchievementState {
    modalVisible: boolean,
    achievementModal: any
}

const initialState: IAchievementState = {
    modalVisible: false,
    achievementModal: {}
};

export default function (state: IAchievementState = initialState, action: AchievementActionsType): IAchievementState {
    switch (action.type) {
        case AchievementActionTypes.SET_ACHIEVEMENT_MODAL_VISIBLE_ACTION:
            return {
                ...state,
                modalVisible: action.payload
            };
        case AchievementActionTypes.SET_ACHIEVEMENT_MODAL_ACTION:
            return {
                ...state,
                modalVisible: true,
                achievementModal: action.payload
            };
        default:
            return state;
    }
}
