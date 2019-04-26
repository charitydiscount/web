import * as React from "react";
import {Stages} from "../helper/Stages";
import {connect} from "react-redux";

interface IHomeBannerProps {
    view: string,
}

class HomeBanner extends React.Component<IHomeBannerProps> {

    public render() {
        const isLogin = (this.props.view === Stages.LOGIN);
        const isContact = (this.props.view === Stages.CONTACT);
        const isCategories = (this.props.view === Stages.CATEGORIES);

        if (isCategories) {
            return (
                <section className="banner_area">
                    <div className="banner_inner d-flex align-items-center">
                        <div className="container">
                            <div className="banner_content text-center">
                                <h2>Shop Category Page</h2>
                                <div className="page_link">
                                    <a href="/">Home</a>
                                    <a href="/categories">Categories</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )
        } else if (isContact) {
            return (
                <section className="banner_area">
                    <div className="banner_inner d-flex align-items-center">
                        <div className="container">
                            <div className="banner_content text-center">
                                <h2>Contact Us</h2>
                                <div className="page_link">
                                    <a href="/">Home</a>
                                    <a href="/contact">Contact</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )
        } else if (isLogin) {
            return (
                <section className="banner_area">
                    <div className="banner_inner d-flex align-items-center">
                        <div className="container">
                            <div className="banner_content text-center">
                                <h2>Login/Register</h2>
                                <div className="page_link">
                                    <a href="/">Home</a>
                                    <a href="/login">Login</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )
        } else {
            return (
                <section className="home_banner_area">
                    <div className="overlay"></div>
                    <div className="banner_inner d-flex align-items-center">
                        <div className="container">
                            <div className="banner_content row">
                                <div className="offset-lg-2 col-lg-8">
                                    <h3>Fashion for
                                        <br/>Upcoming Winter</h3>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
                                        incididunt ut labore et dolore magna
                                        aliqua. Ut enim ad minim veniam, quis nostrud exercitation.</p>
                                    <a className="white_bg_btn" href="#">View Collection</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )
        }
    }
}

const mapStateToProps = (state: any) => {
    return {
        view: state.navigation.stageName,
    }
};

export default connect(mapStateToProps)(HomeBanner);
