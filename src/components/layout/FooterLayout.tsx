import * as React from 'react';
import { emptyHrefLink } from '../../helper/Constants';
import { InjectedIntlProps, injectIntl, FormattedMessage } from 'react-intl';
import { onLanguageChange } from '../../helper/AppHelper';
import { connect } from 'react-redux';
import Select from 'react-select';
import { Link } from 'react-router-dom';

interface IFooterProps {
    currentLocale?: string;
}

class FooterLayout extends React.Component<IFooterProps & InjectedIntlProps> {
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
                                    <FormattedMessage
                                        id="footer.translation"
                                        defaultMessage="Translation"
                                    />
                                </h6>
                                <Select
                                    name="form-field-name"
                                    value={this.props.currentLocale}
                                    onChange={onLanguageChange}
                                    isSearchable={false}
                                    placeholder={this.props.intl.formatMessage({
                                        id:
                                            'userInfo.select.language.placeholder',
                                    })}
                                    options={[
                                        { value: 'ro', label: 'RO' },
                                        { value: 'en', label: 'EN' },
                                    ]}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="row footer-bottom d-flex">
                        <ul className="container col-lg-12 footer-text text-center d-flex list-inline">
                            <li className="col-lg-3 footer-text">
                                &copy;{' '}
                                <a href={emptyHrefLink}>CharityDiscount</a>
                            </li>
                            <li className="col-lg-3">
                                <Link to="/privacy" className="ml-1">
                                    <FormattedMessage
                                        id="userinfo.privacy.button"
                                        defaultMessage="Privacy"
                                    />
                                </Link>
                            </li>
                            <li className="col-lg-3">
                                <Link to="/tos" className="ml-1">
                                    <FormattedMessage
                                        id="userinfo.terms.button"
                                        defaultMessage="Terms and Conditions"
                                    />
                                </Link>
                            </li>
                            <li className="col-lg-3">
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
    };
};

export default connect(mapStateToProps)(injectIntl(FooterLayout));
