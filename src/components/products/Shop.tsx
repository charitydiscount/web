import * as React from "react";
import Modal from 'react-awesome-modal';
import {ShopDto} from "./ShopDto";
import {getLocalStorage, removeLocalStorage} from "../../helper/WebHelper";
import {emptyHrefLink, noActionHrefLink, StorageKey} from "../../helper/Constants";
import {auth, DB} from "../../index";
import {FavoriteShopsDto} from "./FavoriteShopsDto";

interface IProductInfoState {
    visible: boolean;
}

interface IProductProps {
    logoSrc: string,
    name: string,
    category: string,
    mainUrl: string
}

class Shop extends React.Component<IProductProps, IProductInfoState> {

    constructor(props: IProductProps) {
        super(props);
        this.state = {
            visible: false
        };
        this.updateFavoriteShops = this.updateFavoriteShops.bind(this);
    }

    closeModal() {
        this.setState({
            visible: false
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
                                        removeLocalStorage(StorageKey.FAVORITE_SHOPS)
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
                <Modal visible={this.state.visible} effect="fadeInUp"
                       onClickAway={() => this.closeModal()}>
                    <div className={"container-fluid "}>
                        <article className="row blog_item">
                            <div className="col-md-3">
                                <div className="blog_info text-right">
                                    <div className="post_tag">
                                        <a className="active" href={emptyHrefLink}>{this.props.category}</a>
                                    </div>
                                    <ul className="blog_meta list">
                                        <li>
                                            <a href={emptyHrefLink}>Mark wiens
                                                <i className="lnr lnr-user"/>
                                            </a>
                                        </li>
                                        <li>
                                            <a href={emptyHrefLink}>12 Dec, 2017
                                                <i className="lnr lnr-calendar-full"/>
                                            </a>
                                        </li>
                                        <li>
                                            <a href={emptyHrefLink}>1.2M Views
                                                <i className="lnr lnr-eye"/>
                                            </a>
                                        </li>
                                        <li>
                                            <a href={emptyHrefLink}>06 Comments
                                                <i className="lnr lnr-bubble"/>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-md-9">
                                <div className="blog_post p_30">
                                    <img src={this.props.logoSrc} alt=""/>
                                    <div className="blog_details">
                                        <a href={emptyHrefLink}>
                                            <h2>{this.props.name}</h2>
                                        </a>
                                        <p>MCSE boot camps have its supporters and its detractors. Some people do not
                                            understand
                                            why you should have to spend money on boot camp when you can get the MCSE
                                            study
                                            materials yourself at a fraction.</p>
                                        <a href={this.props.mainUrl} className="white_bg_btn">Access</a>
                                    </div>
                                </div>
                            </div>
                        </article>
                    </div>
                </Modal>
                <div className="col-lg-3 col-md-3 col-sm-6">
                    <div className="f_p_item">
                        <div className="f_p_img">
                            <a href={noActionHrefLink} onClick={() => this.openModal()}>
                                <img className="img-fluid img-min img" src={this.props.logoSrc} alt=""/>
                            </a>
                            <div className="p_icon">
                                <a href={emptyHrefLink} onClick={this.updateFavoriteShops}>
                                    <i className="lnr lnr-heart"/>
                                </a>
                            </div>
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