// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {memo} from 'react';
import {useIntl} from 'react-intl';
import {Keyboard, StyleSheet, Text, TextStyle, View} from 'react-native';

import FormattedText from '@components/formatted_text';
import {useTheme} from '@context/theme';
import TouchableWithFeedback from '@components/touchable_with_feedback';
import {goToScreen} from '@screens/navigation';
import {getDisplayNameForLanguage} from '@utils/markdown';
import {preventDoubleTap} from '@utils/tap';
import {changeOpacity, makeStyleSheetFromTheme} from '@utils/theme';

const MAX_LINES = 4;

type MarkdownCodeBlockProps = {
    language: string;
    content: string;
    textStyle: TextStyle;
};

const MarkdownCodeBlock = ({language = '', content, textStyle}: MarkdownCodeBlockProps) => {
    const intl = useIntl();
    const theme = useTheme();
    const style = getStyleSheet(theme);

    const handlePress = preventDoubleTap(() => {
        const screen = 'Code';
        const passProps = {
            content,
        };

        const languageDisplayName = getDisplayNameForLanguage(language);
        let title: string;
        if (languageDisplayName) {
            title = intl.formatMessage(
                {
                    id: 'mobile.routes.code',
                    defaultMessage: '{language} Code',
                },
                {
                    language: languageDisplayName,
                },
            );
        } else {
            title = intl.formatMessage({
                id: 'mobile.routes.code.noLanguage',
                defaultMessage: 'Code',
            });
        }

        Keyboard.dismiss();
        requestAnimationFrame(() => {
            goToScreen(screen, title, passProps);
        });
    });

    const handleLongPress = async () => {
        //todo: to add a replacement for BottomSheet - it might be SlideUpPanel
    };

    const trimContent = (text: string) => {
        const lines = text.split('\n');
        const numberOfLines = lines.length;

        if (numberOfLines > MAX_LINES) {
            return {
                content: lines.slice(0, MAX_LINES).join('\n'),
                numberOfLines,
            };
        }

        return {
            content: text,
            numberOfLines,
        };
    };

    const renderLanguageBlock = () => {
        if (language) {
            const languageDisplayName = getDisplayNameForLanguage(language);

            if (languageDisplayName) {
                return (
                    <View style={style.language}>
                        <Text style={style.languageText}>
                            {languageDisplayName}
                        </Text>
                    </View>
                );
            }
        }
        return null;
    };

    const {content: codeContent, numberOfLines} = trimContent(content);

    const getLineNumbers = () => {
        let lineNumbers = '1';
        for (let i = 1; i < Math.min(numberOfLines, MAX_LINES); i++) {
            const line = (i + 1).toString();
            lineNumbers += '\n' + line;
        }
        return lineNumbers;
    };

    const renderPlusMoreLines = () => {
        if (numberOfLines > MAX_LINES) {
            return (
                <FormattedText
                    style={style.plusMoreLinesText}
                    id='mobile.markdown.code.plusMoreLines'
                    defaultMessage='+{count, number} more {count, plural, one {line} other {lines}}'
                    values={{
                        count: numberOfLines - MAX_LINES,
                    }}
                />
            );
        }
        return null;
    };

    return (
        <TouchableWithFeedback
            onPress={handlePress}
            onLongPress={handleLongPress}
            type={'opacity'}
        >
            <View style={style.container}>
                <View style={style.lineNumbers}>
                    <Text style={style.lineNumbersText}>{getLineNumbers()}</Text>
                </View>
                <View style={style.rightColumn}>
                    <View style={style.code}>
                        <Text style={[style.codeText, textStyle]}>
                            {codeContent}
                        </Text>
                    </View>
                    {renderPlusMoreLines()}
                </View>
                {renderLanguageBlock()}
            </View>
        </TouchableWithFeedback>
    );
};

const getStyleSheet = makeStyleSheetFromTheme((theme) => {
    return {
        container: {
            borderColor: changeOpacity(theme.centerChannelColor, 0.15),
            borderRadius: 3,
            borderWidth: StyleSheet.hairlineWidth,
            flexDirection: 'row',
        },
        lineNumbers: {
            alignItems: 'center',
            backgroundColor: changeOpacity(theme.centerChannelColor, 0.05),
            borderRightColor: changeOpacity(theme.centerChannelColor, 0.15),
            borderRightWidth: StyleSheet.hairlineWidth,
            flexDirection: 'column',
            justifyContent: 'flex-start',
            paddingVertical: 4,
            width: 21,
        },
        lineNumbersText: {
            color: changeOpacity(theme.centerChannelColor, 0.5),
            fontSize: 12,
            lineHeight: 18,
        },
        rightColumn: {
            flexDirection: 'column',
            flex: 1,
            paddingHorizontal: 6,
            paddingVertical: 4,
        },
        code: {
            flexDirection: 'row',
            overflow: 'scroll', // Doesn't actually cause a scrollbar, but stops text from wrapping
        },
        codeText: {
            color: changeOpacity(theme.centerChannelColor, 0.65),
            fontSize: 12,
            lineHeight: 18,
        },
        plusMoreLinesText: {
            color: changeOpacity(theme.centerChannelColor, 0.4),
            fontSize: 11,
            marginTop: 2,
        },
        language: {
            alignItems: 'center',
            backgroundColor: theme.sidebarHeaderBg,
            justifyContent: 'center',
            opacity: 0.8,
            padding: 6,
            position: 'absolute',
            right: 0,
            top: 0,
        },
        languageText: {
            color: theme.sidebarHeaderTextColor,
            fontSize: 12,
        },
    };
});

export default memo(MarkdownCodeBlock);