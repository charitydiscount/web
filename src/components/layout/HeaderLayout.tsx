import * as React from 'react';
import { Stages } from '../helper/Stages';
import { connect } from 'react-redux';
import { doLogoutAction } from '../../redux/actions/UserActions';
import { setShops } from '../../redux/actions/ShopsAction';
import { getLocalStorage } from '../../helper/StorageHelper';
import { emptyHrefLink, StorageKey } from '../../helper/Constants';
import { ShopDto } from '../../rest/ShopsService';
import {
    setCurrentCategory,
    setSelections,
} from '../../redux/actions/CategoriesAction';
import { Routes } from '../helper/Routes';
import { FormattedMessage } from 'react-intl';
import Select from 'react-select';
import { addDefaultImgSrc, getImagePath, onLanguageChange, redirectToAbout } from '../../helper/AppHelper';
import { Link } from 'react-router-dom';
import { UserInfoDto } from "../login/AuthHelper";

type IHeaderLayoutProps = {
    isLoggedIn?: boolean;
    userInfo: UserInfoDto;
    logout: () => void;
    view?: string;

    currentLocale: string;

    // global state
    // used to refresh shops
    setShops?: any;

    //used to refresh categories
    setCurrentCategory?: any;
    setSelections?: any;
};

interface IHeaderLayoutState {
    fixedHeader: boolean;
    favShopsIconFill: boolean;
}

const options: any[] = [
    {value: 'ro', label: 'RO'},
    {value: 'en', label: 'EN'},
];
const optionFromValue = (value: string) =>
    options.find((o) => o.value === value);

