import { auth, DB } from "../index";
import { FirebaseTable } from "../helper/Constants";
import { firestore } from "firebase";

export interface Languages {
    en: string,
    ro: string
}

export interface UserAchievementWrapper {
    [id: string]: UserAchievementDto
}

export interface UserAchievementDto {
    achieved: boolean,
    userId: string,
    achievedAt: firestore.Timestamp,
    achievement: AchievementDto,
    currentCount: number
}

export interface AchievementDto {
    id: string,
    name: Languages,
    description: Languages,
    conditions: Condition[]
    badgeUrl: string,
    reward: Reward
}

export interface Reward {
    amount: number,
    unit: string
}

export interface Condition {
    type: string,
    target: string,
    unit: string
}

export interface LeaderboardEntryDto {
    userId: string;
    name: string;
    photoUrl: string;
    points: number;
    updatedAt: firestore.Timestamp | firestore.FieldValue;
    isStaff: boolean;
    achievementsCount: number;
}


export const getAchievements = async () => {
    if (!auth.currentUser) {
        throw Error('User not logged in');
    }

    const userId = auth.currentUser.uid;
    let userAchievements = [] as UserAchievementDto[];
    userAchievements = await DB.collection(FirebaseTable.USER_ACHIEVEMENTS)
        .doc(userId)
        .get()
        .then(doc => {
                if (doc.exists) {
                    return (Object.entries(doc.data() as UserAchievementWrapper)
                            .filter(([key, achievemnt]) => key !== 'userId')
                            .map(([key, achievemnt]) => achievemnt)
                    ) as UserAchievementDto[];
                } else {
                    return [];
                }
            }
        );

    if (userAchievements.length > 0) {
        userAchievements = userAchievements.sort(function (x, y) {
            // true values first
            return (x.achieved === y.achieved) ? 0 : x.achieved ? -1 : 1;
        });
    }
    return DB.collection(FirebaseTable.ACHIEVEMENTS)
        .get()
        .then(querySnapshot => {
                if (querySnapshot.docs.length > 0) {
                    querySnapshot.docs.forEach(doc => {
                        let alreadyExist = userAchievements.find((value) => value.achievement.id === doc.id);
                        if (!alreadyExist) {
                            userAchievements.push({
                                achieved: false,
                                userId: "",
                                achievedAt: null,
                                achievement: {
                                    ...doc.data() as AchievementDto,
                                    id: doc.id
                                },
                                currentCount: 0,
                            });
                        }
                    });
                }
                return userAchievements
                    .sort((a, b) => {
                        return a.achievement.reward.amount - b.achievement.reward.amount;
                    });
            }
        )
        .catch(() => {
            return userAchievements;
        })
};

export const getLeaderboard = async () => {
    if (!auth.currentUser) {
        throw Error('User not logged in');
    }

    return DB.collection(FirebaseTable.LEADERBOARD)
        .orderBy('points', 'desc')
        .limit(10)
        .get()
        .then(querySnapshot => {
                let result = [] as LeaderboardEntryDto[];
                if (querySnapshot.docs.length > 0) {
                    querySnapshot.docs.forEach(doc => {
                            result.push(doc.data() as LeaderboardEntryDto);
                        }
                    );
                }
                return result;
            }
        ).catch(() => {
            return [];
        })
};



