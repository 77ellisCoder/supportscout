import {
    ScrollView,
    Text,
    View,
} from "react-native";

import AvailabilityPreferencesCard from "../../components/settings/AvailabilityPreferencesCard";

import {
    styles,
} from "../../styles/settings.styles";

const CURRENT_USER_ID =
    1;

export default function SettingsScreen() {
    return (
        <ScrollView
            contentContainerStyle={
                styles.container
            }
        >
            <View
                style={
                    styles.header
                }
            >
                <Text
                    style={
                        styles.title
                    }
                >
                    Settings
                </Text>

                <Text
                    style={
                        styles.subtitle
                    }
                >
                    Manage your SupportScout preferences.
                </Text>
            </View>

            <AvailabilityPreferencesCard
                userId={
                    CURRENT_USER_ID
                }
            />
        </ScrollView>
    );
}