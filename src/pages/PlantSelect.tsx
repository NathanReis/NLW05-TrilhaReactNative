import { useNavigation } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    View
} from "react-native";
import { EnvironmentButton } from "../components/EnvironmentButton";
import { Header } from "../components/Header";
import { Load } from "../components/Load";
import { PlantCardPrimary } from "../components/PlantCardPrimary";
import { IPlantProps } from "../libs/storage";
import api from "../services/Api";
import colors from "../styles/colors";
import fonts from "../styles/fonts";

interface IEnvironmentProps {
    key: string;
    title: string;
}

export function PlantSelect() {
    const navigation = useNavigation();

    const [environments, setEnvironments] = useState<IEnvironmentProps[]>([]);
    const [plants, setPlants] = useState<IPlantProps[]>([]);
    const [filteredPlants, setFilteredPlants] = useState<IPlantProps[]>([]);
    const [environmentSelected, setEnvironmentSelected] = useState("all");
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);

    async function fetchPlants(): Promise<void> {
        const { data } = await api
            .get(`plants?_sort=name&_order=asc&_page=${page}&_limit=8`);

        if (!data) {
            return setLoading(true);
        }

        if (page > 1) {
            setFilteredPlants(oldValue => [...oldValue, ...data]);
        } else {
            setFilteredPlants(data);
        }

        setLoading(false);
        setLoadingMore(false);
    }

    function handleEnvironmentSelected(environment: string): void {
        setEnvironmentSelected(environment);

        if (environment === "all") {
            return setFilteredPlants(plants);
        }

        setFilteredPlants(plants.filter((plant) => {
            return plant.environments.includes(environment);
        }));
    }

    function handlePlantSelected(plant: IPlantProps): void {
        navigation.navigate("PlantSave", { plant });
    }

    function handleFetchMore(distance: number): void {
        if (distance < 1) {
            return;
        }

        setLoadingMore(true);
        setPage(oldValue => ++oldValue);

        fetchPlants();
    }

    useEffect(() => {
        async function fetchEnvironments(): Promise<void> {
            const { data } = await api
                .get("plants_environments?_sort=title&_order=asc");

            setEnvironments([
                {
                    key: "all",
                    title: "Todos"
                },
                ...data
            ]);
        }

        fetchEnvironments();
    }, []);

    useEffect(() => {
        fetchPlants();
    }, []);

    if (loading) {
        return (
            <Load />
        );
    } else {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Header />

                    <Text style={styles.title}>
                        Em qual ambiente
                </Text>
                    <Text style={styles.subtitle}>
                        você quer colocar sua planta?
                </Text>
                </View>

                <View>
                    <FlatList
                        data={environments}
                        keyExtractor={(item) => String(item.key)}
                        renderItem={({ item }) => (
                            <EnvironmentButton
                                title={item.title}
                                active={item.key === environmentSelected}
                                onPress={() => {
                                    handleEnvironmentSelected(item.key);
                                }}
                            />
                        )}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.environmentsList}
                    />
                </View>

                <View style={styles.plants}>
                    <FlatList
                        data={filteredPlants}
                        keyExtractor={(item) => String(item.id)}
                        renderItem={({ item }) => (
                            <PlantCardPrimary
                                data={item}
                                onPress={() => {
                                    handlePlantSelected(item);
                                }}
                            />
                        )}
                        showsVerticalScrollIndicator={false}
                        numColumns={2}
                        onEndReachedThreshold={0.1}
                        onEndReached={({ distanceFromEnd }) => {
                            handleFetchMore(distanceFromEnd)
                        }}
                        ListFooterComponent={
                            loadingMore
                                ? <ActivityIndicator color={colors.green} />
                                : <></>
                        }
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
        backgroundColor: colors.background
    },
    header: {
        paddingHorizontal: 30
    },
    title: {
        fontSize: 17,
        color: colors.heading,
        fontFamily: fonts.heading,
        lineHeight: 20,
        marginTop: 15
    },
    subtitle: {
        fontFamily: fonts.text,
        fontSize: 17,
        lineHeight: 20,
        color: colors.heading
    },
    environmentsList: {
        height: 40,
        justifyContent: "center",
        paddingBottom: 5,
        marginLeft: 32,
        marginVertical: 32
    },
    plants: {
        flex: 1,
        paddingHorizontal: 32,
        justifyContent: "center"
    }
});
