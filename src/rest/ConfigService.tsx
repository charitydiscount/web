import {getSessionStorage, setSessionStorage} from "../helper/WebHelper";
import {StorageKey} from "../helper/Constants";
import {DB} from "../index";
import {ConfigDto} from "../config/ConfigDto";

export function fetchAffiliateCode() {
    const code = getSessionStorage(StorageKey.AFFILIATE_CODE);
    if (code) {
        var decodedCode = JSON.parse(code) as ConfigDto;
        return decodedCode.uniqueCode;
    } else {
        DB.collection("meta")
            .get()
            .then(answer => {
                    var data = answer.docs.map(doc => doc.data());
                    if (data) {
                        var wrapper = data.pop();
                        if (wrapper) {
                            setSessionStorage(StorageKey.AFFILIATE_CODE, JSON.stringify(wrapper));
                            var decodedCode = wrapper as ConfigDto;
                            return decodedCode.uniqueCode;
                        }
                    }
                }
            );
    }
}