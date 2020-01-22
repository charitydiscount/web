import * as React from 'react';
import { CauseDto } from '../../rest/CauseService';
import { Routes } from '../helper/Routes';
import { Redirect } from 'react-router';
import { emptyHrefLink } from '../../helper/Constants';
import { FormattedMessage } from 'react-intl';

interface ICauseState {
    redirect: boolean;
}

interface ICauseProps {
    cause: CauseDto;
}

class Cause extends React.Component<ICauseProps, ICauseState> {
    constructor(props: Readonly<ICauseProps>) {
        super(props);
        this.state = {
            redirect: false,
        };
    }

    setRedirect = () => {
        this.setState({
            redirect: true,
        });
    };

    renderRedirect = () => {
        if (this.state.redirect) {
            return (
                <Redirect
                    to={Routes.WALLET + '/donate/' + this.props.cause.id}
                />
            );
        }
    };

    public render() {
        return (
            <React.Fragment>
                {this.renderRedirect()}
                <div className="col-lg-6">
                    <h2>{this.props.cause.details.title}</h2>
                    {this.props.cause.details.funds && (
                        <h4>
                            <FormattedMessage
                                id="cause.donated"
                                defaultMessage="Donated: "
                            />
                            {this.props.cause.details.funds} RON
                        </h4>
                    )}
                    <a
                        className="hot_deal_link"
                        target="_blank"
                        rel="noopener noreferrer"
                        href={this.props.cause.details.site}
                    >
                        <div className="hot_deal_box">
                            <img
                                src={this.props.cause.details.images[0].url}
                                alt=""
                                className="img-fluid"
                            />
                            <div className="content">
                                <a
                                    style={{ color: '#fff' }}
                                    href={this.props.cause.details.site}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Website
                                </a>
                            </div>
                        </div>
                    </a>
                    <br />
                    <a
                        href={emptyHrefLink}
                        className="btn submit_btn genric-btn circle"
                        onClick={this.setRedirect}
                    >
                        <FormattedMessage
                            id="cause.contribute.button"
                            defaultMessage="Contribute"
                        />
                    </a>
                </div>
            </React.Fragment>
        );
    }
}

export default Cause;
