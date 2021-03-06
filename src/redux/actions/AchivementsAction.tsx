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

export type AchievementActionsType = ActionTypesUnion<typeof AchievementActions>;


