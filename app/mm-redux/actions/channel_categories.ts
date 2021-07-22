// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Client4} from '@client/rest';
import {ChannelCategoryTypes} from '@mm-redux/action_types';
import {getCurrentUserId} from '@mm-redux/selectors/entities/common';
import {batchActions, DispatchFunc, GetStateFunc} from '@mm-redux/types/actions';
import {OrderedChannelCategories} from '@mm-redux/types/channel_categories';
import {logError} from './errors';
import {forceLogoutIfNecessary} from './helpers';

export function expandCategory(categoryId: string) {
    return {
        type: ChannelCategoryTypes.CATEGORY_EXPANDED,
        data: categoryId,
    };
}

export function collapseCategory(categoryId: string) {
    return {
        type: ChannelCategoryTypes.CATEGORY_COLLAPSED,
        data: categoryId,
    };
}

export function receivedCategoryOrder(teamId: string, order: string[]) {
    return {
        type: ChannelCategoryTypes.RECEIVED_CATEGORY_ORDER,
        data: {
            teamId,
            order,
        },
    };
}

export function fetchMyCategories(teamId: string) {
    return async (dispatch: DispatchFunc, getState: GetStateFunc) => {
        const currentUserId = getCurrentUserId(getState());

        let data: OrderedChannelCategories;
        try {
            data = await Client4.getChannelCategories(currentUserId, teamId);
        } catch (error) {
            forceLogoutIfNecessary(error, dispatch, getState);
            dispatch(logError(error));
            return {error};
        }

        return dispatch(batchActions([
            {
                type: ChannelCategoryTypes.RECEIVED_CATEGORIES,
                data: data.categories,
            },
            {
                type: ChannelCategoryTypes.RECEIVED_CATEGORY_ORDER,
                data: {
                    teamId,
                    order: data.order,
                },
            },
        ]));
    };
}
