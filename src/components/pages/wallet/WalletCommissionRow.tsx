import * as React from 'react';
import { CmType, CommissionStatus, emptyHrefLink } from '../../../helper/Constants';
import { injectIntl, IntlShape } from 'react-intl';
import { CommissionDto } from '../../../rest/WalletService';
import { dateOptions, roundMoney } from '../../../helper/AppHelper';
import { connect } from 'react-redux';
import { AppState } from '../../../redux/reducer/RootReducer';
import { ShopDto } from '../../../rest/ShopsService';

interface IWalletTransactionRowProps {
    commission: CommissionDto;
    intl: IntlShape;
    shops: ShopDto[];
}

class WalletCommissionRow extends React.Component<IWalletTransactionRowProps> {
    public render() {
        let commissionStatus = CommissionStatus[
            this.props.commission.status
            ];

        let source;
        if (this.props.commission.source && this.props.commission.source.localeCompare(CmType.REFERRAL) === 0) {
            source = <div className="country">{this.props.intl.formatMessage({
                id: 'wallet.commission.source.friend',
            })}</div>;
        } else {
            const isShopActive = !!this.props.shops.find(
                shop => {
                    let result = shop.id.toString().localeCompare(this.props.commission.shopId.toString());
                    if (result === 0) {
                        return true;
                    } else {
                        result = shop.uniqueCode.toString().localeCompare(this.props.commission.shopId.toString())
                    }
                    return result === 0;
                }
            );

            source = commissionStatus !== CommissionStatus.paid && !isShopActive ? (
                <div className="country">
                    <a
                        title={this.props.intl.formatMessage({
                            id: 'wallet.commission.shop.inactive',
                        })}
                        href={emptyHrefLink}
                        style={{
                            color: 'red',
                            textDecoration: 'underline',
                        }}
                    >
                        {this.props.commission.program.name}
                    </a>
                </div>
            ) : (
                <div className="country">
                    <img
                        className="img-min img"
                        style={{
                            maxHeight: 30,
                            maxWidth: 110
                        }}
                        src={this.props.commission.program.logo}
                        alt={this.props.commission.program.name}
                        title={this.props.commission.program.name}
                    />
                </div>
            );
        }

        let cmTitle: any;
        switch (commissionStatus) {
            case CommissionStatus.paid:
                cmTitle = (
                    <i
                        className="fa fa-money"
                        aria-hidden="true"
                        style={{color: 'green'}}
                        title={this.props.intl.formatMessage({
                            id: 'wallet.tx.status.paid',
                        })}
                    />
                );
                break;
            case CommissionStatus.rejected:
                cmTitle = (
                    <i
                        className="fa fa-ban"
                        aria-hidden="true"
                        style={{color: 'red'}}
                        title={this.props.intl.formatMessage({
                            id: 'wallet.tx.status.rejected',
                        })}
                    />
                );
                break;
            default:
                cmTitle = (
                    <i
                        className="fa fa-clock-o"
                        aria-hidden="true"
                        title={this.props.intl.formatMessage({
                            id: 'wallet.tx.status.pending',
                        })}
                    />
                );
                break;
        }

        return (
            <React.Fragment>
                <div className="table-row">
                    <div className="country">
                        {this.props.commission.createdAt
                            .toDate()
                            .toLocaleDateString('ro-RO', dateOptions)}
                    </div>
                    <div className="country">
                        <h3>{cmTitle}</h3>
                    </div>
                    <div className="country">
                        {roundMoney(this.props.commission.amount)}{' '}
                        {this.props.intl.formatMessage({
                            id: this.props.commission.currency,
                        })}
                    </div>
                    {source}
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state: AppState) => {
    return {
        shops: state.shops.allShops,
    };
};

export default connect(mapStateToProps)(injectIntl(WalletCommissionRow));
