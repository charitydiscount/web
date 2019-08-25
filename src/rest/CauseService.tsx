import {DB} from "../index";
import {getLocalStorage, setLocalStorage} from "../helper/StorageHelper";
import {StorageKey} from "../helper/Constants";

export interface ImageDto {
    url: string
}

export interface CauseDto {
    description: String,
    images: ImageDto[],
    site: String,
    title: String
}

export function fetchCauses(causesLayout) {
    const causes = getLocalStorage(StorageKey.CAUSES);
    if (causes) {
        causesLayout.setState({
            causes: JSON.parse(causes)
        });
    }
    var dbRef = DB.collection("cases");
    dbRef.get()
        .then(querySnapshot => {
                const data = querySnapshot.docs.map(doc => doc.data() as CauseDto[]);
                setLocalStorage(StorageKey.CAUSES, JSON.stringify(data));
                causesLayout.setState({
                    causes: data
                });
            }
        )
}