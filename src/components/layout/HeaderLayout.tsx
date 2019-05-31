import * as React from "react";
import {Stages} from "../helper/Stages";
import {connect} from "react-redux";
import {doLogoutAction} from "../login/UserActions";
import {ShopDto} from "../products/ShopDto";
import {setShops} from "../../redux/actions/ShopsAction";
import {getLocalStorage, setLocalStorage} from "../../helper/WebHelper";
import {StorageKey} from "../../helper/Constants";
import {auth, DB} from "../../index";
import {FavoriteShopsDto} from "../products/FavoriteShopsDto";

interface IHeaderLayoutProps {
    isLoggedIn: boolean,
    logout: () => void,
    view: string,

    // global state
    setShops: any
}

class HeaderLayout extends React.Component<IHeaderLayoutProps> {

    constructor(props: IHeaderLayoutProps) {
        super(props);
        this.handleLogOut = this.handleLogOut.bind(this);
        this.loadFavoriteShops = this.loadFavoriteShops.bind(this);
    }

    public handleLogOut(event: any) {
        event.preventDefault();
        this.props.logout();
    }

    loadFavoriteShops() {
        var favoriteShops = getLocalStorage(StorageKey.FAVORITE_SHOPS);
        if (favoriteShops) {
            this.props.setShops(JSON.parse(favoriteShops));
        } else {
            auth.onAuthStateChanged(function (user) {
                    if (user) {
                        var docRef = DB.doc("favoriteShops/" + user.uid);
                        docRef
                            .get()
                            .then(querySnapshot => {
                                const data = querySnapshot.data() as FavoriteShopsDto;
                                if (data) {
                                    if (data.programs) {
                                        setLocalStorage(StorageKey.FAVORITE_SHOPS, JSON.stringify(data.programs));
                                        favoriteShops = JSON.stringify(data.programs);
                                    }
                                }
                            });
                    }
                }
            );
            if (favoriteShops) {
                this.props.setShops(JSON.parse(favoriteShops));
            }
        }
    }

    render() {
        const isCategories = (this.props.view === Stages.CATEGORIES);
        const isCauses = (this.props.view === Stages.CAUSES);
        const isDeals = (this.props.view === Stages.DEALS);
        const isContact = (this.props.view === Stages.CONTACT);
        const isLoggedIn = this.props.isLoggedIn;

        return (
            <header className="header_area">
                <div className="top_menu row m0">
                    <div className="container-fluid">
                        <div className="float-left">
                        </div>
                        <div className="float-right">
                            <ul className="right_side">
                                {isLoggedIn
                                &&
                                <React.Fragment>
                                    <li>
                                        <a href="#" onClick={this.handleLogOut}>
                                            Logout
                                        </a>
                                    </li>

                                    <li>
                                        <a href="/user">
                                            My account
                                        </a>
                                    </li>
                                </React.Fragment>
                                }
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="main_menu">
                    <nav className="navbar navbar-expand-lg navbar-light">
                        <div className="container-fluid">
                            <a className="navbar-brand logo_h" href="#">
                                <img src="img/logo.png" alt=""/>
                            </a>
                            <button className="navbar-toggler" type="button" data-toggle="collapse"
                                    data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                                    aria-expanded="false" aria-label="Toggle navigation">
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                            </button>
                            <div className="collapse navbar-collapse offset" id="navbarSupportedContent">
                                <div className="row w-100">
                                    <div className="col-lg-7 pr-0">
                                        <ul className="nav navbar-nav center_nav pull-right">
                                            {isLoggedIn
                                            &&
                                            <React.Fragment>
                                                <li className={"nav-item " + (isCategories ? "active" : "")}>
                                                    <a className="nav-link" href="/categories">Categories</a>
                                                </li>

                                                <li className={"nav-item " + (isDeals ? "active" : "")}>
                                                    <a className="nav-link" href="/deals">Deals</a>
                                                </li>

                                                <li className={"nav-item " + (isCauses ? "active" : "")}>
                                                    <a className="nav-link" href="/causes">Causes</a>
                                                </li>

                                                <li className={"nav-item " + (isContact ? "active" : "")}>
                                                    <a className="nav-link" href="/contact">Contact</a>
                                                </li>
                                            </React.Fragment>
                                            }
                                        </ul>
                                    </div>

                                    {isLoggedIn
                                    &&
                                    <div className="col-lg-5">
                                        <ul className="nav navbar-nav navbar-right right_nav pull-right">
                                            <hr/>

                                            <li className="nav-item">
                                                <a href="#" className="icons" onClick={this.loadFavoriteShops}>
                                                    <i className="fa fa-heart-o" aria-hidden="true"/>
                                                </a>
                                            </li>

                                            <li className="nav-item">
                                                <a href="/user" className="icons">
                                                    <i className="fa fa-user" aria-hidden="true"/>
                                                </a>
                                            </li>

                                            <hr/>
                                        </ul>
                                    </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </nav>
                </div>
            </header>
        )
    }
}

const
    mapStateToProps = (state: any) => {
        return {
            view: state.navigation.stageName,
            isLoggedIn: state.user.isLoggedIn
        }
    };

const
    mapDispatchToProps = (dispatch: any) => {
        return {
            logout: () => dispatch(doLogoutAction()),
            setShops: (shops: Array<ShopDto>) =>
                dispatch(setShops(shops)),
        };
    };

export default connect(mapStateToProps, mapDispatchToProps)

(
    HeaderLayout
);