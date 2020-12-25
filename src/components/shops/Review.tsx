import * as React from 'react';
import { ReviewDto } from "../../rest/ReviewService";
import { addDefaultImgSrc, dateOptions, getImagePath } from "../../helper/AppHelper";

interface IReviewProps {
    review: ReviewDto
}

export const Review: React.FunctionComponent<IReviewProps> = props => {
    const rating = [1, 2, 3, 4, 5].map(star =>
        star <= props.review.rating ? (
            <i
                key={`star-${star}`}
                className="fa fa-star star-focus fa-lg"
            />
        ) : (
            <i
                key={`star-${star}`}
                className="fa fa-star-o star-focus fa-lg"
            />
        )
    );

    let creationDate;
    try {
        creationDate = <h5>{props.review.createdAt
            .toDate()
            .toLocaleDateString('ro-RO', dateOptions)}</h5>
    } catch (e) {
        //creation date not parsed
    }

    return (
        <React.Fragment>
            <div className="review_item">
                <div className="media">
                    <div className="d-flex">
                        <img
                            src={getImagePath(props.review.reviewer.photoUrl)}
                            alt="Missing"
                            width={80}
                            height={80}
                            style={{borderRadius: 70}}
                            onError={addDefaultImgSrc}
                        />
                    </div>
                    <div className="media-body">
                        <h4>{props.review.reviewer.name}</h4>
                        {creationDate}
                        {rating}
                    </div>
                </div>
                <p>{props.review.description}</p>
            </div>
        </React.Fragment>
    );
};
