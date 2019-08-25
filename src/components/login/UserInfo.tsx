import GenericInput from '../input/GenericInput';
import { InputType } from '../../helper/Constants';
import { store } from '../../index';
import { NavigationsAction } from '../../redux/actions/NavigationsAction';
import { Stages } from '../helper/Stages';
import * as React from 'react';

class UserInfo extends React.Component {
  public componentDidMount() {
    store.dispatch(NavigationsAction.setStageAction(Stages.USER));
  }

  public componentWillUnmount() {
    store.dispatch(NavigationsAction.resetStageAction(Stages.USER));
  }

  public render() {
    return (
      <div className="container p_120">
        <div className="row">
          <div className="col-md-12 text-center">
            <h3 className="mb-30 title_color">User info</h3>
            <div className="mt-10">
              <GenericInput
                type={InputType.TEXT}
                id={'name'}
                placeholder={'Name'}
                className={'single-input'}
              />
            </div>
            <div className="mt-10">
              <GenericInput
                type={InputType.TEXT}
                id={'email'}
                placeholder={'Email'}
                className={'single-input'}
              />
            </div>
          </div>
        </div>
        <br />
        <div className="col-md-12 text-center">
          <button type="submit" value="submit" className="btn submit_btn">
            Update
          </button>
        </div>
      </div>
    );
  }
}

export default UserInfo;
