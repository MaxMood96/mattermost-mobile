// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {MessageDescriptor} from '@formatjs/intl/src/types';
import {IntlShape} from 'react-intl';
import {Alert, AlertButton} from 'react-native';

import {t} from '@utils/i18n';

export function errorBadChannel(intl: IntlShape) {
    const message = {
        id: t('mobile.server_link.unreachable_channel.error'),
        defaultMessage: 'This link belongs to a deleted channel or to a channel to which you do not have access.',
    };

    return alertErrorWithFallback(intl, {}, message);
}

export function alertErrorWithFallback(intl: IntlShape, error: any, fallback: MessageDescriptor, values?: Record<string, string>, buttons?: AlertButton[]) {
    let msg = error?.message;
    if (!msg || msg === 'Network request failed') {
        msg = intl.formatMessage(fallback, values);
    }
    Alert.alert('', msg, buttons);
}