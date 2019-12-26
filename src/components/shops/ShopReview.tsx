import * as React from "react";
import {store} from "../../index";
import {NavigationsAction} from "../../redux/actions/NavigationsAction";
import {Stages} from "../helper/Stages";
import {getUserFromStorage, spinnerCss} from "../../helper/AppHelper";
import {emptyHrefLink, StorageKey} from "../../helper/Constants";
import {
    getShopById,
    ShopDto
} from "../../rest/ShopsService";
import Review from "./Review";
import {fetchReviews, ReviewDto, updateReview} from "../../rest/ReviewService";
import {LoginDto} from "../login/LoginComponent";
import {FormattedMessage} from 'react-intl';
import {InjectedIntlProps, injectIntl} from "react-intl";
import {removeLocalStorage} from "../../helper/StorageHelper";
import FadeLoader from 'react-spinners/FadeLoader';
import ShopElement from "./ShopElement";
import Modal from 'react-awesome-modal';

interface IProductReviewState {
    modalVisible: boolean,
    modalMessage: string,

    //shop info
    shop: ShopDto,

    //reviews
    description: string,
    rating: number,
    reviews: Array<ReviewDto>,
    reviewsLoading: boolean
}

interface IProductReviewProps {
    match: any
}

class ShopReview extends React.Component<IProductReviewProps & InjectedIntlProps, IProductReviewState> {

    constructor(props: IProductReviewProps & InjectedIntlProps) {
        super(props);
        this.state = {
            shop: {} as ShopDto,
            description: '',
            modalMessage: '',
            modalVisible: false,
            rating: 0,
            reviews: [],
            reviewsLoading: true
        };
        this.updateCurrentReview = this.updateCurrentReview.bind(this);
        this.handleStarFocusEnter = this.handleStarFocusEnter.bind(this);
        this.handleStarFocusRemove = this.handleStarFocusRemove.bind(this);
        this.handleShowModalMessage = this.handleShowModalMessage.bind(this);
        this.escFunction = this.escFunction.bind(this);
    }


    escFunction(event){
        if(event.keyCode === 27) {
            this.closeModal();
        }
    }

    async componentDidMount() {
        store.dispatch(NavigationsAction.setStageAction(Stages.REVIEW));
        document.addEventListener("keydown", this.escFunction, false);
        let shop = getShopById(this.props.match.params.id) as ShopDto;
        try {
            let response = await fetchReviews(shop.uniqueCode);
            if (response) {
                this.setState({
                    reviews: response as Array<ReviewDto>,
                    reviewsLoading: false
                });
            }
        } catch (error) {
            //reviews won't be loaded
            this.setState({
                reviewsLoading: false
            });
        }

        let reviewAverage = 0;
        let reviewNumber = 0;

        if (this.state.reviews) {
            this.state.reviews.forEach(value => {
                reviewAverage += value.rating;
                reviewNumber += 1;
            });
            shop.reviewsRating = reviewAverage / reviewNumber;
            shop.totalReviews = reviewNumber;
        }
        this.setState({
            shop: shop
        });
    }

    public componentWillUnmount() {
        store.dispatch(NavigationsAction.resetStageAction(Stages.REVIEW));
    }

    closeModal() {
        this.setState({
            modalVisible: false
        });
        window.location.reload();
    }

    openModal() {
        this.setState({
            modalVisible: true
        });
    }

    async updateCurrentReview() {
        if (this.state.rating > 0) {
            const user = getUserFromStorage();
            if (user) {
                const userParsed = JSON.parse(user) as LoginDto;
                if (userParsed) {
                    try {
                        let response = await updateReview(this.state.shop.uniqueCode, this.state.rating, userParsed.uid,
                            userParsed.photoURL, userParsed.displayName, this.state.description);
                        if (response) {
                            removeLocalStorage(StorageKey.REVIEWS);
                            this.handleShowModalMessage(this.props.intl.formatMessage({id: "review.update.message"}), null);
                        }
                    } catch (error) {
                        this.handleShowModalMessage(this.props.intl.formatMessage({id: "review.failed.to.update.error.message"}), null);
                    }
                }
            }
        } else {
            this.handleShowModalMessage(this.props.intl.formatMessage({id: "review.error.message"}), null);
        }
    }

    handleShowModalMessage(message, favShop) {
        if (favShop !== null) {
            this.setState({
                modalMessage: message,
            });
        } else {
            this.setState({
                modalMessage: message
            });
        }
        this.openModal();
    }

    handleStarClicked(event, starLevel) {
        for (let i = 1; i <= 5; i++) {
            let element = document.getElementById("star-" + i);
            if (i <= starLevel) {
                if (element) {
                    element.className = "fa fa-star star-focus";
                    this.setState({
                        rating: starLevel
                    })
                }
            } else {
                if (element) {
                    element.className = "fa fa-star-o";
                }
            }
        }
    }

