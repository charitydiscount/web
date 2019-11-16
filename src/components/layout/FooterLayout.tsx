import * as React from 'react';
import { emptyHrefLink } from '../../helper/Constants';
import { FormattedMessage } from 'react-intl';
import { onLanguageChange } from '../../helper/AppHelper';
import { connect } from 'react-redux';
import Select from 'react-select';
import { Link } from 'react-router-dom';

type IFooterProps = {
    currentLocale: string;
    isLoggedIn: boolean;
};

const options: any[] = [
    { value: 'ro', label: 'RO' },
    { value: 'en', label: 'EN' },
];
const optionFromValue = (value: string) => options.find(o => o.value === value);

class FooterLayout extends React.Component<IFooterProps> {
    render() {
        return (
            <footer className="footer-area p-4 pt-5">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-1  col-md-6 col-sm-6">
                            <div className="single-footer-widget"></div>
                        </div>
                        <div className="col-lg-4 col-md-6 col-sm-6">
                            <div className="single-footer-widget">
                                <h6 className="footer_title">
                                    <FormattedMessage
                                        id="footer.mobile"
                                        defaultMessage="Get it on mobile"
                                    />
                                </h6>
                                <a href="https://play.google.com/store/apps/details?id=com.clover.charity_discount">
                                    <img
                                        src={'img/mobile/google-play-badge.svg'}
                                        height={40}
                                        width={135}
                                        alt={''}
                                    />
                                </a>{' '}
                                <img
                                    src={'img/mobile/app-store-badge.svg'}
                                    height={40}
                                    width={135}
                                    alt={''}
                                />
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-6">
                            <div className="single-footer-widget f_social_wd">
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
                                    <a href={emptyHrefLink}>
                                        <i className="fa fa-instagram"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-6">
                            <div className="single-footer-widget f_social_wd">
                                <h6 className="footer_title">
                                    {!this.props.isLoggedIn && (
                                        <FormattedMessage
                                            id="footer.translation"
                                            defaultMessage="Translation"
                                        />
                                    )}
                                </h6>
                                {!this.props.isLoggedIn && (
                                    <Select
                                        name="form-field-name"
                                        value={optionFromValue(
                                            this.props.currentLocale
                                        )}
                                        defaultValue="ro"
                                        onChange={onLanguageChange}
                                        isSearchable={false}
                                        options={options}
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="pt-5 d-flex container">
                        <ul className="row footer-text text-center d-flex list-inline col-12">
                            <li className="col-12 col-md-3 footer-text mt-2">
                                &copy; CharityDiscount
                            </li>
                            <li className="col-12 col-md-3 mt-2">
                                <Link to="/privacy" className="ml-1">
                                    <FormattedMessage
                                        id="userinfo.privacy.button"
                                        defaultMessage="Privacy"
                                    />
                                </Link>
                            </li>
                            <li className="col-12 col-md-3 mt-2">
                                <Link to="/tos" className="ml-1">
                                    <FormattedMessage
                                        id="userinfo.terms.button"
                                        defaultMessage="Terms and Conditions"
                                    />
                                </Link>
                            </li>
                            <li className="col-12 col-md-3 mt-2">
                                <a href="/faq">FAQ</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </footer>
        );
    }
}

const mapStateToProps = (state: any) => {
    return {
        currentLocale: state.locale.langResources.language,
        isLoggedIn: state.user.isLoggedIn,
    };
};

export default connect(mapStateToProps)(FooterLayout);
