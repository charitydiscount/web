import { createAction } from "../helper/ActionHelper";
import { AchievementActionTypes } from "./Actions";
import { ActionTypesUnion } from "../helper/TypesHelper";
import { UserAchievementDto } from "../../rest/AchievementsService";

export const AchievementActions = {
    setAchievementModalVisible: (modalVisible: boolean) =>
        createAction(AchievementActionTypes.SET_ACHIEVEMENT_MODAL_VISIBLE_ACTION, modalVisible),
    setAchievementModal: (achievement: UserAchievementDto) =>
        createAction(AchievementActionTypes.SET_ACHIEVEMENT_MODAL_ACTION, achievement),
};

export function setAchievementModalVisible(modalVisible: boolean): any {
    return (dispatch: any) => {
        dispatch(AchievementActions.setAchievementModalVisible(modalVisible));
    }
}

export function setAchievementModal(achivement: UserAchievementDto): any {
    return (dispatch: any) => {
        dispatch(AchievementActions.setAchievementModal(achivement));
    }
}

export type AchievementActionsType = ActionTypesUnion<typeof AchievementActions>;


