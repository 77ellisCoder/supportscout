import {
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";

import { router } from "expo-router";

import { Button } from "../../../components/ui/Button";
import { usePrCampaigns } from "../../../hooks/usePrCampaigns";

import { styles } from "./index.styles";

export default function PrCampaignsScreen() {
    const {
        data: campaigns = [],
        isLoading,
        error,
    } = usePrCampaigns();

    return (
        <View style={styles.screen}>
            <ScrollView>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.title}>
                                PR Campaigns
                            </Text>

                            <Text style={styles.subtitle}>
                                {campaigns.length} campaigns
                            </Text>
                        </View>

                        <Button
                            title="PR Contacts"
                            variant="secondary"
                            onPress={() =>
                                router.push("/pr")
                            }
                        />
                    </View>

                    {isLoading && (
                        <Text
                            style={
                                styles.secondaryText
                            }
                        >
                            Loading campaigns...
                        </Text>
                    )}

                    {error && (
                        <Text style={styles.error}>
                            Unable to load campaigns.
                        </Text>
                    )}

                    {!isLoading &&
                        !error &&
                        campaigns.length === 0 && (
                            <View
                                style={
                                    styles.empty
                                }
                            >
                                <Text
                                    style={
                                        styles.emptyTitle
                                    }
                                >
                                    No campaigns yet
                                </Text>

                                <Text
                                    style={
                                        styles.secondaryText
                                    }
                                >
                                    Select contacts and
                                    create your first PR
                                    campaign.
                                </Text>

                                <Button
                                    title="PR Contacts"
                                    onPress={() =>
                                        router.push(
                                            "/pr"
                                        )
                                    }
                                />
                            </View>
                        )}

                    <View style={styles.list}>
                        {campaigns.map(
                            (campaign) => (
                                <Pressable
                                    key={
                                        campaign.id
                                    }
                                    onPress={() =>
                                        router.push({
                                            pathname:
                                                "/pr/campaign/[id]",
                                            params: {
                                                id: String(
                                                    campaign.id
                                                ),
                                            },
                                        })
                                    }
                                    style={({ pressed }) => [
                                        styles.card,
                                        pressed &&
                                        styles.cardPressed,
                                    ]}
                                >
                                    <View
                                        style={
                                            styles.cardHeader
                                        }
                                    >
                                        <View
                                            style={
                                                styles.cardTitleArea
                                            }
                                        >
                                            <Text
                                                style={
                                                    styles.campaignName
                                                }
                                            >
                                                {
                                                    campaign.name
                                                }
                                            </Text>

                                            <Text
                                                style={
                                                    styles.subject
                                                }
                                            >
                                                {
                                                    campaign.subject
                                                }
                                            </Text>
                                        </View>

                                        <View
                                            style={
                                                styles.statusBadge
                                            }
                                        >
                                            <Text
                                                style={
                                                    styles.statusText
                                                }
                                            >
                                                {campaign.status.toUpperCase()}
                                            </Text>
                                        </View>
                                    </View>

                                    <View
                                        style={
                                            styles.details
                                        }
                                    >
                                        <Text
                                            style={
                                                styles.detailText
                                            }
                                        >
                                            {
                                                campaign.recipientCount
                                            }{" "}
                                            recipients
                                        </Text>

                                        <Text
                                            style={
                                                styles.detailText
                                            }
                                        >
                                            {campaign.attachmentFilename
                                                ? `🎵 ${campaign.attachmentFilename}`
                                                : "No attachment"}
                                        </Text>

                                        <Text
                                            style={
                                                styles.detailText
                                            }
                                        >
                                            Created{" "}
                                            {new Date(
                                                campaign.createdAt
                                            ).toLocaleString()}
                                        </Text>
                                    </View>
                                </Pressable>
                            )
                        )}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}