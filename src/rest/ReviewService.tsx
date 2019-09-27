import {DB} from "../index";

export interface ReviewAnswerDto {
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
            const data = doc.data() as ReviewAnswerDto;
            var reviews = new Array<ReviewDto>();
            new Map(Object.entries(data.reviews)).forEach( value =>{
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

export function updateReview(uniqueCode, userId, photoUrl, name, description) {
    var review = {
        createdAt: new Date(),
        rating: 0,
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
                'reviews' : {
                    [review.reviewer.userId]: review
                }
            }, {merge:true});
        } else {
            // create the first entry for the document
            docRef.set({
                shopUniqueCode: uniqueCode,
                'reviews' : {
                    [review.reviewer.userId]: review
                }
            })
        }
    });
}