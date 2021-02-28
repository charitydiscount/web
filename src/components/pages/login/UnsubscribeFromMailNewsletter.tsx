import React from "react";
import { unsubscribeMailNotification } from "../../../rest/UserService";
import FadeLoader from 'react-spinners/FadeLoader';
import { spinnerCss } from "../../../helper/AppHelper";
import { FormattedMessage } from "react-intl";

interface UnsubscribeFromMailNewsletterProps {
    match: any;
}

interface UnsubscribeFromMailNewsletterState {
    loadUnsubscribe: boolean
    unsubscribeSuccess: boolean
}

class UnsubscribeFromMailNewsletter extends React.Component<UnsubscribeFromMailNewsletterProps, UnsubscribeFromMailNewsletterState> {

    constructor(props: UnsubscribeFromMailNewsletterProps) {
        super(props);
        this.state = {
            loadUnsubscribe: true,
            unsubscribeSuccess: false
        }
    }

    async componentDidMount() {
        if (this.props.match.params.userId) {
            try {
                await unsubscribeMailNotification(this.props.match.params.userId);
                this.setState({
                    unsubscribeSuccess: true,
                    loadUnsubscribe: false
                });
            } catch (e) {
                //something went wrong
                this.setState({
                    loadUnsubscribe: false
                });
            }
        } else {
            //no params in the url
            this.setState({
                loadUnsubscribe: false
            });
        }
    }

    public render() {
        return (
            <React.Fragment>
                <FadeLoader
                    loading={this.state.loadUnsubscribe}
                    color={'#e31f29'}
                    css={spinnerCss}
                />
                {!this.state.loadUnsubscribe &&
                    <React.Fragment>
                        <div className="container p_90">
                            <div className="p-2 p-md-4" style={{textAlign:'center'}}>
                                {this.state.unsubscribeSuccess &&
                                <div>
                                    <FormattedMessage
                                        id="unsubscribe.mail.deactivate"
                                        defaultMessage="Ai fost dezabonat"
                                    />
                                </div>
                                }
                                {!this.state.unsubscribeSuccess &&
                                <div>
                                    <FormattedMessage
                                        id="unsubscribe.mail.error"
                                        defaultMessage="Dezabonarea a esuat, te rugam sa incerci din nou sau incearca sa te dezabonezi din cont"
                                    />
                                </div>
                                }
                            </div>
                        </div>
                    </React.Fragment>
                }
            </React.Fragment>
        )
    }
}

export default UnsubscribeFromMailNewsletter;