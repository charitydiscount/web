import {getLocalStorage} from "../helper/StorageHelper";
import {StorageKey} from "../helper/Constants";
import {DB} from "../index";

export interface WalletWrapper {
    cashback: WalletInfoDto,
    points: WalletInfoDto
}

export interface WalletInfoDto {
    approved: Number,
    pending: Number
}

export function fetchWalletInfo(walletLayout) {
    var keyExist = getLocalStorage(StorageKey.USER);
    if (keyExist) {
        var docRef = DB.collection("points").doc(keyExist);
        docRef.get().then(function (doc) {
            if (doc.exists) {
                const data = doc.data() as WalletWrapper;
                walletLayout.setState({
                    cashbackApproved: data.cashback.approved,
                    cashbackPending: data.cashback.pending,
                    pointsApproved: data.points.approved,
                    pointsPending: data.points.pending
                });
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
        });
    }
}