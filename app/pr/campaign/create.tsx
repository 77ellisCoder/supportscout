import { useMemo, useState } from "react";

import {
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";

import {
    router,
    useLocalSearchParams,
} from "expo-router";

import * as DocumentPicker from "expo-document-picker";

import { Button } from "../../../components/ui/Button";
import { usePrContacts } from "../../../hooks/usePrContacts";
import { WebPrCampaignRepository } from "../../../repositories/WebPrCampaignRepository";

import { styles } from "../../../styles/pr/campaign-create.styles";

type SelectedAttachment = {
    name: string;
    uri: string;
    size?: number | null;
    mimeType?: string | null;
};

export default function CreatePrCampaignScreen() {
    const params =
        useLocalSearchParams<{
            contactIds?: string;
        }>();

    const { data: contacts = [] } =
        usePrContacts();

    const contactIds = useMemo(() => {
        if (!params.contactIds) {
            return [];
        }

        return params.contactIds
            .split(",")
            .map(Number)
            .filter(Number.isInteger);
    }, [params.contactIds]);

    const recipients = useMemo(
        () =>
            contacts.filter((contact) =>
                contactIds.includes(contact.id)
            ),
        [contacts, contactIds]
    );

    const [name, setName] = useState("");
    const [subject, setSubject] =
        useState("");
    const [emailBody, setEmailBody] =
        useState("");

    const [attachment, setAttachment] =
        useState<SelectedAttachment | null>(
            null
        );

    const [saveStatus, setSaveStatus] =
        useState<"idle" | "saving" | "uploading">(
            "idle"
        );

    const saving = saveStatus !== "idle";

    const [error, setError] =
        useState<string | null>(null);

    async function chooseAttachment() {
        const result =
            await DocumentPicker.getDocumentAsync({
                type: "audio/mpeg",
                multiple: false,
                copyToCacheDirectory: true,
            });

        if (result.canceled) {
            return;
        }

        const file = result.assets[0];

        setAttachment({
            name: file.name,
            uri: file.uri,
            size: file.size,
            mimeType: file.mimeType,
        });
    }

    async function saveDraft() {
        if (
            !name.trim() ||
            !subject.trim() ||
            !emailBody.trim()
        ) {
            setError(
                "Campaign name, subject and message are required."
            );
            return;
        }

        if (contactIds.length === 0) {
            setError(
                "Select at least one recipient."
            );
            return;
        }

        try {
            setSaveStatus("saving");
            setError(null);

            const campaign =
                await WebPrCampaignRepository.create({
                    name,
                    subject,
                    emailBody,
                    contactIds,
                });

            console.log(
                "Created PR campaign:",
                campaign
            );

            if (attachment) {
                setSaveStatus("uploading");

                const uploadedAttachment =
                    await WebPrCampaignRepository.uploadAttachment(
                        campaign.id,
                        attachment
                    );

                console.log(
                    "Uploaded campaign attachment:",
                    uploadedAttachment
                );
            }

            // Navigate to the campaign details page after saving
            router.replace({
                pathname: "/pr/campaign/[id]",
                params: {
                    id: String(campaign.id),
                },
            });

        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to save campaign."
            );
        } finally {
            setSaveStatus("idle");
        }
    }

    return (
        <View style={styles.screen}>
            <ScrollView>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.title}>
                            Create PR Campaign
                        </Text>

                        <Text style={styles.subtitle}>
                            Build the campaign, review
                            recipients, then save it as
                            a draft.
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            Campaign
                        </Text>

                        <Text style={styles.label}>
                            Campaign name
                        </Text>

                        <TextInput
                            value={name}
                            onChangeText={setName}
                            placeholder="Red Temples – Single Launch"
                            placeholderTextColor={
                                styles.placeholder.color
                            }
                            style={styles.input}
                        />

                        <Text style={styles.label}>
                            Email subject
                        </Text>

                        <TextInput
                            value={subject}
                            onChangeText={setSubject}
                            placeholder='Red Temples – New Single "..."'
                            placeholderTextColor={
                                styles.placeholder.color
                            }
                            style={styles.input}
                        />

                        <Text style={styles.label}>
                            Message
                        </Text>

                        <TextInput
                            value={emailBody}
                            onChangeText={setEmailBody}
                            multiline
                            textAlignVertical="top"
                            placeholder="Hi..."
                            placeholderTextColor={
                                styles.placeholder.color
                            }
                            style={[
                                styles.input,
                                styles.messageInput,
                            ]}
                        />
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            Attachment
                        </Text>

                        {attachment ? (
                            <View
                                style={
                                    styles.attachmentRow
                                }
                            >
                                <View>
                                    <Text
                                        style={
                                            styles.attachmentName
                                        }
                                    >
                                        {attachment.name}
                                    </Text>

                                    <Text
                                        style={
                                            styles.secondaryText
                                        }
                                    >
                                        {attachment.size
                                            ? `${(
                                                attachment.size /
                                                1024 /
                                                1024
                                            ).toFixed(
                                                2
                                            )} MB`
                                            : "MP3 selected"}
                                    </Text>
                                </View>

                                <Button
                                    title="Change MP3"
                                    variant="secondary"
                                    onPress={chooseAttachment}
                                    disabled={saving}
                                />
                            </View>
                        ) : (
                            <Button
                                title="Choose MP3"
                                variant="secondary"
                                onPress={
                                    chooseAttachment
                                }
                            />
                        )}
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            Recipients
                        </Text>

                        <Text style={styles.secondaryText}>
                            {recipients.length} selected
                        </Text>

                        <View
                            style={
                                styles.recipientList
                            }
                        >
                            {recipients.map(
                                (contact) => (
                                    <View
                                        key={
                                            contact.id
                                        }
                                        style={
                                            styles.recipientRow
                                        }
                                    >
                                        <Text
                                            style={
                                                styles.recipientOutlet
                                            }
                                        >
                                            {
                                                contact.outlet
                                            }
                                        </Text>

                                        <Text
                                            style={
                                                styles.secondaryText
                                            }
                                        >
                                            {contact.email}
                                        </Text>
                                    </View>
                                )
                            )}
                        </View>
                    </View>

                    {error && (
                        <Text style={styles.error}>
                            {error}
                        </Text>
                    )}

                    <View style={styles.actions}>
                        <Button
                            title="Cancel"
                            variant="secondary"
                            onPress={() =>
                                router.back()
                            }
                        />

                        <Button
                            title={
                                saveStatus === "saving"
                                    ? "Saving Draft..."
                                    : saveStatus === "uploading"
                                        ? "Uploading MP3..."
                                        : "Save Draft"
                            }
                            onPress={saveDraft}
                            disabled={saving}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}