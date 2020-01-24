import * as React from 'react';
import { store } from '../../index';
import { NavigationsAction } from '../../redux/actions/NavigationsAction';
import { Stages } from '../helper/Stages';
import { getUserFromStorage, spinnerCss } from '../../helper/AppHelper';
import { emptyHrefLink, StorageKey } from '../../helper/Constants';
import { getShopById, ShopDto } from '../../rest/ShopsService';
import Review from './Review';
import { fetchReviews, ReviewDto, saveReview } from '../../rest/ReviewService';
import { LoginDto } from '../login/LoginComponent';
import { FormattedMessage } from 'react-intl';
import { injectIntl, IntlShape } from 'react-intl';
import { removeLocalStorage } from '../../helper/StorageHelper';
import FadeLoader from 'react-spinners/FadeLoader';
import ShopElement from './ShopElement';
import Modal from 'react-awesome-modal';

interface IProductReviewState {
    modalVisible: boolean;
    modalMessage: string;

    //shop info
    shop: ShopDto;

    //reviews
    description: string;
    rating: number;
    reviews: Array<ReviewDto>;
    reviewsLoading: boolean;
}

interface IProductReviewProps {
    match: any;
    intl: IntlShape;
}

class ShopReview extends React.Component<
    IProductReviewProps,
    IProductReviewState
