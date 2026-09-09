import { useState } from "react";

import {
    ScrollView,
    Text,
    View,
} from "react-native";

import {
    router,
    useLocalSearchParams,
} from "expo-router";

import { Button } from "../../../components/ui/Button";
import { usePrCampaign } from "../../../hooks/usePrCampaign";
import {
    WebPrCampaignRepository,
} from "../../../repositories/WebPrCampaignRepository";

import { styles } from "../../../styles/pr/campaign.styles";

export default function PrCampaignScreen() {
    const params =
        useLocalSearchParams<{
            id: string;
        }>();

    const campaignId =
        Number(params.id);

    const {
        data: campaign,
        isLoading,
        error,
    } = usePrCampaign(campaignId);

    const [sendingTest, setSendingTest] =
        useState(false);

    const [testMessage, setTestMessage] =
        useState<string | null>(null);

    const [testError, setTestError] =
        useState<string | null>(null);

    async function sendTest() {
        try {
            setSendingTest(true);
            setTestMessage(null);
            setTestError(null);

            const result =
                await WebPrCampaignRepository.sendTest(
                    campaignId
                );

            setTestMessage(
                `Test sent to ${result.sentTo}`
            );
        } catch (err) {
            setTestError(
                err instanceof Error
                    ? err.message
                    : "Unable to send test email."
            );
        } finally {
            setSendingTest(false);
        }
    }

    if (isLoading) {
        return (
            <View style={styles.screen}>
                <View style={styles.content}>
                    <Text
                        style={
                            styles.secondaryText
                        }
                    >
                        Loading campaign...
                    </Text>
                </View>
            </View>
        );
    }

    if (error || !campaign) {
        return (
            <View style={styles.screen}>
                <View style={styles.content}>
                    <Text style={styles.error}>
                        Unable to load campaign.
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.screen}>
            <ScrollView>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.title}>
                                {campaign.name}
                            </Text>

                            <Text
                                style={
                                    styles.secondaryText
                                }
                            >
                                PR Campaign
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

                    <View style={styles.section}>
                        <Text
                            style={
                                styles.sectionTitle
                            }
                        >
                            Subject
                        </Text>

                        <Text style={styles.value}>
                            {campaign.subject}
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <Text
                            style={
                                styles.sectionTitle
                            }
                        >
                            Message
                        </Text>

                        <Text
                            style={
                                styles.messageText
                            }
                        >
                            {campaign.emailBody}
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <Text
                            style={
                                styles.sectionTitle
                            }
                        >
                            Attachment
                        </Text>

                        {campaign.attachmentFilename ? (
                            <Text style={styles.value}>
                                🎵{" "}
                                {
                                    campaign.attachmentFilename
                                }
                            </Text>
                        ) : (
                            <Text
                                style={
                                    styles.secondaryText
                                }
                            >
                                No attachment
                            </Text>
                        )}
                    </View>

                    <View style={styles.section}>
                        <Text
                            style={
                                styles.sectionTitle
                            }
                        >
                            Recipients
                        </Text>

                        <Text
                            style={
                                styles.secondaryText
                            }
                        >
                            {campaign.recipients
                                ?.length ?? 0}{" "}
                            selected
                        </Text>

                        <View
                            style={
                                styles.recipientList
                            }
                        >
                            {campaign.recipients?.map(
                                (recipient) => (
                                    <View
                                        key={
                                            recipient.recipientId
                                        }
                                        style={
                                            styles.recipientRow
                                        }
                                    >
                                        <View>
                                            <Text
                                                style={
                                                    styles.recipientOutlet
                                                }
                                            >
                                                {
                                                    recipient.outlet
                                                }
                                            </Text>

                                            <Text
                                                style={
                                                    styles.secondaryText
                                                }
                                            >
                                                {
                                                    recipient.email
                                                }
                                            </Text>
                                        </View>

                                        <Text
                                            style={
                                                styles.recipientStatus
                                            }
                                        >
                                            {
                                                recipient.status
                                            }
                                        </Text>
                                    </View>
                                )
                            )}
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text
                            style={
                                styles.sectionTitle
                            }
                        >
                            Test Delivery
                        </Text>

                        <Text
                            style={
                                styles.secondaryText
                            }
                        >
                            Test emails are currently
                            locked to:
                        </Text>

                        <Text style={styles.value}>
                            info@redtemples.band
                        </Text>

                        {testMessage && (
                            <Text
                                style={
                                    styles.success
                                }
                            >
                                {testMessage}
                            </Text>
                        )}

                        {testError && (
                            <Text style={styles.error}>
                                {testError}
                            </Text>
                        )}

                        <View
                            style={
                                styles.testActions
                            }
                        >
                            <Button
                                title={
                                    sendingTest
                                        ? "Sending Test..."
                                        : "Send Test"
                                }
                                onPress={sendTest}
                                disabled={
                                    sendingTest
                                }
                            />
                        </View>
                    </View>

                    <View
                        style={styles.actions}
                    >
                        <Button
                            title="Campaigns"
                            variant="secondary"
                            onPress={() =>
                                router.push("/pr/campaigns")
                            }
                        />

                        <Button
                            title="Send Campaign"
                            disabled={true}
                            onPress={() => { }}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}