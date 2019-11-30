import {emptyHrefLink} from "../../helper/Constants";
import {Link} from "react-router-dom";
import {Routes} from "../helper/Routes";
import * as React from "react";
import {ShopDto, updateFavoriteShops, verifyInFavoriteShops} from "../../rest/ShopsService";
import {InjectedIntlProps, injectIntl} from 'react-intl';
import {FormattedMessage} from 'react-intl';

interface IShopElementProps {
    shop: ShopDto,
    comingFromShopReview?: boolean
}

interface IShopElementState {
    favShop: boolean
}

class ShopElement extends React.Component<IShopElementProps & InjectedIntlProps, IShopElementState> {

    constructor(props: IShopElementProps) {
        super(props);
        this.state = {
            favShop: false
        };
        this.updateFavoriteShops = this.updateFavoriteShops.bind(this);
    }

    componentDidMount() {
        if (verifyInFavoriteShops(this.props.shop.id)) {
            this.setState({
                favShop: true,
            });
        }
    }

    /**
     * Used to add/remove favorite shops from DB
     */
    async updateFavoriteShops(remove) {
        try {
            let response = await updateFavoriteShops(this.props.shop.name, remove);
            if (response) {
                this.setState({
                    favShop: !remove
                });
            }
        } catch (error) {
            alert(this.props.intl.formatMessage({
                id: 'favorite.shop.failed.to.update',
            }));
        }
    }


    public render() {
        let sellingCountries =
            this.props.shop.sellingCountries &&
            this.props.shop.sellingCountries.length > 0 &&
            this.props.shop.sellingCountries
                .map(country => {
                    return country.name;
                })
                .join(', ');

        return (
            <React.Fragment>
                <div className="text-center p-4">
                    <h4 className="blue-color">
                        <FormattedMessage
                            id={'shop.cashback'}
                            defaultMessage="Cashback:"
                        />
                        {this.props.shop.commission}
                    </h4>
                    <h6>
                        <FormattedMessage
                            id={'shop.cashback.without.vat.and.transport'}
                            defaultMessage="of the value without VAT and transport"
                        />
                    </h6>
                    <h6>
                        <FormattedMessage
                            id={'average.waiting.time'}
                            defaultMessage="Average waiting time: "
                        />
                        {this.props.shop.averagePaymentTime}
                        <FormattedMessage
                            id={'average.waiting.time.days'}
                            defaultMessage=" days"
                        />
                    </h6>
                    <img src={this.props.shop.logoPath} alt=""/>
                    <div className="blog_details">
                        <h2>{this.props.shop.name}</h2>
                        <h6 style={this.props.comingFromShopReview ? {} : {maxWidth: 300}}>
                            <FormattedMessage
                                id={'shop.available.in'}
                                defaultMessage="Available in: "
                            />
                            {sellingCountries}
                        </h6>
                        {this.props.shop.reviewsRating ? (
                            <a href={emptyHrefLink}>
                                {this.props.shop.reviewsRating >= 1 ? (
                                    <i className="fa fa-star star-focus"/>
                                ) : (
                                    <i className="fa fa-star-o star-focus"/>
                                )}
                                {this.props.shop.reviewsRating >= 2 ? (
                                    <i className="fa fa-star star-focus"/>
                                ) : this.props.shop.reviewsRating > 1 &&
                                this.props.shop.reviewsRating < 2 ? (
                                    <i className="fa fa-star-half-o star-focus"/>
                                ) : (
                                    <i className="fa fa-star-o star-focus"/>
                                )}
                                {this.props.shop.reviewsRating >= 3 ? (
                                    <i className="fa fa-star star-focus"/>
                                ) : this.props.shop.reviewsRating > 2 &&
                                this.props.shop.reviewsRating < 3 ? (
                                    <i className="fa fa-star-half-o star-focus"/>
                                ) : (
                                    <i className="fa fa-star-o star-focus"/>
                                )}
                                {this.props.shop.reviewsRating >= 4 ? (
                                    <i className="fa fa-star star-focus"/>
                                ) : this.props.shop.reviewsRating > 3 &&
                                this.props.shop.reviewsRating < 4 ? (
                                    <i className="fa fa-star-half-o star-focus"/>
                                ) : (
                                    <i className="fa fa-star-o star-focus"/>
                                )}
                                {this.props.shop.reviewsRating >= 5 ? (
                                    <i className="fa fa-star star-focus"/>
                                ) : this.props.shop.reviewsRating > 4 &&
                                this.props.shop.reviewsRating < 5 ? (
                                    <i className="fa fa-star-half-o star-focus"/>
                                ) : (
                                    <i className="fa fa-star-o star-focus"/>
                                )}
                                <span> {this.props.shop.totalReviews}</span>
                            </a>
                        ) : ('')}
                        <h3 style={this.props.comingFromShopReview ? {} : {maxWidth: 300}}>
                            <FormattedMessage
                                id={'shop.category'}
                                defaultMessage="Category:"
                            />
                            {this.props.shop.category}
                        </h3>
                        <div className="s_product_text">
                            <div className="card_area p_20">
                                <a
                                    href={this.props.shop.computeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="main_btn"
                                >
                                    <FormattedMessage
                                        id={'shop.access.button'}
                                        defaultMessage="Access"
                                    />
                                </a>
                                {!this.props.comingFromShopReview &&
                                <div className={'icon_btn p_icon p_05'}>
                                    <Link
                                        to={
                                            Routes.REVIEW +
                                            '/' +
                                            this.props.shop.id
                                        }
                                    >

                                        <i className="lnr lnr-bubble"/>
                                    </Link>
                                </div>
                                }

                                <div className={'icon_btn p_icon'}>
                                    <a href={emptyHrefLink}
                                       onClick={() => this.updateFavoriteShops(this.state.favShop)}>
                                        <i className={this.state.favShop ? "fa fa-heart" : "fa fa-heart-o"}/>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default injectIntl(ShopElement);