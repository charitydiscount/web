import {getLocalStorage} from "../helper/StorageHelper";
import {StorageKey} from "../helper/Constants";
import {DB} from "../index";
import {LoginDto} from "../components/login/LoginComponent";

export interface WalletWrapper {
    cashback: WalletInfoDto,
    points: WalletInfoDto
    transactions: TransactionDto[]
}

export interface WalletInfoDto {
    approved: Number,
    pending: Number
}

export interface TransactionDto {
    amount: Number,
    type: String,
    currency: String,
    date: Date
}

export function fetchWalletInfo(walletLayout) {
    var user = getLocalStorage(StorageKey.USER);
    if (user) {
        var keyExist = (JSON.parse(user) as LoginDto).uid;
        if (keyExist) {
            var docRef = DB.collection("points").doc(keyExist);
            docRef.get().then(function (doc) {
                if (doc.exists) {
                    const data = doc.data() as WalletWrapper;
                    walletLayout.setState({
                        cashbackApproved: data.cashback.approved,
                        cashbackPending: data.cashback.pending,
                        pointsApproved: data.points.approved,
                        pointsPending: data.points.pending,
                        totalTransactions: data.transactions.length
                    });
                }
            }).catch(function (error) {
                console.log("Error getting document:", error);
            });
        }
    }
}