> {
    constructor(props: IProductReviewProps) {
        super(props);
        this.state = {
            shop: {} as ShopDto,
            description: '',
            modalMessage: '',
            modalVisible: false,
            rating: 0,
            reviews: [],
            reviewsLoading: true,
        };
        this.updateCurrentReview = this.updateCurrentReview.bind(this);
        this.handleStarFocusEnter = this.handleStarFocusEnter.bind(this);
        this.handleStarFocusRemove = this.handleStarFocusRemove.bind(this);
        this.handleShowModalMessage = this.handleShowModalMessage.bind(this);
        this.escFunction = this.escFunction.bind(this);
    }

    escFunction(event) {
        if (event.keyCode === 27) {
            this.closeModal();
        }
    }

    async componentDidMount() {
        store.dispatch(NavigationsAction.setStageAction(Stages.REVIEW));
        document.addEventListener('keydown', this.escFunction, false);
        let shop = getShopById(parseInt(this.props.match.params.id)) as ShopDto;
        try {
            let reviews = await fetchReviews(shop.uniqueCode);
            // const ownReview = reviews.find((review) => review.reviewer.userId = )
            this.setState({
                reviews: reviews,
                reviewsLoading: false,
            });
        } catch (error) {
            //reviews won't be loaded
            this.setState({
                reviewsLoading: false,
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
            shop: shop,
        });
    }

    public componentWillUnmount() {
        store.dispatch(NavigationsAction.resetStageAction(Stages.REVIEW));
    }

    closeModal() {
        this.setState({
            modalVisible: false,
        });
        window.location.reload();
    }

    openModal() {
        this.setState({
            modalVisible: true,
        });
    }

    async updateCurrentReview() {
        if (this.state.rating > 0) {
            const user = getUserFromStorage();
            if (user) {
                const userParsed = JSON.parse(user) as LoginDto;
                if (userParsed) {
                    try {
                        await saveReview(
                            this.state.shop.uniqueCode,
                            this.state.rating,
                            this.state.description,
                            {
                                userId: userParsed.uid,
                                name: userParsed.displayName || '-',
                                photoUrl: userParsed.photoURL || '',
                            }
                        );
                        removeLocalStorage(StorageKey.REVIEWS);
                        this.handleShowModalMessage(
                            this.props.intl.formatMessage({
                                id: 'review.update.message',
                            }),
                            null
                        );
                    } catch (error) {
                        this.handleShowModalMessage(
                            this.props.intl.formatMessage({
                                id: 'review.failed.to.update.error.message',
                            }),
                            null
                        );
                    }
                }
            }
        } else {
            this.handleShowModalMessage(
                this.props.intl.formatMessage({ id: 'review.error.message' }),
                null
            );
        }
    }

    handleShowModalMessage(message, favShop) {
        if (favShop !== null) {
            this.setState({
                modalMessage: message,
            });
        } else {
            this.setState({
                modalMessage: message,
            });
        }
        this.openModal();
    }

    handleStarClicked(event, starLevel: number) {
        this.setState({
            rating: starLevel,
        });
    }

    handleStarFocusEnter(event, starLevel) {
        for (let i = 1; i <= starLevel; i++) {
            const element = document.getElementById('star-' + i);
            if (element) {
                if (this.state.rating === 0 || this.state.rating < i) {
                    element.className = 'fa fa-star star-focus fa-lg';
                }
            }
        }
    }

    handleStarFocusRemove(event, starLevel) {
        for (let i = 1; i <= starLevel; i++) {
            let element = document.getElementById('star-' + i);
            if (element) {
                if (this.state.rating === 0 || this.state.rating < i) {
                    element.className = 'fa fa-star-o fa-lg';
                }
            }
        }
    }

    public render() {
        const reviewsList =
            this.state.reviews && this.state.reviews.length > 0 ? (
                this.state.reviews.map(review => {
                    return (
                        <Review
                            key={review.reviewer.name}
                            photoUrl={review.reviewer.photoUrl}
                            name={review.reviewer.name}
                            description={review.description}
                            rating={review.rating}
                            userID={review.reviewer.userId}
                        />
                    );
                })
            ) : (
                <FormattedMessage
                    id={'review.no.reviews'}
                    defaultMessage="No reviews yet"
                />
            );

        const rating = [1, 2, 3, 4, 5].map(star => (
            <li key={`star-${star}`}>
                <a href={emptyHrefLink}>
                    {star < this.state.rating ? (
                        <i
                            id={`star-${star}`}
                            className="fa fa-star fa-lg"
                            onClick={() => this.handleStarClicked(this, star)}
                            onMouseEnter={() =>
                                this.handleStarFocusEnter(this, star)
                            }
                            onMouseLeave={() =>
                                this.handleStarFocusRemove(this, star)
                            }
                        />
                    ) : (
                        <i
                            id={`star-${star}`}
                            className="fa fa-star-o fa-lg"
                            onClick={() => this.handleStarClicked(this, star)}
                            onMouseEnter={() =>
                                this.handleStarFocusEnter(this, star)
                            }
                            onMouseLeave={() =>
                                this.handleStarFocusRemove(this, star)
                            }
                        />
                    )}
                </a>
            </li>
        ));

        return (
            <React.Fragment>
                <Modal
                    visible={this.state.modalVisible}
                    effect="fadeInUp"
                    onClickAway={() => this.closeModal()}
                >
                    <h3 style={{ padding: 15 }}>{this.state.modalMessage}</h3>
                </Modal>
                <section className={'product_description_area'}>
                    <div className={'container'}>
                        <div className="row" style={{ marginTop: 70 }}>
                            <div className="col-lg-6">
                                <ShopElement
                                    key={this.state.shop.name}
                                    shop={this.state.shop}
                                    comingFromShopReview={true}
                                />
                            </div>
                            <div className="col-lg-6">
                                <div
                                    className="tab-pane fade show active p_20"
                                    id="review"
                                >
                                    <div className="review_box">
                                        <p>
                                            <FormattedMessage
                                                id={'review.rating.label'}
                                                defaultMessage="Your rating:"
                                            />
                                        </p>
                                        <ul className="list">{rating}</ul>
                                        <div className="form-group">
                                            <textarea
                                                className="form-control"
                                                value={this.state.description}
                                                onChange={event =>
                                                    this.setState({
                                                        description:
                                                            event.target.value,
                                                    })
                                                }
                                                placeholder={this.props.intl.formatMessage(
                                                    { id: 'review.placeholder' }
                                                )}
                                            ></textarea>
                                        </div>

                                        <div className="col-md-12 text-right">
                                            <a
                                                href={emptyHrefLink}
                                                onClick={() =>
                                                    this.updateCurrentReview()
                                                }
                                                className="btn submit_btn"
                                            >
                                                <FormattedMessage
                                                    id={'review.submit.button'}
                                                    defaultMessage="Submit review"
                                                />
                                            </a>
                                        </div>
                                    </div>
                                    <div className="review_list p_20">
                                        <FadeLoader
                                            loading={this.state.reviewsLoading}
                                            color={'#1641ff'}
                                            css={spinnerCss}
                                        />
                                        {!this.state.reviewsLoading &&
                                            reviewsList}
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
