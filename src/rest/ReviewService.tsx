import { DB } from '../index';
import { firestore } from 'firebase/app';
import {
    getLocalStorage,
    removeLocalStorage,
    setLocalStorage,
} from '../helper/StorageHelper';
import { FirebaseTable, StorageKey, TableDocument } from '../helper/Constants';

export interface ReviewsDBWrapper {
    reviews: ReviewDto[];
}

export interface ReviewDto {
    createdAt:  firestore.Timestamp;
    description: string;
    rating: number;
    reviewer: ReviewerDto;
}

export interface ReviewerDto {
    name: string;
    photoUrl: string;
    userId: string;
}

export const fetchReviews = (shopUniqueCode: string) =>
    DB.collection(FirebaseTable.REVIEWS)
        .doc(shopUniqueCode)
        .get()
        .then(doc => {
            if (doc.exists) {
                const data = doc.data() as ReviewsDBWrapper;
                return Object.values(data.reviews)
                    .sort((p1, p2) => {
                        if (p1.createdAt > p2.createdAt) {
                            return -1;
                        } else {
                            return 1;
                        }
                    });
            } else {
                return [];
            }
        })
        .catch((e: any) => {
            console.log(e);
            return [];
        });

export interface MetaReviewsDBWrapper {
    ratings: Map<String, ReviewRating>;
}

export interface ReviewRating {
    count: number;
    rating: number;
}

export function fetchReviewRatings() {
    return new Promise((resolve, reject) => {
        const reviews = getLocalStorage(StorageKey.REVIEWS_RATINGS);
        if (reviews) {
            try {
                let stEntry = JSON.parse(reviews);
                //verify localStorage valid
                if (stEntry.length <= 0) {
                    removeLocalStorage(StorageKey.REVIEWS_RATINGS);
                } else {
                    resolve(JSON.parse(reviews) as Map<String, ReviewRating>);
                    return;
                }
            } catch (error) {
                removeLocalStorage(StorageKey.REVIEWS_RATINGS);
            }
        }

        DB.collection(FirebaseTable.META)
            .doc(TableDocument.PROGRAMS)
            .get()
            .then(function(doc) {
                if (doc.exists) {
                    let dbReviews = doc.data() as MetaReviewsDBWrapper;
                    setLocalStorage(
                        StorageKey.REVIEWS_RATINGS,
                        JSON.stringify(dbReviews.ratings)
                    );
                    resolve(dbReviews.ratings);
                } else {
                    reject(); //entry doesn't exist in DB
                }
            })
            .catch(() => {
                reject(); //DB not working
            });
    });
}

export const saveReview = (
    uniqueCode: string,
    rating: number,
    description: string,
    {
        userId,
        name,
        photoUrl,
    }: { userId: string; name: string; photoUrl: string }
) =>
    DB.collection(FirebaseTable.REVIEWS)
        .doc(uniqueCode)
        .get()
        .then(reviewsSnap =>
            reviewsSnap.exists
                ? reviewsSnap.ref.update({
                      [`reviews.${userId}`]: {
                          reviewer: {
                              userId,
                              name,
                              photoUrl,
                          },
                          rating: rating,
                          description: description,
                          createdAt: firestore.FieldValue.serverTimestamp(),
                      },
                  })
                : reviewsSnap.ref.set({
                      reviews: {
                          [userId]: {
                              reviewer: {
                                  userId,
                                  name,
                                  photoUrl,
                              },
                              rating: rating,
                              description: description,
                              createdAt: firestore.FieldValue.serverTimestamp(),
                          },
                      },
                      shopUniqueCode: uniqueCode,
                  })
        );
