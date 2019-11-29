import * as React from 'react';
import {Stages} from '../helper/Stages';
import {connect} from 'react-redux';
import {doLogoutAction} from '../login/UserActions';
import {setShops} from '../../redux/actions/ShopsAction';
import {getLocalStorage} from '../../helper/StorageHelper';
import {emptyHrefLink, logoPath, StorageKey} from '../../helper/Constants';
import {ShopDto} from '../../rest/ShopsService';
import {
    setCurrentCategory,
    setSelections,
} from '../../redux/actions/CategoriesAction';
import {LoginDto} from '../login/LoginComponent';
import {Routes} from '../helper/Routes';
import {FormattedMessage} from 'react-intl';
import Select from 'react-select';
import {onLanguageChange} from '../../helper/AppHelper';
import {Link} from 'react-router-dom';
import {setFavShopsIconFill} from "../../redux/actions/NavigationsAction";

type IHeaderLayoutProps = {
    isLoggedIn?: boolean;
    logout: () => void;
    view?: string;

    currentLocale: string;

    // global state
    // used to refresh shops
    setShops?: any;

    //used to refresh categories
    setCurrentCategory?: any;
    setSelections?: any;

    //fav shops loading
    setFavShopsIconFill?: any;
    favShopsIconFill?: boolean
};

interface IHeaderLayoutState {
    username: string
}

const options: any[] = [
    {value: 'ro', label: 'RO'},
    {value: 'en', label: 'EN'},
];
const optionFromValue = (value: string) => options.find(o => o.value === value);

class HeaderLayout extends React.Component<IHeaderLayoutProps, IHeaderLayoutState> {

    constructor(props: IHeaderLayoutProps) {
        super(props);
        this.state = {
            username: '',
        };
        this.handleLogOut = this.handleLogOut.bind(this);
        this.loadFavoriteShops = this.loadFavoriteShops.bind(this);
    }

    public componentDidMount() {
        const user = getLocalStorage(StorageKey.USER);
        if (user) {
            const userParsed = JSON.parse(user) as LoginDto;
            this.setState({
                username: userParsed.displayName,
            });
        }
    }

    public handleLogOut(event: any) {
        event.preventDefault();
        this.props.logout();
    }

    public loadFavoriteShops() {
        const favoriteShops = getLocalStorage(StorageKey.FAVORITE_SHOPS);
        if (favoriteShops) {
            this.props.setShops(JSON.parse(favoriteShops));
        }
        this.props.setCurrentCategory('Favorite Shops');
        this.props.setSelections([]);
        this.props.setFavShopsIconFill(true);
    }

    render() {
        const isCategories = this.props.view === Stages.CATEGORIES;
        const isTos = this.props.view === Stages.TOS;
        const isPrivacy = this.props.view === Stages.PRIVACY;
        const isCauses = this.props.view === Stages.CAUSES;
        const isWallet = this.props.view === Stages.WALLET;
        const isLoggedIn = this.props.isLoggedIn;

        return (
            <header className="header_area">
                <div className="top_menu row m0">
                    <div className="container-fluid">
                        <div className="float-left">
                            {isLoggedIn && (
                                <React.Fragment>
                                    <p>
                                        <FormattedMessage
                                            id="navigation.welcome"
                                            defaultMessage="Welcome: "
                                        />
                                        {this.state.username
                                            ? this.state.username
                                            : ''}
                                    </p>
                                </React.Fragment>
                            )}
                        </div>
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
                            {(isLoggedIn ||
                                (!isLoggedIn && (isTos || isPrivacy))) && (
                                <a
                                    className="navbar-brand logo_h"
                                    href={'/login'}
                                >
                                    <img src={logoPath} alt=""/>
                                </a>
                            )}
                            {isLoggedIn && (
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
                            )}
                            <div
                                className="collapse navbar-collapse offset"
                                id="navbarSupportedContent"
                            >
                                <div className="row w-100">
                                    <div className="col-lg-7 pr-0">
                                        <ul className="nav navbar-nav center_nav pull-right">
                                            {isLoggedIn && (
                                                <React.Fragment>
                                                    <li
                                                        className={
                                                            'nav-item ' +
                                                            (isCategories
                                                                ? 'active'
                                                                : '')
                                                        }
                                                    >
                                                        <a
                                                            className="nav-link"
                                                            href={
                                                                Routes.CATEGORIES
                                                            }
                                                        >
                                                            <FormattedMessage
                                                                id="navigation.shops"
                                                                defaultMessage="Magazine"
                                                            />
                                                        </a>
                                                    </li>

                                                    <li
                                                        className={
                                                            'nav-item ' +
                                                            (isCauses
                                                                ? 'active'
                                                                : '')
                                                        }
                                                    >
                                                        <a
                                                            className="nav-link"
                                                            href={Routes.CAUSES}
                                                        >
                                                            <FormattedMessage
                                                                id="navigation.causes"
                                                                defaultMessage="Cauze"
                                                            />
                                                        </a>
                                                    </li>

                                                    <li
                                                        className={
                                                            'nav-item ' +
                                                            (isWallet
                                                                ? 'active'
                                                                : '')
                                                        }
                                                    >
                                                        <a
                                                            className="nav-link"
                                                            href={Routes.WALLET}
                                                        >
                                                            <FormattedMessage
                                                                id="navigation.wallet"
                                                                defaultMessage="Portofel"
                                                            />
                                                        </a>
                                                    </li>
                                                </React.Fragment>
                                            )}
                                        </ul>
                                    </div>

                                    {isLoggedIn && (
                                        <div className="col-lg-5">
                                            <ul className="nav navbar-nav navbar-right right_nav pull-right">
                                                <hr/>

                                                <li className="nav-item">
                                                    <Link
                                                        to={
                                                            Routes.CATEGORIES +
                                                            '/favShops'
                                                        }
                                                        onClick={
                                                            this
                                                                .loadFavoriteShops
                                                        }
                                                        className={'icons'}
                                                    >
                                                        {this.props.favShopsIconFill ?
                                                            <i
                                                                className="fa fa-heart"
                                                                aria-hidden="true"
                                                            />
                                                            :
                                                            <i
                                                                className="fa fa-heart-o"
                                                                aria-hidden="true"
                                                            />
                                                        }
                                                    </Link>
                                                </li>

                                                <li className="nav-item">
                                                    <a
                                                        href={Routes.USER}
                                                        className="icons"
                                                    >
                                                        <i
                                                            className="fa fa-user"
                                                            aria-hidden="true"
                                                        />
                                                    </a>
                                                </li>

                                                <hr/>
                                            </ul>
                                        </div>
                                    )}
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
        currentLocale: state.locale.langResources.language,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        logout: () => dispatch(doLogoutAction()),
        setShops: (shops: Array<ShopDto>) =>
            dispatch(setShops(shops)),
        setFavShopsIconFill: (favShopIconFill: boolean) =>
            dispatch(setFavShopsIconFill(favShopIconFill)),
        setCurrentCategory: (currentCategory: String) =>
            dispatch(setCurrentCategory(currentCategory)),
        setSelections: (selections: boolean[]) =>
            dispatch(setSelections(selections)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HeaderLayout);
