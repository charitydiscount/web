import axios from "axios";
import {auth} from "../index";

export function fetchHotDeals(programId) {
    return new Promise(((resolve, reject) => {
        let url = 'https://affiliate-dot-charity-proxy.appspot.com/programs/' + programId + '/promotions';
        auth.onAuthStateChanged(async function (user) {
            if (user) {
                let token = await user.getIdToken(false);
                if (token) {
                    return axios({method: 'get', url: url, headers: {'authorization': 'Bearer ' + token}})
                        .then((response => {
                            console.log(response.data);
                        }))
                        .catch(() => {
                            reject();
                        })
                } else {
                    reject();
                }
            } else {
                reject();
            }
        });
    }));
}