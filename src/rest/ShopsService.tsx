import { DB, auth } from '../index';
import { getLocalStorage, setLocalStorage } from '../helper/StorageHelper';
import { FirebaseTable, StorageKey } from '../helper/Constants';
import {
    computeUrl,
    roundCommission,
    interpolateAffiliateUrl,
} from '../helper/AppHelper';
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

export async function fetchFavoriteShops() {
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

    const shops = getLocalStorage(StorageKey.SHOPS);
    if (shops) {
        const favShopsId = favoriteShops.map(value => value.id);
        let shopsFromStorage = JSON.parse(shops) as ShopDto[];
        shopsFromStorage = shopsFromStorage.filter(value =>
            favShopsId.includes(value.id)
        );
        favoriteShops = shopsFromStorage;
    }
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
                [`programs.${shop.uniqueCode}`]: shop,
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

export enum CommissionType {
    fixed,
    variable,
    percent,
}

export function getProgramCommission(
    program: ShopDto,
    normalCommission: boolean
) {
    let commission = '';
    let percent = getPercentage();
    if (
        program.defaultSaleCommissionRate &&
        CommissionType[program.defaultSaleCommissionType]
    ) {
        switch (CommissionType[program.defaultSaleCommissionType].toString()) {
            case CommissionType.fixed.toString():
                commission =
                    roundCommission(
                        parseFloat(program.defaultSaleCommissionRate) * percent
                    ) +
                    ' ' +
                    program.currency;
                break;
            case CommissionType.variable.toString():
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
                break;
            case CommissionType.percent.toString():
                commission =
                    roundCommission(
                        parseFloat(program.defaultSaleCommissionRate) * percent
                    ) + ' %';
                break;
            default:
        }
    }

    if (
        program.defaultLeadCommissionAmount &&
        !program.defaultSaleCommissionRate &&
        CommissionType[program.defaultLeadCommissionType]
    ) {
        switch (CommissionType[program.defaultLeadCommissionType].toString()) {
            case CommissionType.variable.toString():
                if (!normalCommission && program.commissionMin && program.commissionMax) {
                    commission = roundCommission(
                        parseFloat(program.commissionMin) * percent
                    ) + ' - ' + roundCommission(
                        parseFloat(program.commissionMax) * percent
                    ) + ' %';
                    commission =
                        (normalCommission ? '' : '~ ') +
                        roundCommission(
                            parseFloat(program.defaultLeadCommissionAmount) *
                            percent
                        ) +
                        ' ' +
                        program.currency;
                }
                break;
            case CommissionType.fixed.toString():
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
