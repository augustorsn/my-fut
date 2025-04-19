import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin, User, isSuccessResponse, statusCodes } from "@react-native-google-signin/google-signin";
import { RelativePathString, router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { GOOGLE_CLIENTS } from "../../config";
import { clearToken, getValidAccessToken } from "../../service/authService";
GoogleSignin.configure({
  iosClientId: GOOGLE_CLIENTS.iosClientId,
  webClientId: GOOGLE_CLIENTS.webClientId,
  forceCodeForRefreshToken: true, // se quiser usar refresh token (opcional)
  
})

export default function Home() {
  console.log('web'+ GOOGLE_CLIENTS.webClientId);
  console.log('ios'+ GOOGLE_CLIENTS.iosClientId);
  const [auth, setAuth] = useState<User | null>(null);
  const [sessionValue, setSessionValue] = useState("");
  const [sessionSavedValue, setSessionSavedValue] = useState("");

  const [emailAddressValue, setEmailAddressValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const textInputRef = useRef<TextInput>(null);
  const textSenhaRef = useRef<TextInput>(null);

  const handleGoogleSignIn = async () => {
    try {
      // Verifica se os serviços do Google Play estão disponíveis
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  
      // Faz login e retorna os dados do usuário
      const response = await GoogleSignin.signIn();
  
      if (isSuccessResponse(response)) {
        console.log("User Info:", response.data);
  
        const accessToken = await getValidAccessToken();

        console.log(accessToken)
  
        // Salva os dados no estado (para exibir ou navegar)
        setSessionValue(accessToken);
        setAuth({
          ...response.data,
      
          accessToken: accessToken,
        } as any); // cast temporário, se quiser tipar melhor posso te ajudar
  
        // // 👉 Aqui você pode enviar o token para seu backend para validar
        // const backendResponse = await fetch("http://10.0.0.209:3333/profile", {
        //   method: "GET",
        //   headers: {
        //     "Authorization": `Bearer ${tokens.accessToken}`, // Pode usar idToken também, dependendo da validação
        //   },
        // });
  
        // const result = await backendResponse.json();
        // console.log("Backend response:", result);
  
        // // Se sucesso, redireciona
        // if (backendResponse.ok) {
        //   router.push("/lista-jogadores" as RelativePathString);
        // } else {
        //   alert("Erro ao autenticar com o servidor.");
        // }
      }
    } catch (error: any) {
      console.log("Erro no login com Google:", error);
  
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        alert("Login cancelado pelo usuário.");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        alert("Login em andamento...");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        alert("Google Play Services não disponível ou desatualizado.");
      } else {
        alert("Erro desconhecido ao logar com Google.");
      }
    }
  };
  

  const sendLoginGoogle = () => {
    router.navigate("/splash" as RelativePathString);

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
      const accessToken = await getValidAccessToken();
      const response = await fetch("http://10.0.0.209:3333/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}` // Adicione o token aqui
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

  const handleLogout = async () => {
    try {
      await clearToken(); // Limpa o token e desloga o usuário
      // Redireciona ou faz o que for necessário após o logout
    } catch (error) {
      console.log("Erro no logout:", error);
    }
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
      <Separator />

      <Button title="Logout" onPress={handleLogout} />
    <Text>{auth?.user.email} -{sessionValue} </Text>
    
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
