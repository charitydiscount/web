import * as React from "react";
import {Stages} from "../helper/Stages";
import {connect} from "react-redux";

interface IHeaderLayoutProps {
    isLoggedIn: boolean,
    view: string,
}

class HeaderLayout extends React.Component<IHeaderLayoutProps> {

    render() {
        const isCategories = (this.props.view === Stages.CATEGORIES);
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
                                <li>
                                    <a href="/">
                                        Logout
                                    </a>
                                </li>
                                }
                                {isLoggedIn
                                &&
                                <li>
                                    <a href="/contact">
                                        Contact Us
                                    </a>
                                </li>
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
                                            <li className={"nav-item " + (isCategories ? "active" : "")}>
                                                <a className="nav-link" href="/categories">Categories</a>
                                            </li>
                                            }
                                            {isLoggedIn
                                            &&
                                            < li className={"nav-item " + (isContact ? "active" : "")}>
                                                <a className="nav-link" href="/contact">Contact</a>
                                            </li>
                                            }
                                        </ul>
                                    </div>

                                    {isLoggedIn
                                    &&
                                    <div className="col-lg-5">
                                        <ul className="nav navbar-nav navbar-right right_nav pull-right">
                                            <hr/>

                                            <li className="nav-item">
                                                <a href="/" className="icons">
                                                    <i className="fa fa-user" aria-hidden="true"></i>
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

const mapStateToProps = (state: any) => {
    return {
        view: state.navigation.stageName,
        isLoggedIn: state.user.isLoggedIn
    }
};

export default connect(mapStateToProps)(HeaderLayout);