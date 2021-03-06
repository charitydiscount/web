import React, { CSSProperties } from 'react';
import { connect } from "react-redux";
import { setAdBlockActive } from "./redux/actions/AdBlockActions";
import InfoModal from "./components/modals/InfoModal";
import { intl } from "./helper/IntlGlobal";

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
                <InfoModal visible={true}
                           message={intl.formatMessage({
                               id: 'adblock.message',
                           })}
                           onClose={() => window.location.reload()}
                           maxWidth={600}/>
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
