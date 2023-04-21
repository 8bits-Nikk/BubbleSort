import { StyleSheet, View } from "react-native";
import { BubbleSortAnimation } from "./src/BubbleSortAnimation";

export default function App() {
  return (
    <View style={styles.body}>
      <BubbleSortAnimation />
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
});
