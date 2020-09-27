import { getSessionStorage, setSessionStorage } from "../helper/StorageHelper";
import { FirebaseTable, StorageKey, TableDocument } from "../helper/Constants";
import { DB } from "../index";

export interface GeneralConfigDto {
    userPercentage: number
}

export interface TwoPerformantDto {
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
    const code = getSessionStorage(StorageKey.UNIQUE_CODE);
    if (code) {
        return (JSON.parse(code) as TwoPerformantDto).uniqueCode;
    } else {
        return "6586acf43";
    }
}

export function getPercentage() {
    const code = getSessionStorage(StorageKey.GENERAL_CONFIG);
    if (code) {
        return (JSON.parse(code) as GeneralConfigDto).userPercentage;
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
        const config = getSessionStorage(StorageKey.GENERAL_CONFIG);
        const code = getSessionStorage(StorageKey.UNIQUE_CODE);
        if (code && config) {
            resolve();
            return;
        }

        DB.collection(FirebaseTable.META).doc(TableDocument.GENERAL)
            .get()
            .then(doc => {
                if (doc.exists) {
                    setSessionStorage(StorageKey.GENERAL_CONFIG, JSON.stringify({
                        userPercentage: (doc.data() as GeneralConfigDto).userPercentage
                    }));
                }
            })
            .catch(() => {
                reject(); //DB not working
            });

        DB.collection(FirebaseTable.META).doc(TableDocument.PERFORMANT2)
            .get()
            .then(doc => {
                if (doc.exists) {
                    setSessionStorage(StorageKey.UNIQUE_CODE, JSON.stringify({
                        uniqueCode: (doc.data() as TwoPerformantDto).uniqueCode
                    }));
                }
            })
            .catch(() => {
                reject(); //DB not working
            });
        resolve();
    }));
}
