import {
  ScrollView,
} from "react-native";

import { styles } from "../styles/index.styles"

import AppHeader from "../components/home/AppHeader";
import AppStats from "../components/home/AppStats";
import AppFooter from "../components/home/AppFooter";
import StartScoutingButton from "../components/home/StartScoutingButton";

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
      <AppHeader />

      {/* Application Stats */}
      <AppStats />

      {/* Primary Action */}
      <StartScoutingButton />

      {/* Footer */}
      <AppFooter />

    </ScrollView>
  );
}