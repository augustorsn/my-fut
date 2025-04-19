import { Dimensions, Image, StatusBar, StyleSheet, View } from "react-native";

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Image
        source={require("../../assets/images/loading.gif")}
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
