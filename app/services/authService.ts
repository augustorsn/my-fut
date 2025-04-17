import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

// Função para pegar o token válido
export const getValidAccessToken = async () => {
  try {
    // Tentamos pegar o token armazenado localmente
    const storedToken = await AsyncStorage.getItem("accessToken");
    
    // Se houver um token armazenado, retornamos ele
    if (storedToken) {
      return storedToken;
    }
    
    // Se não houver, fazemos a renovação
    const tokens = await GoogleSignin.getTokens();
    
    // Salvamos o novo accessToken
    await AsyncStorage.setItem("accessToken", tokens.accessToken);

    return tokens.accessToken;
  } catch (error) {
    console.log("Erro ao pegar o token válido:", error);
    throw error; // Caso tenha erro, jogamos pra quem chamou
  }
};

// Função para limpar os tokens
export const clearToken = async () => {
  try {
    await GoogleSignin.signOut(); // Desloga o usuário do Google
    await AsyncStorage.removeItem("accessToken");    
  } catch (error) {
    console.log("Erro ao limpar o token:", error);
  }
};
