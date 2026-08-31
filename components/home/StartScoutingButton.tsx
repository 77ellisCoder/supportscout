import { router } from "expo-router";
import {
  Text,
  View,
} from "react-native";

import { Button } from "../../components/ui/Button";
import { styles } from "../../styles/index.styles"

/**
 * StartScoutingButton is a button that allows users to navigate to the bands screen and begin scouting.
 * @component
 * @example
 * return (
 *   <StartScoutingButton />
 * )
 * @returns 
 */
export default function StartScoutingButton() {

  return (
    <View style={styles.exploreWrapper}>
      <Button
        title="Start Scouting"
        sound={true}
        align={"center"}
        onPress={() => router.push("/bands")}
        iconRight={
          <Text style={styles.exploreArrow}>
            →
          </Text>
        }
      />
    </View>
  );
}