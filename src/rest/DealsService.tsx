import { DB } from '../index';
import { FirebaseTable } from '../helper/Constants';

export interface PromotionDto {
    name: string;
    promotionEnd: string;
    promotionStart: string;
    campaignLogo: string;
    campaignName: string;
    description: string;
    landingPageLink: string;
    affiliateUrl: string;
    program: PromotionProgramDto;
    id: number;
}

export interface PromotionProgramDto {
    id: number;
    name: string;
}

export const getPromotions = async (programId: number) => {
    return DB.collection(FirebaseTable.PROMOTIONS)
        .doc(`${programId}`)
        .get()
        .then(snap => (snap.exists ? snapToList(snap.data() || {}) : []));
};


export const getAllPromotions = async () => {
    return DB.collection(FirebaseTable.PROMOTIONS)
        .get()
        .then(querySnapshot => {
                if (querySnapshot.docs.length > 0) {
                    let result = [] as PromotionDto[];
                    querySnapshot.docs.forEach(snap => {
                        let data = snapToList(snap.data() || {});
                        result = result.concat(data);
                    });
                    return result;
                } else {
                    return [];
                }
            }
        );
};

const snapToList = (snap: { [promotionId: number]: PromotionDto }) => {
    const now = Date.now();
    return Object.values(snap).reduce<PromotionDto[]>(
        (promotions, p) =>
            Date.parse(p.promotionStart) <= now &&
            now <= Date.parse(p.promotionEnd)
                ? promotions.concat(p)
                : promotions,
        []
    );
};
