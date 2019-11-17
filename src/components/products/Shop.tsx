import * as React from 'react';
import Modal from 'react-awesome-modal';
import {emptyHrefLink} from '../../helper/Constants';
import {
    SellingCountriesDto,
    updateFavoriteShops, verifyInFavoriteShops,
} from '../../rest/ShopsService';
import {computeUrl} from '../../helper/AppHelper';
import {Link} from "react-router-dom";
import {Routes} from "../helper/Routes";
import {FormattedMessage} from 'react-intl';
import {InjectedIntlProps, injectIntl} from "react-intl";
import {getPercentage} from "../../rest/ConfigService";

interface IProductInfoState {
    visible: boolean,
    fShopVisible: boolean,
    favShop: boolean,
    percentage: number,
    favShopModalMessage: string
}

interface IProductProps {
    logoSrc: string,
    name: string,
    id: number,
    category: string,
    mainUrl: string,
    uniqueCode: string,
    reviewRating: number,
    defaultLeadCommissionAmount: string,
    defaultLeadCommissionType: string,
    defaultSaleCommissionRate: string,
    defaultSaleCommissionType: string,
    totalReviews: number,
    sellingCountries: SellingCountriesDto[]
}

class Shop extends React.Component<IProductProps & InjectedIntlProps, IProductInfoState> {

    constructor(props: IProductProps) {
        super(props);
        this.state = {
            visible: false,
            fShopVisible: false,
            favShop: false,
            percentage: 0,
            favShopModalMessage: ''
        };
        this.updateFavoriteShopsTrue = this.updateFavoriteShopsTrue.bind(this);
        this.updateFavoriteShopsFalse = this.updateFavoriteShopsFalse.bind(this);
    }

    componentDidMount() {
        let percentage = getPercentage();
        if (percentage) {
            this.setState({
                percentage: percentage as number
            })
        } else {
            this.setState({
                percentage: 0.6
            })
        }
    }

    closeModal() {
        this.setState({
            visible: false
        });
    }

    closeFShopModal() {
        this.setState({
            visible: true,
            fShopVisible: false,
            favShopModalMessage: ''
        });
    }

    openFShopModal(message) {
        this.setState({
            fShopVisible: true,
            favShopModalMessage: message
        });
    }

    openModal() {
        if (verifyInFavoriteShops(this.props.id)) {
            this.setState({
                favShop: true
            })
        }
        this.setState({
            visible: true
        });
    }

    /**
     * Used to add favorite shops to DB
     */
    async updateFavoriteShopsTrue() {
        try {
            let response = await updateFavoriteShops(this.props.name, false);
            if (response) {
                this.closeModal();
                this.openFShopModal(this.props.intl.formatMessage({id: "shop.favorite.shop"}) +
                    this.props.name + ' ' +
                    this.props.intl.formatMessage({id: "shop.favorite.shop.added"}));
                this.setState({
                    favShop: true
                });
            }
        } catch (error) {
            this.closeModal();
            this.openFShopModal(this.props.intl.formatMessage({id: "favorite.shop.failed.to.update"}));
        }
    }

    /**
     * Used to remove favorite shops from DB
     */
    async updateFavoriteShopsFalse() {
        try {
            let response = await updateFavoriteShops(this.props.name, true);
            if (response) {
                this.closeModal();
                this.openFShopModal(this.props.intl.formatMessage({id: "shop.favorite.shop"}) +
                    this.props.name + ' ' +
                    this.props.intl.formatMessage({id: "shop.favorite.shop.removed"}));
                this.setState({
                    favShop: false
                });
            }
        } catch (error) {
            this.closeModal();
            this.openFShopModal(this.props.intl.formatMessage({id: "favorite.shop.failed.to.update"}));
        }
    }

