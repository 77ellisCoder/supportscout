import { Link, router } from "expo-router";
import {
  Image,
  ScrollView,
  Text,
  View,
} from "react-native";

import { useBands } from "../hooks/useBands";
import { styles } from "../styles/index.styles"
import { Button } from "../components/Button";

import Header from "./header";
import Stats from "./stats";
import Footer from "./footer";


/**
 * HomeScreen is the main landing page for the app, providing an overview of key features and statistics.
 *
 * @component
 * @example
 * return (
 *   <HomeScreen />
 * )
 * @returns 
 */
export default function HomeScreen() {

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={styles.container}
    >
      {/* Header */}
      <Header />

      {/* Stats */}
      <Stats />

      {/* Primary Action */}
      <View style={styles.exploreWrapper}>
        <Button
          title="Start Scouting"
          sound={true}
          onPress={() => router.push("/bands")}
          iconRight={
            <Text style={styles.exploreArrow}>
              →
            </Text>
          }
        />
      </View>

      {/* Workspace */}
      {/* Navigation */}

      {/* Footer */}
      <Footer />

    </ScrollView>
  );
}