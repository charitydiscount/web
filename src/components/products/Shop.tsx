import * as React from "react";
import Modal from 'react-awesome-modal';
import {ShopDto} from "./ShopDto";
import {getLocalStorage, removeLocalStorage} from "../../helper/WebHelper";
import {emptyHrefLink, noActionHrefLink, StorageKey} from "../../helper/Constants";
import {auth, DB} from "../../index";
import {FavoriteShopsDto} from "./FavoriteShopsDto";
import {isInFavoriteShops} from "../../rest/ShopsService";
import {fetchAffiliateCode} from "../../rest/ConfigService";

interface IProductInfoState {
    visible: boolean;
    fShopVisible: boolean;
    addedToFavShop: boolean
}

interface IProductProps {
    logoSrc: string,
    name: string,
    id: number,
    category: string,
    mainUrl: string,
    uniqueCode: string
}

class Shop extends React.Component<IProductProps, IProductInfoState> {

    constructor(props: IProductProps) {
        super(props);
        this.state = {
            visible: false,
            fShopVisible: false,
            addedToFavShop: false
        };
        this.updateFavoriteShops = this.updateFavoriteShops.bind(this);
    }

    computeUrl(uniqueId, url) {
        var baseUrl = 'https://event.2performant.com/events/click?ad_type=quicklink';
        var theCode = fetchAffiliateCode();
        var affCode = '&aff_code=' + theCode;
        var unique = '&unique=' + uniqueId;
        var redirect = '&redirect_to=' + url;
        var tag = '&st=' + getLocalStorage(StorageKey.USER);
        return baseUrl + affCode + unique + redirect + tag;
    }

    closeModal() {
        this.setState({
            visible: false
        });
    }

    closeFShopModal() {
        this.setState({
            fShopVisible: false,
            addedToFavShop: true
        });
    }

    openFShopModal() {
        this.setState({
            fShopVisible: true
        });
    }

    openModal() {
        this.setState({
            visible: true
        });
    }

    /**
     * Used to add favorite shops to DB
     */
    public updateFavoriteShops() {
        this.openFShopModal();
        let name = this.props.name;
        auth.onAuthStateChanged(function (user) {
                if (user) {
                    const storage = getLocalStorage(StorageKey.SHOPS);
                    if (storage) {
                        const shops = JSON.parse(storage) as Array<ShopDto>;
                        if (shops) {
                            let favoriteShop = shops.find(shop => shop.name === name) as ShopDto;
                            if (favoriteShop) {
                                var docRef = DB.doc("favoriteShops/" + user.uid);
                                docRef.get()
                                    .then((docSnapshot) => {
                                        if (docSnapshot.exists) {
                                            let wholeObject = docSnapshot.data() as FavoriteShopsDto;
                                            var favoriteShops = wholeObject.programs as ShopDto[];
                                            favoriteShops.push(favoriteShop);
                                            docRef.update({
                                                programs: favoriteShops
                                            })
                                        } else {
                                            // create the document as a list
                                            var favShops = [] as ShopDto[];
                                            favShops.push(favoriteShop);
                                            docRef.set({
                                                programs: favShops,
                                                userId: user.uid
                                            })
                                        }
                                        removeLocalStorage(StorageKey.FAVORITE_SHOPS);
                                        removeLocalStorage(StorageKey.FAVORITE_SHOPS_ID);
                                    });
                            }
                        }
                    }
                }
            }
        );
    }

    public render() {
        return (
            <React.Fragment>
                <Modal visible={this.state.fShopVisible} effect="fadeInUp"
                       onClickAway={() => this.closeFShopModal()}>
                    <h3 style={{padding: 15}}>Favorite shop: {this.props.name} added</h3>
                </Modal>
                <Modal visible={this.state.visible} effect="fadeInUp"
                       onClickAway={() => this.closeModal()}>
                    <div className="text-center p_20">
                        <img src={this.props.logoSrc} alt=""/>
                        <div className="blog_details">
                            <a href={emptyHrefLink}>
                                <h2>{this.props.name}</h2>
                            </a>
                            <h2>{"Category: " + this.props.category}</h2>
                            <a href={this.computeUrl(this.props.uniqueCode, this.props.mainUrl)}
                               className="white_bg_btn">Access</a>
                        </div>
                    </div>
                </Modal>
                <div className="col-lg-3 col-md-3 col-sm-6">
                    <div className="f_p_item">
                        <div className="f_p_img">
                            <a href={noActionHrefLink} onClick={() => this.openModal()}>
                                <img className="img-fluid img-min img" src={this.props.logoSrc} alt=""/>
                            </a>

                            {isInFavoriteShops(this.props.id) === true || this.state.addedToFavShop === true ?
                                <div className="p_iconUpdate">
                                    <a href={emptyHrefLink}>
                                        <i className="lnr lnr-heart"/>
                                    </a>
                                </div>
                                :
                                <div className="p_icon">
                                    <a href={emptyHrefLink} onClick={this.updateFavoriteShops}>
                                        <i className="lnr lnr-heart"/>
                                    </a>
                                </div>
                            }
                        </div>
                        <a href={noActionHrefLink} onClick={() => this.openModal()}>
                            <h4>{this.props.name}</h4>
                        </a>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default Shop;