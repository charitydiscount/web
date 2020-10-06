import * as React from "react";
import {FormattedMessage} from 'react-intl';
import {connect} from "react-redux";
import FaqRO from "./FaqRO";
import FaqEN from "./FaqEN";

interface IFaqProps {
    currentLocale?: string
}

class Faq extends React.Component<IFaqProps> {

    render() {
        return (
            <React.Fragment>
                <div className="container p_90">
                    <div className="p-2 p-md-4">
                        <h3 className="mb-30 title_color">
                            <FormattedMessage
                                id="faq.title"
                                defaultMessage="FAQ"
                            />
                        </h3>
                        <div className="mt-sm-20 left-align-p">
                            {this.props.currentLocale === "ro" ?
                                <FaqRO/> :
                                <FaqEN/>
                            }
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }

}


const
    mapStateToProps = (state: any) => {
        return {
            currentLocale: state.locale.langResources.language
        }
    };

export default connect(mapStateToProps)(Faq);