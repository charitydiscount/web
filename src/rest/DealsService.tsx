import axios from "axios";
import {auth} from "../index";

export function fetchHotDeals(programId) {
    var url = 'https://affiliate-dot-charity-proxy.appspot.com/programs/' + programId + '/promotions';
    auth.onAuthStateChanged(async function (user) {
        if (user) {
            const token = await user.getIdToken(false);
            axios.defaults.headers.common["Authorization"] = 'Bearer '.concat(token);
            axios.get(url)
                .then((response => {
                    console.log(response.data);
                }));
        }
    });

}