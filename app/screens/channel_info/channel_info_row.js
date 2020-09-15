// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import PropTypes from 'prop-types';
import {
    Image,
    Switch,
    Text,
    TouchableHighlight,
    View,
} from 'react-native';

import CompassIcon from '@components/compass_icon';
import FormattedText from '@components/formatted_text';
import {paddingHorizontal as padding} from '@components/safe_area_view/iphone_x_spacing';
import {changeOpacity, makeStyleSheetFromTheme} from '@utils/theme';

function createTouchableComponent(children, action) {
    return (
        <TouchableHighlight onPress={action}>
            {children}
        </TouchableHighlight>
    );
}

function channelInfoRow(props) {
    const {action, defaultMessage, detail, icon, iconColor, image, imageTintColor, rightArrow, textColor, textId, togglable, theme, shouldRender, isLandscape} = props;

    if (!shouldRender) {
        return null;
    }

    const style = getStyleSheet(theme);

    let iconElement = null;
    if (image == null) {
        iconElement = (
            <CompassIcon
                name={icon}
                size={24}
                color={iconColor || changeOpacity(theme.centerChannelColor, 0.5)}
            />
        );
    } else {
        iconElement = (
            <Image
                source={image}
                style={{width: 15, height: 15, tintColor: imageTintColor || changeOpacity(theme.centerChannelColor, 0.5)}}
            />
        );
    }

    let actionElement = null;
    if (togglable) {
        actionElement = (
            <Switch
                onValueChange={action}
                value={detail}
            />
        );
    } else if (rightArrow) {
        actionElement = (
            <CompassIcon
                name='chevron-right'
                size={24}
                style={style.rightIcon}
            />
        );
    }

    const RowComponent = (
        <View style={[style.container, padding(isLandscape)]}>
            {iconElement}
            <FormattedText
                style={[style.label, {color: textColor || theme.centerChannelColor}]}
                id={textId}
                defaultMessage={defaultMessage}
            />
            <Text style={style.detail}>{detail}</Text>
            {actionElement}
        </View>
    );

    if (togglable) {
        return RowComponent;
    }

    return createTouchableComponent(RowComponent, action);
}

channelInfoRow.propTypes = {
    action: PropTypes.func.isRequired,
    defaultMessage: PropTypes.string.isRequired,
    detail: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.bool,
    ]),
    icon: PropTypes.string,
    iconColor: PropTypes.string,
    image: PropTypes.number,
    imageTintColor: PropTypes.string,
    isLandscape: PropTypes.bool,
    rightArrow: PropTypes.bool,
    textId: PropTypes.string.isRequired,
    togglable: PropTypes.bool,
    textColor: PropTypes.string,
    theme: PropTypes.object.isRequired,
};

channelInfoRow.defaultProps = {
    rightArrow: true,
    togglable: false,
    shouldRender: true,
};

const getStyleSheet = makeStyleSheetFromTheme((theme) => {
    return {
        container: {
            backgroundColor: theme.centerChannelBg,
            paddingHorizontal: 15,
            flexDirection: 'row',
            alignItems: 'center',
        },
        detail: {
            marginHorizontal: 15,
            color: changeOpacity(theme.centerChannelColor, 0.5),
            fontSize: 15,
        },
        label: {
            flex: 1,
            marginLeft: 15,
            fontSize: 15,
            paddingVertical: 15,
        },
        rightIcon: {
            color: changeOpacity(theme.centerChannelColor, 0.5),
        },
    };
});

export default channelInfoRow;
