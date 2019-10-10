import * as React from "react";

interface IReviewProps {
    photoUrl: string,
    name: string,
    description: string,
    rating: number
}

class Review extends React.Component<IReviewProps> {

    public render() {
        let photoUrl = this.props.photoUrl;
        if (photoUrl.includes("facebook")) {
            photoUrl += '?height=200';
        }

        return (
            <React.Fragment>
                <div className="review_item">
                    <div className="media">
                        <div className="d-flex">
                            {photoUrl ?
                                <img src={photoUrl} alt="No content" width={80} height={80} style={{borderRadius: 70}}/>
                                :
                                <img src={"/img/no-image.jpg"} alt="No content" width={80} height={80}
                                     style={{borderRadius: 70}}/>
                            }
                        </div>
                        <div className="media-body">
                            <h4>{this.props.name}</h4>
                            {this.props.rating >= 1 ? <i className="fa fa-star"/> :
                                <i className="fa fa-star-o"/>}
                            {this.props.rating >= 2 ? <i className="fa fa-star"/> :
                                <i className="fa fa-star-o"/>}
                            {this.props.rating >= 3 ? <i className="fa fa-star"/> :
                                <i className="fa fa-star-o"/>}
                            {this.props.rating >= 4 ? <i className="fa fa-star"/> :
                                <i className="fa fa-star-o"/>}
                            {this.props.rating >= 5 ? <i className="fa fa-star"/> :
                                <i className="fa fa-star-o"/>}
                        </div>
                    </div>
                    <p>{this.props.description}</p>
                </div>
            </React.Fragment>
        )
    }
}

export default Review;