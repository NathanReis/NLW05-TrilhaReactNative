import DateTimePicker, { Event } from "@react-native-community/datetimepicker";
import {
    useNavigation,
    useRoute
} from "@react-navigation/core";
import {
    format,
    isBefore
} from "date-fns";
import React, { useState } from "react";
import {
    Alert,
    Image,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SvgFromUri } from "react-native-svg";
import waterdropImg from "../assets/waterdrop.png";
import { Button } from "../components/Button";
import {
    IPlantProps,
    loadPlants,
    savePlant
} from "../libs/storage";
import colors from "../styles/colors";
import fonts from "../styles/fonts";

interface IPageParams {
    plant: IPlantProps;
}

export function PlantSave() {
    const navigation = useNavigation();
    const route = useRoute();
    const { plant } = route.params as IPageParams;

    const [selectedDateTime, setSelectedDateTime] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(Platform.OS === "ios");

    function handleChangeTime(
        event: Event,
        dateTime: Date | undefined
    ): void {
        if (Platform.OS === "android") {
            setShowDatePicker(oldValue => !oldValue);
        }

        if (dateTime) {
            if (isBefore(dateTime, new Date())) {
                setSelectedDateTime(new Date());

                return Alert.alert("Escolha uma hora do futuro ⏰");
            }

            setSelectedDateTime(dateTime);
        }
    }

    function handleOpenDateTimePickerForAndroid(): void {
        setShowDatePicker(oldValue => !oldValue);
    }

    async function handleSave(): Promise<void> {
        try {
            await savePlant({
                ...plant,
                dateTimeNotification: selectedDateTime
            });

            navigation.navigate("Confirmation", {
                title: "Tudo certo",
                subtitle: "Fique tranquilo que sempre vamos lembrar você de cuidar da sua plantinha com muito cuidado.",
                buttonTitle: "Muito obrigado :D",
                icon: "hug",
                nextScreen: "MyPlants"
            });
        } catch {
            Alert.alert("Não foi possível salvar 😢");
        }
    }

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
            <SafeAreaView style={styles.container}>
                <View style={styles.plantInfo}>
                    <SvgFromUri
                        uri={plant.photo}
                        height={150}
                        width={150}
                    />

                    <Text style={styles.plantName}>
                        {plant.name}
                    </Text>

                    <Text style={styles.plantAbout}>
                        {plant.about}
                    </Text>
                </View>

                <View style={styles.controllers}>
                    <View style={styles.tipContainer}>
                        <Image
                            source={waterdropImg}
                            style={styles.tipImage}
                        />

                        <Text style={styles.tipText}>
                            {plant.water_tips}
                        </Text>
                    </View>

                    <Text style={styles.alertLabel}>
                        Escolha o melhor horário para ser lembrado:
                    </Text>

                    {
                        showDatePicker &&
                        <DateTimePicker
                            value={selectedDateTime}
                            mode="time"
                            display="spinner"
                            onChange={handleChangeTime}
                        />
                    }

                    {
                        Platform.OS === "android" &&
                        (
                            <TouchableOpacity
                                style={styles.dateTimePickerButton}
                                onPress={handleOpenDateTimePickerForAndroid}
                            >
                                <Text style={styles.dateTimePickerText}>
                                    {`Mudar ${format(selectedDateTime, "HH:mm")}`}
                                </Text>
                            </TouchableOpacity>
                        )
                    }

                    <Button
                        title="Cadastrar planta"
                        onPress={handleSave}
                    />
                </View>
            </SafeAreaView>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        justifyContent: "space-between",
        backgroundColor: colors.shape
    },
    plantInfo: {
        flex: 1,
        paddingHorizontal: 30,
        paddingVertical: 50,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.shape
    },
    plantName: {
        fontFamily: fonts.heading,
        fontSize: 24,
        color: colors.heading,
        marginTop: 15
    },
    plantAbout: {
        textAlign: "center",
        fontFamily: fonts.text,
        color: colors.heading,
        fontSize: 17,
        marginTop: 10
    },
    controllers: {
        backgroundColor: colors.white,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 20
    },
    tipContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: colors.blue_light,
        padding: 20,
        borderRadius: 20,
        position: "relative",
        bottom: 60
    },
    tipImage: {
        height: 56,
        width: 56
    },
    tipText: {
        flex: 1,
        marginLeft: 20,
        fontFamily: fonts.text,
        color: colors.blue,
        fontSize: 17,
        textAlign: "justify"
    },
    alertLabel: {
        textAlign: "center",
        fontFamily: fonts.complement,
        color: colors.heading,
        fontSize: 12,
        marginBottom: 5
    },
    dateTimePickerButton: {
        width: "100%",
        alignItems: "center",
        paddingVertical: 40
    },
    dateTimePickerText: {
        color: colors.heading,
        fontSize: 24,
        fontFamily: fonts.text
    }
});
