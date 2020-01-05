import * as React from 'react';
import {emptyHrefLink, StorageKey} from '../../helper/Constants';
import {FormattedMessage} from 'react-intl';
import {Link} from 'react-router-dom';
import {appVersion} from '../../index';
import {getLocalStorage, removeLocalStorage} from "../../helper/StorageHelper";


class FooterLayout extends React.Component {

    render() {
        let lang = getLocalStorage(StorageKey.LANG);
        let startPageLocation = "/landing-en.html";
        if (lang === 'ro') {
            startPageLocation = "/landing-ro.html";
        }

        return (
            <footer className="footer-area">
                <hr w-100="true"></hr>
                <div className="container">
                    <div className="row d-flex justify-content-between">
                        <div className="col-md-4 col-6 single-footer-widget">
                            <h6 className="footer_title">
                                <FormattedMessage
                                    id="footer.info"
                                    defaultMessage="Info"
                                />
                            </h6>
                            <ul className="flex-column footer-text">
                                <li className="d-flex">
                                    <a href={startPageLocation} onClick={() => {
                                        removeLocalStorage(StorageKey.USER)
                                    }}>
                                        <FormattedMessage
                                            id="userinfo.about.label"
                                            defaultMessage="About"
                                        />
                                    </a>
                                </li>
                                <li className="d-flex">
                                    <Link to="/privacy">
                                        <FormattedMessage
                                            id="userinfo.privacy.button"
                                            defaultMessage="Privacy"
                                        />
                                    </Link>
                                </li>
                                <li className="d-flex">
                                    <Link to="/tos">
                                        <FormattedMessage
                                            id="userinfo.terms.button"
                                            defaultMessage="Terms and Conditions"
                                        />
                                    </Link>
                                </li>
                                <li className="d-flex">
                                    <Link to="/faq">
                                        <FormattedMessage
                                            id="userinfo.faq.button"
                                            defaultMessage="FAQ"
                                        />
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div
                            className="d-flex flex-column flex-md-row col-6 col-md-8 mx-0 px-0 justify-content-start justify-content-md-between">
                            <div className="w-100 col-md-6 single-footer-widget">
                                <div className="f_social_wd">
                                    <h6 className="footer_title">
                                        <FormattedMessage
                                            id="footer.follow"
                                            defaultMessage="Follow us"
                                        />
                                    </h6>
                                    <div className="f_social">
                                        <a href={emptyHrefLink}>
                                            <i className="fa fa-facebook"></i>
                                        </a>
                                        <a href="https://www.instagram.com/charitydiscount/" target="_blank"
                                           rel="noopener noreferrer">
                                            <i className="fa fa-instagram"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="w-100 col-md-6 single-footer-widget">
                                <div className="single-footer-widget">
                                    <h6 className="footer_title">
                                        <FormattedMessage
                                            id="footer.mobile"
                                            defaultMessage="Get it on mobile"
                                        />
                                    </h6>
                                    <a href="https://play.google.com/store/apps/details?id=com.clover.charity_discount"
                                       target="_blank" rel="noopener noreferrer">
                                        <img
                                            src={
                                                '/img/mobile/google-play-badge.svg'
                                            }
                                            height={40}
                                            width={135}
                                            alt={''}
                                        />
                                    </a>
                                    <a href="https://apps.apple.com/us/app/charitydiscount/id1492115913?ls=1"
                                       target="_blank" rel="noopener noreferrer">
                                        <img
                                            src={'/img/mobile/app-store-badge.svg'}
                                            height={40}
                                            width={135}
                                            alt={''}
                                        />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row my-3 justify-content-center copyright-text">
                        <span>&copy; CharityDiscount {appVersion}</span>
                    </div>
                </div>
            </footer>
        );
    }
}


export default FooterLayout;
