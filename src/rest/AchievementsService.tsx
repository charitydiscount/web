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
    anonym: boolean;
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
    await DB.collection(FirebaseTable.ACHIEVEMENTS)
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
            }
        );

    return userAchievements
        .sort((a, b) => {
            return a.achievement.reward.amount - b.achievement.reward.amount;
        });
};

export const getLeaderboard = async () => {
    if (!auth.currentUser) {
        throw Error('User not logged in');
    }

    let result = [] as LeaderboardEntryDto[];
    await DB.collection(FirebaseTable.LEADERBOARD)
        .get()
        .then(querySnapshot => {
                if (querySnapshot.docs.length > 0) {
                    querySnapshot.docs.forEach(doc => {
                            result.push(doc.data() as LeaderboardEntryDto);
                        }
                    );
                }
            }
        );

    result = result.filter(value => {
        return value.points
    }).sort((entry1, entry2) => {
        return entry2.points - entry1.points;
    });
    return result.slice(0, 10); //show only first 10 entries
};



