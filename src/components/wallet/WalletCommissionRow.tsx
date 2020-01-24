import * as React from 'react';
import { CommissionStatus, emptyHrefLink } from '../../helper/Constants';
import { getShopById } from '../../rest/ShopsService';
import { injectIntl, IntlShape } from 'react-intl';
import { CommissionDto } from '../../rest/WalletService';
import { dateOptions, roundMoney } from '../../helper/AppHelper';

interface IWalletTransactionRowProps {
    commission: CommissionDto;
    intl: IntlShape;
}

class WalletCommissionRow extends React.Component<IWalletTransactionRowProps> {
    public render() {
        let commissionStatus = CommissionStatus[
            this.props.commission.status
        ].toString();
        const isShopActive = !!getShopById(this.props.commission.shopId);

        let cmTitle: any;
        switch (commissionStatus) {
            case CommissionStatus.paid.toString():
                cmTitle = (
                    <i
                        className="fa fa-money"
                        aria-hidden="true"
                        style={{ color: 'green' }}
                        title={this.props.intl.formatMessage({
                            id: 'wallet.tx.status.paid',
                        })}
                    />
                );
                break;
            case CommissionStatus.rejected.toString():
                cmTitle = (
                    <i
                        className="fa fa-ban"
                        aria-hidden="true"
                        style={{ color: 'red' }}
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
                    {isShopActive ? (
                        <div className="country">
                            <img
                                className="img-min img"
                                height="50px"
                                src={this.props.commission.program.logo}
                                alt={this.props.commission.program.name}
                                title={this.props.commission.program.name}
                            />
                        </div>
                    ) : (
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
                    )}
                </div>
            </React.Fragment>
        );
    }
}

export default injectIntl(WalletCommissionRow);
