import { useLocalSearchParams } from "expo-router";
import { SittingScreen } from "@/src/screens/SittingScreen";

export default function SessionRoute() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  if (!id) return null;
  return <SittingScreen id={id} />;
}
