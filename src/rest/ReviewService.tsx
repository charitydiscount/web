import {DB} from "../index";

export interface ReviewsDBWrapper {
    reviews: ReviewDto[]
}

export interface ReviewDto {
    createdAt: Date,
    description: string,
    rating: number,
    reviewer: ReviewerDto
}

export interface ReviewerDto {
    name: string,
    photoUrl: string,
    userId: string
}


export function fetchReviews(shopUniqueCode, reviewLayout) {
    var docRef = DB.collection("reviews").doc(shopUniqueCode);
    docRef.get().then(function (doc) {
        if (doc.exists) {
            const data = doc.data() as ReviewsDBWrapper;
            var reviews = new Array<ReviewDto>();
            new Map(Object.entries(data.reviews)).forEach(value => {
                reviews.push(value);
            });
            if (reviews) {
                reviewLayout.setState({
                    reviews: reviews
                });
            }
        }
    });
}

export interface MetaReviewsDBWrapper {
    ratings: Map<String, ReviewRating>;
}

export interface ReviewRating {
    count: number,
    rating: number,
}

export function fetchReviewRatings(shopsLayout) {
    const docRef = DB.collection("meta").doc("programs");
    docRef.get().then(function (doc) {
            if (doc.exists) {
                let dbReviews = doc.data() as MetaReviewsDBWrapper;
                shopsLayout.props.setRatings(new Map(Object.entries(dbReviews.ratings)));
                shopsLayout.setState({
                    isLoadingRating: false
                })
            }
        }
    );
}

export function updateReview(uniqueCode, rating, userId, photoUrl, name, description, shopRewiewLayout) {
    var review = {
        createdAt: new Date(),
        rating: rating,
        description: description,
        reviewer: {
            name: name,
            photoUrl: photoUrl,
            userId: userId
        }
    };

    var docRef = DB.collection("reviews").doc(uniqueCode);
    docRef.get().then(function (doc) {
        if (doc.exists) {
            docRef.set({
                'reviews': {
                    [review.reviewer.userId]: review
                }
            }, {merge: true})
                .then(function () {
                    shopRewiewLayout.setState({
                        modalMessage: "Review updated"
                    });
                    shopRewiewLayout.openModal();
                    fetchReviews(uniqueCode, shopRewiewLayout);
                })
        } else {
            // create the first entry for the document
            docRef.set({
                shopUniqueCode: uniqueCode,
                'reviews': {
                    [review.reviewer.userId]: review
                }
            }).then(function () {
                shopRewiewLayout.setState({
                    modalMessage: "Review created"
                });
                shopRewiewLayout.openModal();
                fetchReviews(uniqueCode, shopRewiewLayout);
            })
        }
    });
}