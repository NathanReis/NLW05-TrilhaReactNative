import AsyncStorage from "@react-native-async-storage/async-storage";
import { formatDistance } from "date-fns";
import { pt } from "date-fns/locale";
import React, { useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    Image,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    View
} from "react-native";
import waterdropImg from "../assets/waterdrop.png";
import { Header } from "../components/Header";
import { Load } from "../components/Load";
import { PlantCardSecondary } from "../components/PlantCardSecondary";
import {
    deletePlant,
    IPlantProps,
    loadPlants
} from "../libs/storage";
import colors from "../styles/colors";
import fonts from "../styles/fonts";

export function MyPlants() {
    const [myPlants, setMyPlants] = useState<IPlantProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [nextWatered, setNextWatered] = useState<string>();

    function handleRemove(plant: IPlantProps) {
        Alert.alert(
            "Remover",
            `Deseja remover a ${plant.name}?`,
            [
                {
                    text: "Não 🙏",
                    style: "cancel"
                },
                {
                    text: "Sim 😢",
                    onPress: async () => {
                        try {
                            await deletePlant(plant.id);

                            setMyPlants((oldValue) =>
                                oldValue.filter((item) => item.id !== plant.id)
                            );
                        } catch {
                            Alert.alert("Não foi possível remover 😢");
                        }
                    }
                }
            ]
        );
    }

    useEffect(() => {
        async function loadStoreData(): Promise<void> {
            const plantsStored = await loadPlants();
            const nextWateredPlant = plantsStored[0];
            const nextTime = formatDistance(
                (new Date(nextWateredPlant.dateTimeNotification)).getTime(),
                (new Date()).getTime(),
                { locale: pt }
            );

            setNextWatered(`Não esqueça de regar a ${nextWateredPlant.name} à ${nextTime}`);
            setMyPlants(plantsStored);
            setLoading(false);
        }

        loadStoreData();
    }, []);

    if (loading) {
        return (
            <Load />
        );
    } else {
        return (
            <SafeAreaView style={styles.container}>
                <Header />

                <View style={styles.spotlight}>
                    <Image
                        source={waterdropImg}
                        style={styles.spotlightImage}
                    />

                    <Text style={styles.spotlightText}>
                        {nextWatered}
                    </Text>
                </View>

                <View style={styles.plants}>
                    <Text style={styles.plantsTitle}>
                        Próximas regadas
                    </Text>

                    <FlatList
                        data={myPlants}
                        keyExtractor={(item) => String(item.id)}
                        renderItem={({ item }) => (
                            <PlantCardSecondary
                                data={item}
                                handleRemove={() => handleRemove(item)}
                            />
                        )}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ flex: 1 }}
                    />
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 30,
        backgroundColor: colors.background
    },
    spotlight: {
        backgroundColor: colors.blue_light,
        paddingHorizontal: 20,
        borderRadius: 20,
        height: 110,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    spotlightImage: {
        height: 60,
        width: 60
    },
    spotlightText: {
        flex: 1,
        color: colors.blue,
        fontFamily: fonts.text,
        paddingHorizontal: 20
    },
    plants: {
        flex: 1,
        width: "100%"
    },
    plantsTitle: {
        fontSize: 24,
        fontFamily: fonts.heading,
        color: colors.heading,
        marginVertical: 20
    }
});
