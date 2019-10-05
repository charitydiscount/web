import {DB} from "../index";
import {getLocalStorage, setLocalStorage} from "../helper/StorageHelper";
import {StorageKey} from "../helper/Constants";

export interface ImageDto {
    url: string
}

export interface CauseDetailDto {
    description: string,
    images: ImageDto[],
    site: string,
    title: string
}

export interface CauseDto {
    id: string,
    details: CauseDetailDto
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
                let data = [] as CauseDto[];
                querySnapshot.docs.forEach(value => {
                    data.push({
                        id: value.id,
                        details: value.data() as CauseDetailDto
                    });
                });
                setLocalStorage(StorageKey.CAUSES, JSON.stringify(data));
                causesLayout.setState({
                    causes: data
                });
            }
        )
}