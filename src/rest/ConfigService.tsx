import {getSessionStorage, removeSessionStorage, setSessionStorage} from "../helper/StorageHelper";
import {FirebaseTable, StorageKey, TableDocument} from "../helper/Constants";
import {DB} from "../index";

export interface ConfigDto {
    bonusPercentage: number,
    percentage: number,
    uniqueCode: string
}

export function fetchAffiliateCode() {
    const code = getSessionStorage(StorageKey.PERFORMANET_2_CODE);
    if (code) {
        return (JSON.parse(code) as ConfigDto).uniqueCode;
    } else {
        var docRef = DB.collection(FirebaseTable.META).doc(TableDocument.PERFORMANT2);
        docRef.get().then(function (doc) {
            if (doc.exists) {
                var data = doc.data() as ConfigDto;
                setSessionStorage(StorageKey.PERFORMANET_2_CODE, JSON.stringify(data));
                return data.uniqueCode;
            } else {
                console.log("No such document!");
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
        });
    }
}

export function fetchPercentage() {
    return new Promise(((resolve, reject) => {
        let code = getSessionStorage(StorageKey.PERFORMANET_2_CODE);
        if (code) {
            let stEntry = JSON.parse(code);
            //verify localStorage valid
            if (stEntry.length <= 0 || stEntry[0] === undefined || !stEntry[0].hasOwnProperty("percentage")) {
                removeSessionStorage(StorageKey.PERFORMANET_2_CODE);
            } else {
                resolve((JSON.parse(code) as ConfigDto).percentage);
                return;
            }
        }

        DB.collection(FirebaseTable.META).doc(TableDocument.PERFORMANT2).get()
            .then(doc => {
                if (doc.exists) {
                    var data = doc.data() as ConfigDto;
                    setSessionStorage(StorageKey.PERFORMANET_2_CODE, JSON.stringify(data));
                    resolve(data.percentage);
                } else {
                    reject();
                }
            }).catch(() => {
            reject();
        });
    }))
}
