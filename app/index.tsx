import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin, User, isSuccessResponse } from "@react-native-google-signin/google-signin";
import { RelativePathString, router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

GoogleSignin.configure({
  iosClientId:"444112564468-gnqcb8rp9nqhr0c4qcekvj6q6j2bikeo.apps.googleusercontent.com",
})

export default function App() {
  const [auth, setAuth] = useState<User | null>(null);
  const [sessionValue, setSessionValue] = useState("");
  const [sessionSavedValue, setSessionSavedValue] = useState("");

  const [emailAddressValue, setEmailAddressValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const textInputRef = useRef<TextInput>(null);
  const textSenhaRef = useRef<TextInput>(null);

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if(isSuccessResponse(response)){
        console.log(response?.data);
      }
    } catch (error) {
      console.log(error);
      
    }
     
  };

  const sendLoginGoogle = () => {

  }
  const goToLogado = () => {
    router.push("/lista-jogadores" as RelativePathString);
  }
  const clearSession = async () => {
    await AsyncStorage.removeItem("sessionSavedValue")
    await AsyncStorage.removeItem("sessionValue");
    setSessionSavedValue('');
    loadData();
  }
  const clearInput = () => {
    if (textInputRef.current) {
      textInputRef.current.clear(); // Limpa o conteúdo do TextInput
    }
    if (textSenhaRef.current) {
      textSenhaRef.current.clear(); // Limpa o conteúdo do TextInput
    }
  };


  const loadData = async () => {
    try {
      const value = await AsyncStorage.getItem("sessionSavedValue"); // Recupera o valor
      if (value !== null) {
        setSessionSavedValue(value);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  };


  const sendLoginData = async () => {

    try {
      const response = await fetch("http://10.0.0.209:3333/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailAddressValue,
          password: passwordValue,
        }),
      });

      const result = await response.json();
      console.log("Resposta do servidor:", result);
      if (result.message) {
        alert(result.message);
      }
      if (result.token) {
        await AsyncStorage.setItem("sessionSavedValue", result.token);
        clearInput();
        loadData();
      }
    } catch (error) {
      console.error("Erro ao fazer requisição:", error);
    }
  };


  const goToProfile = async () => {

    try {
      const response = await fetch("http://10.0.0.209:3333/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionSavedValue}` // Adicione o token aqui
        },
      });

      if (!response.ok) {
        alert("Você precisa fazer login para acessar essa area");
        clearSession();
      } else {
        const result = await response.json();
        alert(JSON.stringify(result));
        router.navigate("/lista-jogadores" as RelativePathString);

      }

    } catch (error) {
      console.error("Erro ao fazer requisição:", error);
    }
  };


  const goToUser = async () => {
    router.navigate("/user" as RelativePathString);
  };

  const goToGuest = async () => {
    router.navigate("/guest" as RelativePathString);
  };



  useEffect(() => {
    loadData(); // Carrega os dados ao iniciar o app
  }, []);
  const Separator = () => <View style={styles.separator} />;

  return (
    <View style={styles.container}>
      <TextInput
        ref={textInputRef}
        style={styles.input}
        placeholder="augustorsn@gmail.com"
        textContentType="emailAddress"
        value={emailAddressValue}
        onChangeText={setEmailAddressValue}
        clearTextOnFocus={true}
      />

      <TextInput
        ref={textSenhaRef}
        style={styles.input}
        textContentType="password"
        placeholder="Senha"
        value={passwordValue}
        onChangeText={setPasswordValue}
        clearTextOnFocus={true}
      />
      <Button title="Login" onPress={sendLoginData} />

      <Button title="Login Google" onPress={sendLoginGoogle} />
      <Separator />
      <Button title="clear session" onPress={clearSession} />
      <Text style={styles.text}>value session saved: {sessionSavedValue}</Text>
      <Separator />
      <Button title="Ir para Perfil" onPress={goToProfile} />
      <Separator />
      <Button title="Cadastrar Usuario" onPress={goToUser} />
      <Separator />
      <Button title="Cadastrar Guest" onPress={goToGuest} />

      <Separator />
      <Button title="Novo Login Google" onPress={handleGoogleSignIn} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
  },
  text: {
    marginTop: 10,
    fontSize: 16,
  },

  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
