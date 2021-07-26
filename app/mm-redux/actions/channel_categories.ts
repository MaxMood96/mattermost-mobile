// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Client4} from '@client/rest';
import {ChannelCategoryTypes} from '@mm-redux/action_types';
import {getCategory} from '@mm-redux/selectors/entities/channel_categories';
import {getCurrentUserId} from '@mm-redux/selectors/entities/common';
import {ActionFunc, batchActions, DispatchFunc, GetStateFunc} from '@mm-redux/types/actions';
import {ChannelCategory, OrderedChannelCategories} from '@mm-redux/types/channel_categories';
import {logError} from './errors';
import {forceLogoutIfNecessary} from './helpers';

export function expandCategory(categoryId: string) {
    return setCategoryCollapsed(categoryId, false);
}

export function collapseCategory(categoryId: string) {
    return setCategoryCollapsed(categoryId, true);
}

export function setCategoryCollapsed(categoryId: string, collapsed: boolean) {
    return patchCategory(categoryId, {
        collapsed,
    });
}

export function patchCategory(categoryId: string, patch: Partial<ChannelCategory>): ActionFunc {
    return async (dispatch: DispatchFunc, getState: GetStateFunc) => {
        const state = getState();
        const currentUserId = getCurrentUserId(state);

        const category = getCategory(state, categoryId);
        const patchedCategory = {
            ...category,
            ...patch,
        };

        dispatch({
            type: ChannelCategoryTypes.RECEIVED_CATEGORY,
            data: patchedCategory,
        });

        try {
            await Client4.updateChannelCategory(currentUserId, category.team_id, patchedCategory);
        } catch (error) {
            dispatch({
                type: ChannelCategoryTypes.RECEIVED_CATEGORY,
                data: category,
            });

            forceLogoutIfNecessary(error, dispatch, getState);
            dispatch(logError(error));
            return {error};
        }

        return {data: patchedCategory};
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
