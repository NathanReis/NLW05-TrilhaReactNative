import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/core";
import React, { useState } from "react";
import {
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View
} from "react-native";
import { Button } from "../components/Button";
import colors from "../styles/colors";
import fonts from "../styles/fonts";

export function UserIdentification() {
    const navigation = useNavigation();

    const [isFocused, setIsFocused] = useState(false);
    const [isFilled, setIsFilled] = useState(false);
    const [name, setName] = useState<string>();

    function handleInputBlur(): void {
        setIsFocused(false);
        setIsFilled(!!name);
    }

    function handleInputFocus(): void {
        setIsFocused(true);
    }

    function handleInputChange(value: string): void {
        setIsFilled(!!value);
        setName(value);
    }

    async function handleSubmit(): Promise<void> {
        if (!name) {
            return Alert.alert("Me diga como chamar você 😢");
        }

        try {
            await AsyncStorage.setItem("@plantmanager:user", name);

            navigation.navigate("Confirmation", {
                title: "Prontinho",
                subtitle: "Agora vamos começar a cuidar das suas platinhas com muito cuidado.",
                buttonTitle: "Começar",
                icon: "smile",
                nextScreen: "PlantSelect"
            });
        } catch {
            Alert.alert("Não foi possível salvar o seu nome 😢");
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.content}>
                        <View style={styles.form}>
                            <View style={styles.header}>
                                <Text style={styles.emoji}>
                                    {isFilled ? "😄" : "😀"}
                                </Text>

                                <Text style={styles.title}>
                                    Como podemos {"\n"}
                                    chamar você?
                                </Text>
                            </View>

                            <TextInput
                                style={[
                                    styles.input,
                                    (isFocused || isFilled) && {
                                        borderColor: colors.green
                                    }
                                ]}
                                placeholder="Digite seu nome"
                                onBlur={handleInputBlur}
                                onFocus={handleInputFocus}
                                onChangeText={handleInputChange}
                            />

                            <View style={styles.footer}>
                                <Button
                                    title="Confirmar"
                                    onPress={handleSubmit}
                                />
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        width: "100%"
    },
    content: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-around",
        width: "100%"
    },
    form: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 54,
        alignItems: "center",
        width: "100%"
    },
    header: {
        alignItems: "center"
    },
    emoji: {
        fontSize: 44
    },
    title: {
        fontSize: 24,
        lineHeight: 32,
        textAlign: "center",
        color: colors.heading,
        fontFamily: fonts.heading,
        marginTop: 20
    },
    input: {
        borderBottomWidth: 1,
        borderColor: colors.gray,
        color: colors.heading,
        width: "100%",
        fontSize: 18,
        marginTop: 50,
        padding: 10,
        textAlign: "center"
    },
    footer: {
        marginTop: 40,
        width: "100%",
        paddingHorizontal: 20
    }
});
