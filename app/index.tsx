import { router } from "expo-router";
import { useEffect } from "react";
import { Dimensions, Image, StatusBar, StyleSheet, View } from "react-native";
export default function App() {

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace("/home"); // substitui a splash pela home
    }, 5000); // 5 segundos

    return () => clearTimeout(timeout); // limpa o timeout se o componente for desmontado
  }, []);
  return (
     <View style={styles.container}>
       <StatusBar hidden />
       <Image
         source={require("../assets/images/loading.gif")}
         style={styles.image}
         resizeMode="cover"
       />
     </View>
   );
 }
 
 const { width, height } = Dimensions.get("window");
 
 const styles = StyleSheet.create({
   container: {
     flex: 1,
     backgroundColor: "black",
   },
   image: {
     width,
     height,
   },
 });
 