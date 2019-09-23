import * as React from "react";

interface IReviewProps {

}

class Review extends React.Component<IReviewProps> {

    public render() {
        return (
            <React.Fragment>
                <div className="review_item">
                    <div className="media">
                        <div className="d-flex">
                            <img src="img/product/single-product/review-1.png" alt=""/>
                        </div>
                        <div className="media-body">
                            <h4>Blake Ruiz</h4>
                            <i className="fa fa-star"></i>
                            <i className="fa fa-star"></i>
                            <i className="fa fa-star"></i>
                            <i className="fa fa-star"></i>
                            <i className="fa fa-star"></i>
                        </div>
                    </div>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                        eiusmod tempor incididunt ut labore et dolore magna
                        aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                        ullamco
                        laboris nisi ut aliquip ex ea commodo</p>
                </div>
            </React.Fragment>
        )
    }
}

export default Review;