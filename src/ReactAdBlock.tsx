import React, { CSSProperties } from 'react';
import Modal from 'react-awesome-modal';
import { FormattedMessage } from 'react-intl';
import { emptyHrefLink } from './helper/Constants';
import { connect } from "react-redux";
import { setAdBlockActive } from "./redux/actions/AdBlockActions";


interface ReactAdBlockProps {
    setAdBlock: any
}

class ReactAdBlock extends React.Component<ReactAdBlockProps> {

    state = {
        usingAdblock: false,
    };
    fakeAdBanner: HTMLDivElement | null = null;

    componentDidMount() {
        let adBlockActive = this.fakeAdBanner?.offsetHeight === 0;
        this.setState({
            usingAdblock: adBlockActive
        });
        if (adBlockActive) {
            this.props.setAdBlock(true);
        }
    }

    render() {
        if (this.state.usingAdblock === true) {
            return (
                <Modal visible={true} effect="fadeInUp">
                    <div style={{padding: 15, maxWidth: 600}}>
                        <h4>
                            <FormattedMessage
                                id={'adblock.message'}
                                defaultMessage="Disable AdBlock or similar programs to continue"
                            />
                        </h4>
                        <a
                            href={emptyHrefLink}
                            onClick={() => window.location.reload()}
                            className="btn submit_btn genric-btn circle"
                        >
                            <FormattedMessage
                                id={'adblock.button'}
                                defaultMessage="Reload"
                            />
                        </a>
                    </div>
                </Modal>
            );
        }

        const style: CSSProperties = {
            height: '1px',
            width: '1px',
            visibility: 'hidden',
            pointerEvents: 'none',
        };

        return (
            <div
                ref={r => (this.fakeAdBanner = r)}
                style={style}
                className="adBanner"
            />
        );
    }
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        setAdBlock: (isActive: boolean) =>
            dispatch(setAdBlockActive(isActive)),
    };
};

export default connect(null, mapDispatchToProps)(ReactAdBlock);
