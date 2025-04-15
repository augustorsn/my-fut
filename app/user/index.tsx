import { router } from "expo-router";
import { useState } from "react";
import { Button, StyleSheet, TextInput, View } from "react-native";

export default function User() {
    
    const [sessionSavedValue, setSessionSavedValue] = useState("");
    const [nameValue, setNameValue] = useState("");
    const [emailAddressValue, setEmailAddressValue] = useState("");
    const [passwordValue, setPasswordValue] = useState("");



    const sendUser = async () => {

        try {
            const response = await fetch("http://10.0.0.209:3333/user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: nameValue,
                    email: emailAddressValue,
                    password: passwordValue,
                }),
            });

            const result = await response.json();
            console.log("Resposta do servidor:", result);
            if(!response.ok){
                alert("Erro ai tentar fazer cadastro!");
            }

            if(response.ok){
                alert("Usuario cadastrado com sucesso!");
            }
        } catch (error) {
            console.error("Erro ao fazer requisição:", error);
        }
    };


    const goToLogin = async () => {

        router.navigate("/");
    };



    const Separator = () => <View style={styles.separator} />;

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Pedrinha"
                textContentType="name"
                value={nameValue}
                onChangeText={setNameValue}
                clearTextOnFocus={true}
            />
            <TextInput
            
                style={styles.input}
                placeholder="augustorsn@gmail.com"
                textContentType="emailAddress"
                value={emailAddressValue}
                onChangeText={setEmailAddressValue}
                clearTextOnFocus={true}
            />

            <TextInput
        
                style={styles.input}
                textContentType="password"
                placeholder="Senha"
                value={passwordValue}
                onChangeText={setPasswordValue}
                clearTextOnFocus={true}
            />
            <Button title="Cadastrar" onPress={sendUser} />
            <Separator />
           
            <Button title="Ir para Login" onPress={goToLogin} />
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
