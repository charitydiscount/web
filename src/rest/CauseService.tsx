import {DB} from "../index";
import {getLocalStorage, removeLocalStorage, setLocalStorage} from "../helper/StorageHelper";
import {FirebaseTable, StorageKey} from "../helper/Constants";

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

export function fetchCauses() {
    return new Promise((resolve, reject) => {
            let causes = getLocalStorage(StorageKey.CAUSES);
            if (causes) {
                try {
                    let stEntry = JSON.parse(causes);
                    //verify localStorage valid
                    if (stEntry.length <= 0 || stEntry[0] === undefined || !stEntry[0].hasOwnProperty("details")) {
                        removeLocalStorage(StorageKey.CAUSES);
                    } else {
                        resolve(stEntry);
                        return;
                    }
                } catch (error) {
                    removeLocalStorage(StorageKey.CAUSES);
                }
            }

            DB.collection(FirebaseTable.CASES).get()
                .then(querySnapshot => {
                        let data = [] as CauseDto[];
                        querySnapshot.docs.forEach(value => {
                            data.push({
                                id: value.id,
                                details: value.data() as CauseDetailDto
                            });
                        });
                        setLocalStorage(StorageKey.CAUSES, JSON.stringify(data));
                        resolve(data);
                    }
                )
                .catch(() => {
                    reject(); //DB not working
                });
        }
    );
}