    public render() {
        let commission = this.props.defaultLeadCommissionAmount != null
            ? (parseFloat(this.props.defaultLeadCommissionAmount) * this.state.percentage).toFixed(2) + ' RON'
            : (parseFloat(this.props.defaultSaleCommissionRate) * this.state.percentage).toFixed(2) + ' %';
        let sellingCountries = this.props.sellingCountries.map(country => {
            return country.name;
        }).join(", ");

        return (
            <React.Fragment>
                <Modal visible={this.state.fShopVisible} effect="fadeInUp" onClickAway={() => this.closeFShopModal()}>
                    <h3 style={{padding: 15}}>
                        {this.state.favShopModalMessage}
                    </h3>
                </Modal>
                <Modal visible={this.state.visible} effect="fadeInUp" onClickAway={() => this.closeModal()}>
                    <div className="text-center p_20">
                        <h4 className="blue-color">
                            <FormattedMessage id={"shop.cashback"} defaultMessage="Cashback:"/>
                            {commission}
                        </h4>
                        <h6>
                            <FormattedMessage id={"shop.cashback.without.vat.and.transport"}
                                              defaultMessage="of the value without VAT and transport"/>
                        </h6>
                        <img src={this.props.logoSrc} alt=""/>
                        <div className="blog_details">
                            <h2>{this.props.name}</h2>
                            <h6><FormattedMessage id={"shop.available.in"}
                                                  defaultMessage="Available in: "/>
                                {sellingCountries}
                            </h6>
                            {this.props.reviewRating ?
                                <a href={emptyHrefLink}>
                                    {this.props.reviewRating >= 1 ? <i className="fa fa-star star-focus"/> :
                                        <i className="fa fa-star-o star-focus"/>}
                                    {this.props.reviewRating >= 2 ? <i className="fa fa-star star-focus"/> :
                                        this.props.reviewRating > 1 && this.props.reviewRating < 2 ?
                                            <i className="fa fa-star-half-o star-focus"/> :
                                            <i className="fa fa-star-o star-focus"/>}
                                    {this.props.reviewRating >= 3 ? <i className="fa fa-star star-focus"/> :
                                        this.props.reviewRating > 2 && this.props.reviewRating < 3 ?
                                            <i className="fa fa-star-half-o star-focus"/> :
                                            <i className="fa fa-star-o star-focus"/>}
                                    {this.props.reviewRating >= 4 ? <i className="fa fa-star star-focus"/> :
                                        this.props.reviewRating > 3 && this.props.reviewRating < 4 ?
                                            <i className="fa fa-star-half-o star-focus"/> :
                                            <i className="fa fa-star-o star-focus"/>}
                                    {this.props.reviewRating >= 5 ? <i className="fa fa-star star-focus"/> :
                                        this.props.reviewRating > 4 && this.props.reviewRating < 5 ?
                                            <i className="fa fa-star-half-o star-focus"/> :
                                            <i className="fa fa-star-o star-focus"/>}
                                    <span> {this.props.totalReviews}</span>
                                </a>
                                : ''}
                            <h3>
                                <FormattedMessage id={"shop.category"} defaultMessage="Category:"/>
                                {this.props.category}
                            </h3>
                            <div className="s_product_text">
                                <div className="card_area p_20">
                                    <a href={computeUrl(this.props.uniqueCode, this.props.mainUrl)}
                                       target="_blank"
                                       rel="noopener noreferrer"
                                       className="main_btn">
                                        <FormattedMessage id={"shop.access.button"} defaultMessage="Access"/>
                                    </a>
                                    <div className={"icon_btn p_icon p_05"}>
                                        <Link to={Routes.REVIEW + "/" + this.props.id}>
                                            <i className="lnr lnr-bubble"/>
                                        </Link>
                                    </div>

                                    <div
                                        className={this.state.favShop === true ? 'icon_btn p_iconUpdate' : 'icon_btn p_icon'}>
                                        <a href={emptyHrefLink} onClick={
                                            this.state.favShop === true
                                                ? this.updateFavoriteShopsFalse
                                                : this.updateFavoriteShopsTrue
                                        }>
                                            <i className="lnr lnr-heart"/>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
                <div className="col-lg-3 col-md-3 col-sm-6">
                    <div className="f_p_item">
                        <div onClick={() => this.openModal()} style={{cursor: 'pointer'}}>
                            <h6 className="blue-color">{commission}</h6>
                            <div className="f_p_img">
                                <img
                                    className="img-fluid img-min img"
                                    src={this.props.logoSrc}
                                    alt=""
                                />
                            </div>
                            <h4>{this.props.name}</h4>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default (injectIntl(Shop));
