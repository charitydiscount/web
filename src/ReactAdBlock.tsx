import React from 'react';
import AdBlockDetect from 'react-ad-block-detect';
import Modal from 'react-awesome-modal';
import {FormattedMessage} from 'react-intl';
import {emptyHrefLink} from "./helper/Constants";

class ReactAdBlock extends React.Component {

    render() {
        return (
            <AdBlockDetect>
                <Modal visible={true} effect="fadeInUp">
                    <h3 style={{padding: 15}}>
                        <FormattedMessage id={"adblock.message"} defaultMessage="Disable AdBlock or similar programs to continue"/>
                        <a href={emptyHrefLink} onClick={() => window.location.reload()}
                            className="btn submit_btn genric-btn circle">
                            <FormattedMessage id={"adblock.button"} defaultMessage="Reload"/>
                        </a>
                    </h3>
                </Modal>
            </AdBlockDetect>
        );
    }
}

export default ReactAdBlock;