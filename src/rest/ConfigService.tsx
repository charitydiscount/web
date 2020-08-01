import { getSessionStorage, removeSessionStorage, setSessionStorage } from "../helper/StorageHelper";
import { FirebaseTable, StorageKey, TableDocument } from "../helper/Constants";
import { DB } from "../index";

export interface ConfigDto {
    bonusPercentage: number,
    percentage: number,
    uniqueCode: string
}

export interface ImportantCategoryWrapper {
    categories: ImportantCategoryDto[]
}

export interface ImportantCategoryDto {
    name: string,
    photoName: string
}

export function getAffiliateCode() {
    const code = getSessionStorage(StorageKey.PERFORMANET_2_CODE);
    if (code) {
        return (JSON.parse(code) as ConfigDto).uniqueCode;
    } else {
        return "6586acf43";
    }
}

export function getPercentage() {
    const code = getSessionStorage(StorageKey.PERFORMANET_2_CODE);
    if (code) {
        return (JSON.parse(code) as ConfigDto).percentage;
    } else {
        return 0.6;
    }
}

export const fetchImportantCategories = async (): Promise<ImportantCategoryDto[]> => {
    return new Promise(((resolve, reject) => {
        DB.collection(FirebaseTable.META).doc(TableDocument.IMPORTANT_CATEGORIES).get()
            .then(doc => {
                if (doc.exists) {
                    const data = doc.data() as ImportantCategoryWrapper;
                    resolve(Object.values(data.categories).map(value => value));
                } else {
                    reject(); //entry can't be found in DB
                }
            })
            .catch(() => {
                reject(); //DB not working
            });
    }));
};


export function fetchConfigInfo() {
    return new Promise(((resolve, reject) => {
        const code = getSessionStorage(StorageKey.PERFORMANET_2_CODE);
        if (code) {
            let stKey = JSON.parse(code);
            if (stKey.length <= 0 || stKey[0] === undefined || !stKey[0].hasOwnProperty("uniqueCode") ||
                !stKey[0].hasOwnProperty("percentage")) {
                removeSessionStorage(StorageKey.PERFORMANET_2_CODE);
            } else {
                resolve();
                return;
            }
        }

        DB.collection(FirebaseTable.META).doc(TableDocument.PERFORMANT2).get()
            .then(doc => {
                if (doc.exists) {
                    var data = doc.data() as ConfigDto;
                    setSessionStorage(StorageKey.PERFORMANET_2_CODE, JSON.stringify(data));
                    resolve();
                } else {
                    reject(); //entry can't be found in DB
                }
            })
            .catch(() => {
                reject(); //DB not working
            });
    }));
}
