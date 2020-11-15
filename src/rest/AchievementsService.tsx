import { DB } from "../index";
import { FirebaseTable } from "../helper/Constants";

export interface Languages {
    en: string,
    ro: string
}

export interface AchievementDto {
    id: string,
    name: Languages,
    description: Languages,
    badge: string,
}

export const getAchievements = async () => {
    let achievements;
    achievements = await DB.collection(FirebaseTable.ACHIEVEMENTS)
        .get()
        .then(querySnapshot => {
                if (querySnapshot.docs.length > 0) {
                    let result = [] as AchievementDto[];
                    querySnapshot.docs.forEach(doc => {
                        result.push({
                            ...doc.data() as AchievementDto,
                            id: doc.id,
                        });
                    });
                    return result;
                } else {
                    return [];
                }
            }
        );

    //concat user -achivements

    return achievements;
};

const snapToList = (snap: { [achievementId: number]: AchievementDto }) => {
    return Object.values(snap);
};