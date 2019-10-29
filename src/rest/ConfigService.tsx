import {getSessionStorage, setSessionStorage} from "../helper/StorageHelper";
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

export  function fetchPercentage(currentShop) {
    const code = getSessionStorage(StorageKey.PERFORMANET_2_CODE);
    if (code) {
        currentShop.setState({
            percentage: (JSON.parse(code) as ConfigDto).percentage
        });
    } else {
        var docRef = DB.collection(FirebaseTable.META).doc(TableDocument.PERFORMANT2);
        docRef.get().then(function (doc) {
            if (doc.exists) {
                var data = doc.data() as ConfigDto;
                setSessionStorage(StorageKey.PERFORMANET_2_CODE, JSON.stringify(data));
                currentShop.setState({
                    percentage: data.percentage
                })
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
        });
    }
}
