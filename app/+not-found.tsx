import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 12 }}>
      <Text style={{ fontSize: 20 }}>That screen is not on the floor.</Text>
      <Link href="/">Back to Train</Link>
    </View>
  );
}
