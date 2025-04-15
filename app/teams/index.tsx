import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

interface Team {
  name: string;
  players: string[];
}

export default function Teams() {
  const [teams, setTeams] = useState<Team[]>([]);

  const loadData = async () => {
    const sorteio = await AsyncStorage.getItem("resultSorteio");

    if (sorteio) {
      try {
        const parsedSorteio = JSON.parse(sorteio);
        if (typeof parsedSorteio === "object" && parsedSorteio !== null) {
          const formattedTeams: Team[] = Object.entries(parsedSorteio).map(
            ([teamName, players]) => ({
              name: teamName,
              players: Array.isArray(players) ? players : [],
            })
          );
          setTeams(formattedTeams);
        } else {
          console.error("resultSorteio não é um objeto válido:", parsedSorteio);
        }
      } catch (error) {
        console.error("Erro ao converter resultSorteio:", error);
      }
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Times Sorteados:</Text>
        <FlatList
          data={teams}
          renderItem={({ item }) => (
            <View style={styles.teamContainer}>
              <Text style={styles.teamName}>{item.name.toUpperCase()}</Text>
              {item.players.length > 0 ? (
                item.players.map((player, index) => (
                  <Text key={index} style={styles.playerName}>
                    - {player}
                  </Text>
                ))
              ) : (
                <Text style={styles.emptyTeam}>Nenhum jogador</Text>
              )}
            </View>
          )}
          keyExtractor={(item) => item.name}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f4f4f4",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  teamContainer: {
    backgroundColor: "#d5ffc2",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
  },
  teamName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  playerName: {
    fontSize: 16,
    marginLeft: 10,
  },
  emptyTeam: {
    fontSize: 16,
    fontStyle: "italic",
    color: "gray",
  },
});
