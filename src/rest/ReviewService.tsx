import {DB} from '../index';
import {firestore} from 'firebase/app';
import {getLocalStorage, removeLocalStorage, setLocalStorage} from "../helper/StorageHelper";
import {FirebaseTable, StorageKey, TableDocument} from "../helper/Constants";

export interface ReviewsDBWrapper {
    reviews: ReviewDto[];
}

export interface ReviewDto {
    createdAt: Date;
    description: string;
    rating: number;
    reviewer: ReviewerDto;
}

export interface ReviewerDto {
    name: string;
    photoUrl: string;
    userId: string;
}

export function fetchReviews(shopUniqueCode) {
    return new Promise(((resolve, reject) => {
        DB.collection(FirebaseTable.REVIEWS).doc(shopUniqueCode).get()
            .then(doc => {
                if (doc.exists) {
                    const data = doc.data() as ReviewsDBWrapper;
                    var reviews = new Array<ReviewDto>();
                    new Map(Object.entries(data.reviews)).forEach(value => {
                        reviews.push(value);
                    });
                    resolve(reviews);
                } else {
                    reject(); //entry can't be found in DB
                }
            })
            .catch(() => {
                reject(); //DB not working
            });
    }))
}

export interface MetaReviewsDBWrapper {
    ratings: Map<String, ReviewRating>;
}

export interface ReviewRating {
    count: number;
    rating: number;
}

export function fetchReviewRatings() {
    return new Promise(((resolve, reject) => {
        const reviews = getLocalStorage(StorageKey.REVIEWS);
        if (reviews) {
            try {
                let stEntry = JSON.parse(reviews);
                //verify localStorage valid
                if (stEntry.length <= 0) {
                    removeLocalStorage(StorageKey.REVIEWS);
                } else {
                    resolve(JSON.parse(reviews) as Map<String, ReviewRating>);
                    return;
                }
            } catch (error) {
                removeLocalStorage(StorageKey.REVIEWS);
            }
        }

        DB.collection(FirebaseTable.META).doc(TableDocument.PROGRAMS).get()
            .then(function (doc) {
                if (doc.exists) {
                    let dbReviews = doc.data() as MetaReviewsDBWrapper;
                    setLocalStorage(StorageKey.REVIEWS, JSON.stringify(dbReviews.ratings));
                    resolve(dbReviews.ratings);
                } else {
                    reject(); //entry doesn't exist in DB
                }
            })
            .catch(() => {
                reject(); //DB not working
            });
    }));
}

export function updateReview(
    uniqueCode: string,
    rating: number,
    userId: string,
    photoUrl: string | null,
    name: string,
    description: string
) {
    return new Promise(((resolve, reject) => {
        let review = {
            createdAt: firestore.FieldValue.serverTimestamp(),
            rating: rating,
            description: description,
            reviewer: {
                name: name,
                photoUrl: photoUrl ? photoUrl : '',
                userId: userId,
            },
        };

        let docRef = DB.collection(FirebaseTable.REVIEWS).doc(uniqueCode);
        docRef.get()
            .then(function (doc) {
                if (doc.exists) {
                    docRef
                        .set(
                            {
                                reviews: {
                                    [review.reviewer.userId]: review,
                                },
                            },
                            {merge: true}
                        )
                        .then(function () {
                            resolve(true);
                        })
                        .catch(() => {
                            reject();
                        });
                } else {
                    // create the first entry for the document
                    docRef
                        .set({
                            shopUniqueCode: uniqueCode,
                            reviews: {
                                [review.reviewer.userId]: review,
                            },
                        })
                        .then(function () {
                            resolve(true);
                        })
                        .catch(() => {
                            reject();
                        });
                }
            })
            .catch(() => {
                reject();
            });
    }))
}
