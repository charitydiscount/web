import { createAction } from '../helper/ActionHelper';
import { UserActionTypes } from './Actions';
import { ActionTypesUnion } from '../helper/TypesHelper';
import { UserDto } from '../../rest/UserService';

export const UserActions = {
    setUser: (user: UserDto) => createAction(UserActionTypes.SET_USER, user),
};

export function setUser(user: UserDto): any {
    return (dispatch: any) => {
        dispatch(UserActions.setUser(user));
    };
}

export type UserActions = ActionTypesUnion<typeof UserActions>;
