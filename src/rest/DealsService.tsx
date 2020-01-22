import { auth, DB } from '../index';
import { FirebaseTable } from '../helper/Constants';

export interface PromotionDTO {
    name: string;
    promotionEnd: string;
    promotionStart: string;
    landingPageLink: string;
    program: PromotionProgramDto;
    id: number;
}

export interface PromotionProgramDto {
    id: string;
    name: string;
}

export const getPromotions = async (programId: number) => {
    if (!auth.currentUser) {
        return;
    }

    return DB.collection(FirebaseTable.PROMOTIONS)
        .doc(`${programId}`)
        .get()
        .then(snap => (snap.exists ? snapToList(snap.data() || {}) : []));
};

const snapToList = (snap: { [promotionId: number]: PromotionDTO }) => {
    const now = Date.now();
    return Object.values(snap).reduce<PromotionDTO[]>(
        (promotions, p) =>
            Date.parse(p.promotionStart) <= now &&
            now <= Date.parse(p.promotionEnd)
                ? promotions.concat(p)
                : promotions,
        []
    );
};