class HeaderLayout extends React.Component<IHeaderLayoutProps,
    IHeaderLayoutState> {
    constructor(props: IHeaderLayoutProps) {
        super(props);
        this.state = {
            fixedHeader: false,
            favShopsIconFill: false,
        };
        this.handleLogOut = this.handleLogOut.bind(this);
        this.loadFavoriteShops = this.loadFavoriteShops.bind(this);
    }

    async componentDidMount() {
        window.addEventListener('scroll', this.handleScroll, true);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll = () => {
        let scrollTop = window.scrollY;
        if (scrollTop > 50) {
            if (!this.state.fixedHeader) {
                this.setState({
                    fixedHeader: true,
                });
            }
        } else {
            if (this.state.fixedHeader) {
                this.setState({
                    fixedHeader: false,
                });
            }
        }
    };

    public handleLogOut(event: any) {
        event.preventDefault();
        this.props.logout();
    }

    public loadFavoriteShops() {
        const favoriteShops = getLocalStorage(StorageKey.FAVORITE_SHOPS);
        this.props.setShops(favoriteShops ? JSON.parse(favoriteShops) : []);
        this.props.setCurrentCategory('Favorite Shops');
        this.props.setSelections([]);
        this.setState({
            favShopsIconFill: true,
        });
    }

    render() {
        const isShops = this.props.view === Stages.SHOPS;
        const isProducts = this.props.view === Stages.PRODUCTS;
        const isPromotions = this.props.view === Stages.PROMOTIONS;
        const isCauses = this.props.view === Stages.CAUSES;
        const isFriends = this.props.view === Stages.FRIENDS;
        const isLoginPage = this.props.view === Stages.LOGIN;
        const isWallet = this.props.view === Stages.WALLET;
        const isLoggedIn = this.props.isLoggedIn;

        return (
            <header
                className={`header_area ${
                    this.state.fixedHeader ? 'navbar_fixed' : ''
                    }`}
            >
                <div className="top_menu row m0">
                    <div className="container-fluid">
                        <div className="float-left"></div>
                        <div className="float-right">
                            <ul className="right_side">
                                {isLoggedIn && (
                                    <React.Fragment>
                                        <li>
                                            <a
                                                href={emptyHrefLink}
                                                onClick={this.handleLogOut}
                                            >
                                                <FormattedMessage
                                                    id="navigation.logout"
                                                    defaultMessage="Logout: "
                                                />
                                            </a>
                                        </li>
                                    </React.Fragment>
                                )}
                            </ul>
                        </div>
                        <div className="float-right col-4 col-md-2">
                            <Select
                                name="form-field-name"
                                value={optionFromValue(
                                    this.props.currentLocale
                                )}
                                onChange={onLanguageChange}
                                isSearchable={false}
                                className={'react_select'}
                                classNamePrefix={'react_select'}
                                options={options}
                            />
                        </div>
                    </div>
                </div>
                <div className="main_menu">
                    <nav className="navbar navbar-expand-lg navbar-light">
                        <div className="container-fluid">
                            <Link
                                className="navbar-brand logo_h"
                                to={'/login'}
                            >
                                <div className="logo-container"/>
                            </Link>


                            <button
                                className="navbar-toggler"
                                type="button"
                                data-toggle="collapse"
                                data-target="#navbarSupportedContent"
                                aria-controls="navbarSupportedContent"
                                aria-expanded="false"
                                aria-label="Toggle navigation"
                            >
                                <span className="icon-bar"/>
                                <span className="icon-bar"/>
                                <span className="icon-bar"/>
                            </button>

                            <div
                                className="collapse navbar-collapse offset"
                                id="navbarSupportedContent"
                            >
                                <div className="row w-100">
                                    <div className="col-lg-7 pr-0">
                                        <ul className="nav navbar-nav center_nav pull-right">
                                            {!isLoggedIn && (
                                                <li
                                                    className={'nav-item '}
                                                    onClick={(event) => redirectToAbout(event)}
                                                >
                                                    <a href={emptyHrefLink}
                                                       className={"nav-link"}
                                                       onClick={(event) => redirectToAbout(event)}
                                                    >
                                                        <FormattedMessage
                                                            id="userinfo.about.label"
                                                            defaultMessage="Despre"
                                                        />
                                                    </a>
                                                </li>
                                            )}
                                            <li
                                                className={
                                                    'nav-item ' +
                                                    (isShops
                                                        ? 'active'
                                                        : '')
                                                }
                                            >
                                                <Link
                                                    className="nav-link"
                                                    to={
                                                        Routes.SHOPS
                                                    }
                                                >
                                                    <FormattedMessage
                                                        id="navigation.shops"
                                                        defaultMessage="Magazine"
                                                    />
                                                </Link>
                                            </li>

                                            {isLoggedIn && (
                                                <React.Fragment>
                                                    <li
                                                        className={
                                                            'nav-item ' +
                                                            (isProducts
                                                                ? 'active'
                                                                : '')
                                                        }
                                                    >
                                                        <Link
                                                            to={Routes.PRODUCTS}
                                                            className="nav-link"
                                                        >
                                                            <FormattedMessage
                                                                id="navigation.products"
                                                                defaultMessage="Produse"
                                                            />
                                                        </Link>
                                                    </li>
                                                    <li
                                                        className={
                                                            'nav-item ' +
                                                            (isPromotions
                                                                ? 'active'
                                                                : '')
                                                        }
                                                    >
                                                        <Link
                                                            to={Routes.PROMOTIONS}
                                                            className="nav-link"
                                                        >
                                                            <FormattedMessage
                                                                id="navigation.promotions"
                                                                defaultMessage="Promotii"
                                                            />
                                                        </Link>
                                                    </li>
                                                </React.Fragment>
                                            )}
                                            <li
                                                className={
                                                    'nav-item ' +
                                                    (isCauses
                                                        ? 'active'
                                                        : '')
                                                }
                                            >
                                                <Link
                                                    to={Routes.CAUSES}
                                                    className="nav-link"
                                                >
                                                    <FormattedMessage
                                                        id="navigation.causes"
                                                        defaultMessage="Cauze"
                                                    />
                                                </Link>
                                            </li>

                                            {!isLoggedIn && (
                                                <li
                                                    className={
                                                        'nav-item ' +
                                                        (isLoginPage
                                                            ? 'active'
                                                            : '')
                                                    }
                                                >
                                                    <Link
                                                        className="nav-link"
                                                        to={
                                                            Routes.LOGIN
                                                        }
                                                    >
                                                        <FormattedMessage
                                                            id="navigation.login"
                                                            defaultMessage="Login"
                                                        />
                                                    </Link>
                                                </li>
                                            )}

                                            {isLoggedIn &&
                                            <React.Fragment>
                                                <li
                                                    className={
                                                        'nav-item ' +
                                                        (isWallet
                                                            ? 'active'
                                                            : '')
                                                    }
                                                >
                                                    <Link
                                                        className="nav-link"
                                                        to={Routes.WALLET}
                                                    >
                                                        <FormattedMessage
                                                            id="navigation.wallet"
                                                            defaultMessage="Portofel"
                                                        />
                                                    </Link>
                                                </li>
                                                <li
                                                    className={
                                                        'nav-item ' +
                                                        (isFriends
                                                            ? 'active'
                                                            : '')
                                                    }
                                                >
                                                    <Link
                                                        to={
                                                            Routes.REFERRALS
                                                        }
                                                        className="nav-link"
                                                    >
                                                        <FormattedMessage
                                                            id="navigation.referral"
                                                            defaultMessage="Invitatii"
                                                        />
                                                    </Link>
                                                </li>
                                            </React.Fragment>
                                            }
                                        </ul>
                                    </div>


                                    <div className="col-lg-5">
                                        <ul className="nav navbar-nav navbar-right right_nav pull-right">
                                            <hr/>
                                            {isLoggedIn && (
                                                <React.Fragment>
                                                    <li className="nav-item">
                                                        <Link
                                                            to={Routes.LEADERBOARD}
                                                            className="icons"
                                                        >
                                                            <i className="fa fa-table"/>
                                                        </Link>
                                                    </li>
                                                    <li className="nav-item">
                                                        <Link
                                                            to={Routes.ACHIEVEMENTS}
                                                            className="icons"
                                                        >
                                                            <i className="fa fa-trophy"/>
                                                        </Link>
                                                    </li>
                                                    <li className="nav-item">
                                                        <Link
                                                            to={
                                                                Routes.SHOPS +
                                                                '/favShops'
                                                            }
                                                            onClick={
                                                                this
                                                                    .loadFavoriteShops
                                                            }
                                                            onMouseLeave={() =>
                                                                this.setState({
                                                                    favShopsIconFill: false,
                                                                })
                                                            }
                                                            className={'icons'}
                                                        >
                                                            {this.state
                                                                .favShopsIconFill ? (
                                                                <i
                                                                    className="fa fa-heart"
                                                                    aria-hidden="true"
                                                                />
                                                            ) : (
                                                                <i
                                                                    className="fa fa-heart-o"
                                                                    aria-hidden="true"
                                                                />
                                                            )}
                                                        </Link>
                                                    </li>

                                                    <li className="nav-item">
                                                        <Link
                                                            to={Routes.USER}
                                                            className="icons"
                                                        >
                                                            <i
                                                                className="fa fa-user"
                                                                aria-hidden="true"
                                                            />
                                                        </Link>
                                                    </li>
                                                </React.Fragment>
                                            )}
                                            {!isLoggedIn &&
                                            <li className="nav-item">
                                                <Link
                                                    to={Routes.LOGIN}
                                                    className="icons"
                                                >
                                                    <i
                                                        className="fa fa-user"
                                                        aria-hidden="true"
                                                    />
                                                </Link>
                                            </li>
                                            }
                                            <hr/>
                                            {this.props.userInfo && this.props.userInfo.photoURL &&
                                            <img className="photo"
                                                 alt="Missing"
                                                 src={getImagePath(this.props.userInfo.photoURL)}
                                                 onError={addDefaultImgSrc}/>
                                            }
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </nav>
                </div>
            </header>
        );
    }
}

const mapStateToProps = (state: any) => {
    return {
        view: state.navigation.stageName,
        favShopsIconFill: state.navigation.favShopsIconFill,
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
        currentLocale: state.locale.langResources.language,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        logout: () => dispatch(doLogoutAction()),
        setShops: (shops: Array<ShopDto>) => dispatch(setShops(shops)),
        setCurrentCategory: (currentCategory: String) =>
            dispatch(setCurrentCategory(currentCategory)),
        setSelections: (selections: boolean[]) =>
            dispatch(setSelections(selections)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HeaderLayout);
