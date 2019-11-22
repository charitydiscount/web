import React from 'react';
import AdBlockDetect from 'react-ad-block-detect';
import Modal from 'react-awesome-modal';
import {FormattedMessage} from 'react-intl';

class ReactAdBlock extends React.Component {

    render() {
        return (
            <AdBlockDetect>
                <Modal visible={true} effect="fadeInUp">
                    <h3 style={{padding: 15}}>
                        <FormattedMessage id={"adblock.message"} defaultMessage="Disable AdBlock or similar programs to continue"/>
                    </h3>
                </Modal>
            </AdBlockDetect>
        );
    }
}

export default ReactAdBlock;