import AsyncStorage from "@react-native-async-storage/async-storage";
import { RelativePathString, router } from "expo-router";
import { useEffect, useState } from "react";
import { Button, FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { getValidAccessToken } from "..//../service/authService";

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  adm: boolean;
}

export default function Login() {
  const [sessionSavedValue, setSessionSavedValue] = useState<string | null>(null);
  const [user, setUser] = useState<User[]>([]); // Use o estado para armazenar os dados
  const goToIndex = () => {
    router.push('/');
  };

  const loadData = async () => {
    const getSession = await AsyncStorage.getItem("sessionSavedValue");
    const accessToken = await getValidAccessToken();

    try {
      const response = await fetch("http://10.0.0.209:3333/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        alert("Você precisa fazer login para acessar essa área");
        router.push("/");
      } else {
        const result = await response.json();
        setUser(result.usuarios); // Atualiza o estado com os dados recebidos
        console.log(result.usuarios);
      }
    } catch (error) {
      console.error("Erro ao fazer requisição:", error);
    }
  };


  const goToSorteio = async () => {
    const storedToken = await AsyncStorage.getItem("accessToken");
    if (storedToken) setSessionSavedValue(storedToken);
  
    try {
      const response = await fetch("http://10.0.0.209:3333/sorteio", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
      });
  
      if (!response.ok) {
        alert("Você precisa fazer login para acessar essa área");
        router.push("/");
      } else {
        const result = await response.json();
        await AsyncStorage.setItem("resultSorteio", JSON.stringify(result));
        
        router.push("/teams" as RelativePathString);
      }
    } catch (error) {
      console.error("Erro ao fazer requisição:", error);
    }
  };
  useEffect(() => {
    loadData(); // Carrega os dados ao iniciar o app
  }, []);

  type ItemProps = { title: string };

  const Item = ({ title }: ItemProps) => (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={user} // Agora `user` é atualizado via estado
          renderItem={({ item }) => <Item title={item.name} />}
          keyExtractor={(item) => item.id.toString()} // Certifique-se de que `item.id` seja uma string
        />
        <Text>Logado</Text>
        <Button title="Sorteio" onPress={goToSorteio} />
        <Button title="Voltar" onPress={goToIndex} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    backgroundColor: "#d5ffc2",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});
