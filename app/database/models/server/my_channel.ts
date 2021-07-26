// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Relation} from '@nozbe/watermelondb';
import {field, immutableRelation} from '@nozbe/watermelondb/decorators';
import Model from '@nozbe/watermelondb/Model';

import {MM_TABLES} from '@constants/database';

import type ChannelModel from '@typings/database/models/servers/channel';

const {CHANNEL, MY_CHANNEL} = MM_TABLES.SERVER;

/**
 * MyChannel is an extension of the Channel model but it lists only the Channels the app's user belongs to
 */
export default class MyChannelModel extends Model {
    /** table (name) : MyChannel */
    static table = MY_CHANNEL;

    /** last_post_at : The timestamp for any last post on this channel */
    @field('last_post_at') lastPostAt!: number;

    /** last_viewed_at : The timestamp showing the user's last viewed post on this channel */
    @field('last_viewed_at') lastViewedAt!: number;

    /** mentions_count : The number of mentions on this channel */
    @field('mentions_count') mentionsCount!: number;

    /** message_count : The derived number of unread messages on this channel */
    @field('message_count') messageCount!: number;

    /** roles : The user's privileges on this channel */
    @field('roles') roles!: string;

    /** channel : The relation pointing to the CHANNEL table */
    @immutableRelation(CHANNEL, 'id') channel!: Relation<ChannelModel>;
}