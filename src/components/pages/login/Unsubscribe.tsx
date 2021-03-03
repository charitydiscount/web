import React, { useEffect, useState } from "react";
import { unsubscribeMailNotification } from "../../../rest/UserService";
import FadeLoader from 'react-spinners/FadeLoader';
import { spinnerCss } from "../../../helper/AppHelper";
import { FormattedMessage } from "react-intl";

const Unsubscribe = (props: { match: any }) => {

    const [loadUnsubscribe, setLoadUnsubscribe] = useState<boolean>(true)
    const [unsubscribeSuccess, setUnsubscribeSuccess] = useState<boolean>(false)

    useEffect(() => {
        const executeAction = async () => {
            return unsubscribeMailNotification(props.match.params.userId)
                .then(() => {
                        setLoadUnsubscribe(false);
                        setUnsubscribeSuccess(true)
                    }
                )
                .catch(() => {
                    setLoadUnsubscribe(false)
                })
        };
        if (props.match.params.userId) {
            executeAction();
        } else {
            setLoadUnsubscribe(false)
        }
    }, [props.match.params.userId]);



    return (
        <React.Fragment>
            <FadeLoader
                loading={loadUnsubscribe}
                color={'#e31f29'}
                css={spinnerCss}
            />
            {!loadUnsubscribe &&
            <React.Fragment>
                <div className="container p_90">
                    <div className="p-2 p-md-4" style={{textAlign: 'center'}}>
                        {unsubscribeSuccess &&
                        <div>
                            <FormattedMessage
                                id="unsubscribe.mail.deactivate"
                                defaultMessage="Ai fost dezabonat"
                            />
                        </div>
                        }
                        {!unsubscribeSuccess &&
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

export default Unsubscribe;