import { DB } from '../index';
import { getLocalStorage, setLocalStorage } from '../helper/StorageHelper';
import { FirebaseTable, StorageKey } from '../helper/Constants';
import {
    computeUrl,
    getUserKeyFromStorage,
    roundCommission,
} from '../helper/AppHelper';
import { getPercentage } from './ConfigService';
import { firestore } from 'firebase/app';

export interface FavoriteShopsDto {
    programs: { [shopUniqueCode: string]: ShopDto };
    userId: string;
}

export interface ShopDtoWrapper {
    batch: ShopDto[];
}

interface ProgramDocDto {
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
    id: number;
    name: string;
    status: string;
    uniqueCode: string;
    averagePaymentTime: number;
    sellingCountries: SellingCountriesDto[];

    //reviews
    totalReviews: number;
    reviewsRating: number;

    //cashback
    commission: string;
    uiCommission: string;

    //linkUrl
    computeUrl: string;

    //
    order: number;
}

export interface SellingCountriesDto {
    code: string;
    currency: string;
    name: string;
    id: number;
}

export var ShopDtoMap = {
    category: 'category',
    currency: 'currency',
    defaultLeadCommissionAmount: 'defaultLeadCommissionAmount',
    defaultLeadCommissionType: 'defaultLeadCommissionType',
    defaultSaleCommissionRate: 'defaultSaleCommissionRate',
    defaultSaleCommissionType: 'defaultSaleCommissionType',
    logoPath: 'logoPath',
    mainUrl: 'mainUrl',
    id: 'id',
    name: 'name',
    status: 'status',
    uniqueCode: 'uniqueCode',
    sellingCountries: 'sellingCountries',
    averagePaymentTime: 'averagePaymentTime',
};

export async function fetchFavoriteShops() {
    const userKey = getUserKeyFromStorage();
    if (!userKey) {
        return [];
    }
    const favoriteShopsDoc = await DB.collection(FirebaseTable.FAVORITE_SHOPS)
        .doc(userKey)
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
    const userKey = getUserKeyFromStorage();
    if (!userKey) {
        return;
    }

    const docRef = DB.collection(FirebaseTable.FAVORITE_SHOPS).doc(userKey);
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
                userId: userKey,
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
            program.computeUrl = computeUrl(
                program.uniqueCode,
                program.mainUrl
            );
            return program;
        })
        .sort((p1, p2) => p1.order - p2.order);
};

export enum CommissionType {
    fixed,
    variable,
    percent,
}

export function getProgramCommission(program, normalCommission) {
    let commission = '';
    let percent = getPercentage();
    if (program.defaultSaleCommissionRate != null) {
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
                commission =
                    (normalCommission ? '' : '~ ') +
                    roundCommission(
                        parseFloat(program.defaultSaleCommissionRate) * percent
                    ) +
                    ' %';
                break;
            case CommissionType.percent.toString():
                commission =
                    roundCommission(
                        parseFloat(program.defaultSaleCommissionRate) * percent
                    ) + ' %';
                break;
        }
    }

    if (
        program.defaultLeadCommissionAmount != null &&
        program.defaultSaleCommissionRate == null
    ) {
        switch (CommissionType[program.defaultLeadCommissionType].toString()) {
            case CommissionType.variable.toString():
                commission =
                    (normalCommission ? '' : '~ ') +
                    roundCommission(
                        parseFloat(program.defaultLeadCommissionAmount) *
                            percent
                    ) +
                    ' ' +
                    program.currency;
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

export function getShopById(id: number) {
    const shops = getLocalStorage(StorageKey.SHOPS);
    if (shops) {
        const shopsParsed = JSON.parse(shops) as Array<ShopDto>;
        return shopsParsed.find(value => {
            return value.id === id;
        });
    }
}

export function getShopByUniqueCode(uniqueCode: string) {
    const shops = getLocalStorage(StorageKey.SHOPS);
    if (shops) {
        const shopsParsed = JSON.parse(shops) as Array<ShopDto>;
        return shopsParsed.find(value => {
            return value.uniqueCode === uniqueCode;
        });
    }
}
