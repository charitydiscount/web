import * as React from "react";

const HomeBanner = () => {
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
};
export default HomeBanner;