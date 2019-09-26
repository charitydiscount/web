import * as React from "react";

interface IReviewProps {
    photoUrl: string,
    name: string,
    description: string
}

class Review extends React.Component<IReviewProps> {

    public render() {
        return (
            <React.Fragment>
                <div className="review_item">
                    <div className="media">
                        <div className="d-flex">
                            <img src={this.props.photoUrl} alt="" width={80} height={80} style={{borderRadius: 70}}/>
                        </div>
                        <div className="media-body">
                            <h4>{this.props.name}</h4>
                            <i className="fa fa-star"></i>
                            <i className="fa fa-star"></i>
                            <i className="fa fa-star"></i>
                            <i className="fa fa-star"></i>
                            <i className="fa fa-star"></i>
                        </div>
                    </div>
                    <p>{this.props.description}</p>
                </div>
            </React.Fragment>
        )
    }
}

export default Review;