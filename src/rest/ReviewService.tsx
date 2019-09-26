import {DB} from "../index";

export interface ReviewsDto {
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
            const data = doc.data() as ReviewsDto;
            var reviews = new Array<ReviewDto>();
            data.reviews.forEach(value => {
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
            let wholeObject = doc.data() as ReviewsDto;
            var reviews = wholeObject.reviews as ReviewDto[];
            reviews.push(review as ReviewDto);
            docRef.update({
                reviews: reviews
            })
        } else {
            // create the document as a list
            var reviews = [] as ReviewDto[];
            reviews.push(review as ReviewDto);
            docRef.set({
                reviews: reviews,
                shopUniqueCode: uniqueCode
            })
        }
    });
}