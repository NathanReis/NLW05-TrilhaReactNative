import React from "react";
import {
    StyleSheet,
    Text
} from "react-native";
import {
    RectButton,
    RectButtonProps
} from "react-native-gesture-handler";
import colors from "../styles/colors";
import fonts from "../styles/fonts";

interface IEnvironmentButtonProps extends RectButtonProps {
    active?: boolean;
    title: string;
}

export function EnvironmentButton({
    active = false,
    title,
    ...rest
}: IEnvironmentButtonProps) {
    return (
        <RectButton
            style={[
                styles.container,
                active && styles.containerActive
            ]}
            {...rest}
        >
            <Text
                style={[
                    styles.title,
                    active && styles.titleActive
                ]}
            >
                {title}
            </Text>
        </RectButton>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.shape,
        height: 40,
        width: 76,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 12,
        marginHorizontal: 5
    },
    containerActive: {
        backgroundColor: colors.green_light
    },
    title: {
        color: colors.heading,
        fontFamily: fonts.text
    },
    titleActive: {
        color: colors.green_dark,
        fontFamily: fonts.heading
    }
});
