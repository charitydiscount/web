import { auth, DB } from '../index';
import { getLocalStorage, setLocalStorage } from '../helper/StorageHelper';
import { FirebaseTable, StorageKey } from '../helper/Constants';
import { computeUrl, interpolateAffiliateUrl, roundCommission, } from '../helper/AppHelper';
import { getPercentage } from './ConfigService';
import { firestore } from 'firebase/app';

export interface FavoriteShopsDto {
    programs: { [shopUniqueCode: string]: ShopDto };
    userId: string;
}

export interface ProgramDocDto {
    [uniqueCode: string]: ShopDto;
}

type ProgramWrapperDto = ProgramDocDto & {
    updatedAt: string;
};

export interface ShopDto {
    currency: string;
    category: string;
    defaultLeadCommissionAmount: string;
    defaultLeadCommissionType: string;
    defaultSaleCommissionRate: string;
    defaultSaleCommissionType: string;
    logoPath: string;
    mainUrl: string;
    affiliateUrl: string;
    id: number;
    name: string;
    status: string;
    uniqueCode: string;
    averagePaymentTime: number;
    sellingCountries: SellingCountriesDto[];
    commissionMin: string,
    commissionMax: string,

    //reviews
    totalReviews: number;
    reviewsRating: number;

    //cashback
    commission: string;
    uiCommission: string;
    commissionInterval: string;

    //linkUrl
    computeUrl: string;

    //
    order: number;
    mainOrder: number;
}

export interface SellingCountriesDto {
    code: string;
    currency: string;
    name: string;
    id: number;
}

export async function fetchFavoriteShops(allShops: ShopDto[]) {
    if (!auth.currentUser) {
        return [];
    }
    const favoriteShopsDoc = await DB.collection(FirebaseTable.FAVORITE_SHOPS)
        .doc(auth.currentUser.uid)
        .get();

    if (!favoriteShopsDoc.exists) {
        return [];
    }

    let favoriteShops = Object.values(
        (favoriteShopsDoc.data() as FavoriteShopsDto).programs
    );

    let favShopsId = favoriteShops.map(value => value.id);
    favoriteShops = allShops.filter(value =>
        favShopsId.includes(value.id)
    );
    setLocalStorage(StorageKey.FAVORITE_SHOPS, JSON.stringify(favoriteShops));

    return favoriteShops;
}

export function verifyInFavoriteShops(shopId: number) {
    const favoriteShops = getLocalStorage(StorageKey.FAVORITE_SHOPS);
    if (favoriteShops) {
        let favShops = JSON.parse(favoriteShops) as ShopDto[];
        let shopFound = favShops.find(value => value.id === shopId);
        if (shopFound) {
            return true;
        }
    }
    return false;
}

export async function updateFavoriteShops(shop: ShopDto, remove: boolean) {
    if (!auth.currentUser) {
        throw Error('User not logged in');
    }

    const docRef = DB.collection(FirebaseTable.FAVORITE_SHOPS).doc(
        auth.currentUser.uid
    );
    if (remove) {
        return docRef.update({
            [`programs.${shop.uniqueCode}`]: firestore.FieldValue.delete(),
        });
    } else {
        const favoriteShopsDoc = await docRef.get();
        if (favoriteShopsDoc.exists) {
            return docRef.update({
                [`programs.${shop.uniqueCode}`]: shop,
            });
        } else {
            return docRef.set({
                userId: auth.currentUser.uid,
                programs: {
                    [`${shop.uniqueCode}`]: shop
                }
            });
        }
    }
}

export const fetchPrograms = async (): Promise<ShopDto[]> => {
    const snap = await DB.collection(FirebaseTable.SHOPS)
        .doc('all')
        .get();

    if (!snap.exists) {
        return [];
    }

    return Object.entries((snap.data() || {}) as ProgramWrapperDto)
        .filter(
            ([uniqueCode, program]) =>
                uniqueCode !== 'updatedAt' && program.status === 'active'
        )
        .map(([uniqueCode, program]) => {
            program.uiCommission = getProgramCommission(program, false);
            program.commission = getProgramCommission(program, true);
            if (program.affiliateUrl) {
                program.computeUrl = interpolateAffiliateUrl(
                    program.affiliateUrl,
                    program.uniqueCode
                );
            } else {
                program.computeUrl = computeUrl(
                    program.uniqueCode,
                    program.mainUrl
                );
            }
            return program;
        })
        .sort((p1, p2) => {
            if (p1.mainOrder && p2.mainOrder) {
                return p1.mainOrder - p2.mainOrder;
            } else if (p1.mainOrder) {
                return p1.mainOrder - p2.order;
            } else if (p2.mainOrder) {
                return p1.order - p2.mainOrder;
            } else {
                return p1.order - p2.order
            }
        });
};


export function getProgramCommission(program: ShopDto, normalCommission: boolean) {
    let commission = '';
    let percent = getPercentage();
    if (program.defaultSaleCommissionRate && program.defaultSaleCommissionType) {
        switch (program.defaultSaleCommissionType) {
            case "fixed" : {
                commission =
                    roundCommission(
                        parseFloat(program.defaultSaleCommissionRate) * percent
                    ) +
                    ' ' +
                    program.currency;
                return commission;
            }
            case "variable":
                if (!normalCommission && program.commissionMin && program.commissionMax) {
                    commission = roundCommission(
                        parseFloat(program.commissionMin) * percent
                    ) + ' - ' + roundCommission(
                        parseFloat(program.commissionMax) * percent
                    ) + ' %';
                } else {
                    commission =
                        (normalCommission ? '' : '~ ') +
                        roundCommission(
                            parseFloat(program.defaultSaleCommissionRate) * percent
                        ) +
                        ' %';
                }
                return commission;
            case "percent":
                commission =
                    roundCommission(
                        parseFloat(program.defaultSaleCommissionRate) * percent
                    ) + ' %';
                return commission;
            default:
        }
    }

    if (program.defaultLeadCommissionAmount && program.defaultLeadCommissionType ) {
        switch (program.defaultLeadCommissionType) {
            case "variable":
                if (!normalCommission && program.commissionMin && program.commissionMax) {
                    commission = roundCommission(
                        parseFloat(program.commissionMin) * percent
                    ) + ' - ' + roundCommission(
                        parseFloat(program.commissionMax) * percent
                    ) + ' %';
                } else {
                    commission =
                        (normalCommission ? '' : '~ ') +
                        roundCommission(
                            parseFloat(program.defaultLeadCommissionAmount) *
                            percent
                        ) + ' ' + program.currency;
                }
                break;
            case "fixed":
                commission =
                    roundCommission(
                        parseFloat(program.defaultLeadCommissionAmount) *
                        percent
                    ) +
                    ' ' +
                    program.currency;
                break;
            default:
        }
    }

    return commission;
}
