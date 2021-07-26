// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {memo, ReactElement, ReactNode} from 'react';
import {View} from 'react-native';

import {useTheme} from '@context/theme';
import {changeOpacity, makeStyleSheetFromTheme} from '@utils/theme';

type MarkdownTableRowProps = {
    isFirstRow: boolean;
    isLastRow: boolean;
    children: ReactNode;
}

const MarkdownTableRow = ({isFirstRow, isLastRow, children}: MarkdownTableRowProps) => {
    const theme = useTheme();
    const style = getStyleSheet(theme);

    const rowStyle = [style.row];
    if (!isLastRow) {
        rowStyle.push(style.rowBottomBorder);
    }

    if (isFirstRow) {
        rowStyle.push(style.rowTopBackground);
    }

    // Add an extra prop to the last cell so that it knows not to render a right border since the container
    // will handle that
    const renderChildren = React.Children.toArray(children) as ReactElement[];
    renderChildren[renderChildren.length - 1] = React.cloneElement(renderChildren[renderChildren.length - 1], {
        isLastCell: true,
    });

    return <View style={rowStyle}>{renderChildren}</View>;
};

const getStyleSheet = makeStyleSheetFromTheme((theme) => {
    return {
        row: {
            flex: 1,
            flexDirection: 'row',
        },
        rowTopBackground: {
            backgroundColor: changeOpacity(theme.centerChannelColor, 0.1),
        },
        rowBottomBorder: {
            borderColor: changeOpacity(theme.centerChannelColor, 0.2),
            borderBottomWidth: 1,
        },
    };
});

export default memo(MarkdownTableRow);
