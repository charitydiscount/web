import {getSessionStorage, setSessionStorage} from "../helper/WebHelper";
import {StorageKey} from "../helper/Constants";
import {DB} from "../index";

export function fetchAffiliateCode() {
    const code = getSessionStorage(StorageKey.AFFILIATE_CODE);
    if (code) {
        return code;
    } else {
        var docRef = DB.collection("meta").doc("2performant");
        docRef.get().then(function (doc) {
            if (doc.exists) {
                var data = doc.data() as ConfigDto;
                setSessionStorage(StorageKey.AFFILIATE_CODE, data.uniqueCode);
                return data.uniqueCode;
            } else {
                console.log("No such document!");
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
        });
    }
}

export interface ConfigDto {
    bonusPercentage: number,
    percentage: number,
    uniqueCode: string
}