    handleStarFocusEnter(event, starLevel) {
        for (let i = 1; i <= starLevel; i++) {
            const element = document.getElementById("star-" + i);
            if (element) {
                if (this.state.rating === 0 || this.state.rating < i) {
                    element.className = "fa fa-star star-focus";
                }
            }
        }
    }

    handleStarFocusRemove(event, starLevel) {
        for (let i = 1; i <= starLevel; i++) {
            let element = document.getElementById("star-" + i);
            if (element) {
                if (this.state.rating === 0 || this.state.rating < i) {
                    element.className = "fa fa-star-o";
                }
            }
        }
    }

    public render() {
        const reviewsList = this.state.reviews && this.state.reviews.length > 0 ? this.state.reviews.map(review => {
            return <Review key={review.reviewer.name} photoUrl={review.reviewer.photoUrl} name={review.reviewer.name}
                           description={review.description} rating={review.rating} userID={review.reviewer.userId}/>
        }) : <FormattedMessage id={"review.no.reviews"} defaultMessage="No reviews yet"/>;

        return (
            <React.Fragment>
                <Modal
                    visible={this.state.modalVisible}
                    effect="fadeInUp"
                    onClickAway={() => this.closeModal()}
                >
                    <h3 style={{padding: 15}}>
                        {this.state.modalMessage}
                    </h3>
                </Modal>
                <section className={"product_description_area"}>
                    <div className={"container"}>
                        <div className="row" style={{marginTop:70}}>
                            <div className="col-lg-6">
                                <ShopElement key={this.state.shop.name} shop={this.state.shop}
                                             comingFromShopReview={true}/>
                            </div>
                            <div className="col-lg-6">
                                <div className="tab-pane fade show active p_20" id="review">
                                    <div className="review_box">
                                        <p>
                                            <FormattedMessage id={"review.rating.label"} defaultMessage="Your rating:"/>
                                        </p>
                                        <ul className="list">
                                            <li>
                                                <a href={emptyHrefLink}>
                                                    <i id={'star-1'} className="fa fa-star-o"
                                                       onClick={() => this.handleStarClicked(this, 1)}
                                                       onMouseEnter={() => this.handleStarFocusEnter(this, 1)}
                                                       onMouseLeave={() => this.handleStarFocusRemove(this, 1)}/>
                                                </a>
                                            </li>
                                            <li>
                                                <a href={emptyHrefLink}>
                                                    <i id={'star-2'} className="fa fa-star-o"
                                                       onClick={() => this.handleStarClicked(this, 2)}
                                                       onMouseEnter={() => this.handleStarFocusEnter(this, 2)}
                                                       onMouseLeave={() => this.handleStarFocusRemove(this, 2)}/>
                                                </a>
                                            </li>
                                            <li>
                                                <a href={emptyHrefLink}>
                                                    <i id={'star-3'} className="fa fa-star-o"
                                                       onClick={() => this.handleStarClicked(this, 3)}
                                                       onMouseEnter={() => this.handleStarFocusEnter(this, 3)}
                                                       onMouseLeave={() => this.handleStarFocusRemove(this, 3)}/>
                                                </a>
                                            </li>
                                            <li>
                                                <a href={emptyHrefLink}>
                                                    <i id={'star-4'} className="fa fa-star-o"
                                                       onClick={() => this.handleStarClicked(this, 4)}
                                                       onMouseEnter={() => this.handleStarFocusEnter(this, 4)}
                                                       onMouseLeave={() => this.handleStarFocusRemove(this, 4)}/>
                                                </a>
                                            </li>
                                            <li>
                                                <a href={emptyHrefLink}>
                                                    <i id={'star-5'} className="fa fa-star-o"
                                                       onClick={() => this.handleStarClicked(this, 5)}
                                                       onMouseEnter={() => this.handleStarFocusEnter(this, 5)}
                                                       onMouseLeave={() => this.handleStarFocusRemove(this, 5)}/>
                                                </a>
                                            </li>
                                        </ul>
                                        <div className="form-group">
                                             <textarea className="form-control"
                                                       value={this.state.description}
                                                       onChange={event => this.setState({description: event.target.value})}
                                                       placeholder={this.props.intl.formatMessage({id: "review.placeholder"})}>
                                             </textarea>
                                        </div>

                                        <div className="col-md-12 text-right">
                                            <a href={emptyHrefLink} onClick={this.updateCurrentReview}
                                               className="btn submit_btn">
                                                <FormattedMessage id={"review.submit.button"}
                                                                  defaultMessage="Submit review"/>
                                            </a>
                                        </div>
                                    </div>
                                    <div className="review_list p_20">
                                        <FadeLoader
                                            loading={this.state.reviewsLoading}
                                            color={'#1641ff'}
                                            css={spinnerCss}
                                        />
                                        {!this.state.reviewsLoading && reviewsList}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </React.Fragment>
        );
    }
}

export default injectIntl(ShopReview);