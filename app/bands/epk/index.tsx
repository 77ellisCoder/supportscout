import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

import * as DocumentPicker from "expo-document-picker";

import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { Button } from "../../../components/ui/Button";
import { FieldLabel } from "../../../components/ui/FieldLabel";
import { ScreenActionBar } from "../../../components/ui/ScreenActionBar";
import { useBand } from "../../../hooks/useBand";
import { styles } from "../../../styles/band-epk.styles";
import { detailStyles } from "../../../styles/shared/details.styles";
import { layoutStyles } from "../../../styles/shared/layout.styles";
import { colors } from "../../../theme";
import { createBandEpkArchive } from "../../../utils/epk";

type PickedFile = {
  name: string;
  uri: string;
  size?: number | null;
  mimeType?: string | null;
};

export default function BandEpkScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: band, isLoading, error } = useBand(Number(id));

  const [bioDraft, setBioDraft] = useState<string | null>(null);
  const [pressReleaseDraft, setPressReleaseDraft] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<PickedFile | null>(null);
  const [photoFiles, setPhotoFiles] = useState<PickedFile[]>([]);
  const [songFiles, setSongFiles] = useState<PickedFile[]>([]);
  const [additionalFiles, setAdditionalFiles] = useState<PickedFile[]>([]);
  const [isPicking, setIsPicking] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackIsError, setFeedbackIsError] = useState(false);

  useEffect(() => {
    if (
      Platform.OS !== "web" ||
      !feedback ||
      feedbackIsError
    ) {
      return;
    }

    const timeout = window.setTimeout(
      () => setFeedback(null),
      4000
    );

    return () => window.clearTimeout(timeout);
  }, [feedback, feedbackIsError]);

  async function chooseFiles(
    type: string,
    multiple: boolean
  ): Promise<PickedFile[]> {
    setFeedback(null);
    setIsPicking(true);

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type,
        multiple,
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return [];
      }

      return result.assets.map((asset) => ({
        name: asset.name,
        uri: asset.uri,
        size: asset.size,
        mimeType: asset.mimeType,
      }));
    } catch (pickError) {
      setFeedback(
        pickError instanceof Error
          ? pickError.message
          : "Unable to select files."
      );
      setFeedbackIsError(true);
      return [];
    } finally {
      setIsPicking(false);
    }
  }

  async function chooseLogo() {
    const [file] = await chooseFiles("image/*", false);
    if (file) setLogoFile(file);
  }

  async function choosePhotos() {
    const files = await chooseFiles("image/*", true);
    if (files.length) setPhotoFiles((current) => [...current, ...files]);
  }

  async function chooseSongs() {
    const files = await chooseFiles("audio/*", true);
    if (files.length) setSongFiles((current) => [...current, ...files]);
  }

  async function chooseAdditionalFiles() {
    const files = await chooseFiles("*/*", true);
    if (files.length) setAdditionalFiles((current) => [...current, ...files]);
  }

  async function createEpk() {
    if (!band) return;

    const bioText = bioDraft ?? band.shortDescription ?? "";
    const pressReleaseText = pressReleaseDraft ?? "";

    if (!hasRequiredEpkFields({
      bioText,
      pressReleaseText,
      logoFile,
      photoFiles,
      songFiles,
    })) {
      setFeedback(
        "Complete the band bio and press release, choose a logo and press image, and add at least one music file before exporting."
      );
      setFeedbackIsError(true);
      return;
    }

    try {
      setIsCreating(true);
      setFeedback(null);

      const result = await createBandEpkArchive({
        bandName: band.bandName,
        bioText,
        pressReleaseText,
        logoFile,
        photoFiles,
        songFiles,
        additionalFiles,
      });

      if (Platform.OS === "web") {
        setFeedbackIsError(false);
        setFeedback(`Download started: ${result.fileName}`);
      } else {
        Alert.alert("EPK created", `Saved as ${result.fileName}`);
      }
    } catch (createError) {
      setFeedback(
        createError instanceof Error
          ? createError.message
          : "Unable to create the EPK archive."
      );
      setFeedbackIsError(true);
    } finally {
      setIsCreating(false);
    }
  }

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primaryLight} />
        <Text style={styles.loadingText}>Loading band...</Text>
      </View>
    );
  }

  if (error || !band) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          {error?.message ?? "Unable to load band details."}
        </Text>
      </View>
    );
  }

  const bioText = bioDraft ?? band.shortDescription ?? "";
  const pressReleaseText = pressReleaseDraft ?? "";
  const canCreateEpk = hasRequiredEpkFields({
    bioText,
    pressReleaseText,
    logoFile,
    photoFiles,
    songFiles,
  });
  const pickerDisabled = isPicking || isCreating;

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={layoutStyles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={detailStyles.hero}>
          <Text style={detailStyles.eyebrow}>ELECTRONIC PRESS KIT</Text>
          <Text style={detailStyles.title}>{band.bandName}</Text>
        </View>

        <View style={detailStyles.section}>
          <FieldLabel label="BAND BIO" required style={detailStyles.sectionLabel} />
          <TextInput
            accessibilityLabel="Band bio"
            multiline
            value={bioText}
            onChangeText={setBioDraft}
            placeholder="Write the band bio"
            placeholderTextColor={colors.textMuted}
            style={styles.textArea}
            textAlignVertical="top"
          />
        </View>

        <View style={detailStyles.section}>
          <FieldLabel label="PRESS RELEASE" required style={detailStyles.sectionLabel} />
          <TextInput
            accessibilityLabel="Press release"
            multiline
            value={pressReleaseText}
            onChangeText={setPressReleaseDraft}
            placeholder="Write the press release"
            placeholderTextColor={colors.textMuted}
            style={[styles.textArea, styles.pressReleaseInput]}
            textAlignVertical="top"
          />
        </View>

        <View style={detailStyles.section}>
          <FieldLabel label="LOGO" required style={detailStyles.sectionLabel} />
          <Button
            title={logoFile ? "Replace logo" : "Choose logo"}
            variant="secondary"
            disabled={pickerDisabled}
            loading={isPicking}
            onPress={chooseLogo}
          />
          {logoFile && (
            <FileRow
              file={logoFile}
              onRemove={() => setLogoFile(null)}
            />
          )}
        </View>

        <AssetSection
          title="PRESS IMAGES"
          required
          files={photoFiles}
          buttonTitle="Add images"
          disabled={pickerDisabled}
          onChoose={choosePhotos}
          onRemove={(index) => setPhotoFiles((current) => current.filter((_, itemIndex) => itemIndex !== index))}
        />

        <AssetSection
          title="MUSIC"
          required
          helperText="At least one music file is required."
          files={songFiles}
          buttonTitle="Add audio file(s)"
          disabled={pickerDisabled}
          onChoose={chooseSongs}
          onRemove={(index) => setSongFiles((current) => current.filter((_, itemIndex) => itemIndex !== index))}
        />

        <AssetSection
          title="ADDITIONAL MATERIALS"
          files={additionalFiles}
          buttonTitle="Add files"
          disabled={pickerDisabled}
          onChoose={chooseAdditionalFiles}
          onRemove={(index) => setAdditionalFiles((current) => current.filter((_, itemIndex) => itemIndex !== index))}
        />

        {feedback && (
          <Text
            accessibilityRole="alert"
            style={feedbackIsError ? styles.errorText : styles.successText}
          >
            {feedback}
          </Text>
        )}
      </ScrollView>

      <ScreenActionBar>
        <Button
          title="Create EPK"
          loading={isCreating}
          disabled={isPicking || !canCreateEpk}
          onPress={createEpk}
        />
      </ScreenActionBar>
    </View>
  );
}

function hasRequiredEpkFields({
  bioText,
  pressReleaseText,
  logoFile,
  photoFiles,
  songFiles,
}: {
  bioText: string;
  pressReleaseText: string;
  logoFile: PickedFile | null;
  photoFiles: PickedFile[];
  songFiles: PickedFile[];
}): boolean {
  return Boolean(
    bioText.trim() &&
    pressReleaseText.trim() &&
    logoFile &&
    photoFiles.length > 0 &&
    songFiles.length > 0
  );
}

function AssetSection({
  title,
  required = false,
  helperText,
  files,
  buttonTitle,
  disabled,
  onChoose,
  onRemove,
}: {
  title: string;
  required?: boolean;
  helperText?: string;
  files: PickedFile[];
  buttonTitle: string;
  disabled: boolean;
  onChoose: () => void;
  onRemove: (index: number) => void;
}) {
  return (
    <View style={detailStyles.section}>
      <FieldLabel label={title} required={required} style={detailStyles.sectionLabel} />
      {helperText && (
        <Text style={styles.helperText}>{helperText}</Text>
      )}
      <Button
        title={buttonTitle}
        variant="secondary"
        disabled={disabled}
        onPress={onChoose}
      />
      {files.map((file, index) => (
        <FileRow
          key={`${file.uri}-${index}`}
          file={file}
          onRemove={() => onRemove(index)}
        />
      ))}
    </View>
  );
}

function FileRow({
  file,
  onRemove,
}: {
  file: PickedFile;
  onRemove: () => void;
}) {
  return (
    <View style={styles.fileRow}>
      <View style={styles.fileInfo}>
        <Text style={styles.fileName} numberOfLines={1}>{file.name}</Text>
        {file.size != null && (
          <Text style={styles.fileSize}>{formatFileSize(file.size)}</Text>
        )}
      </View>
      <Button title="Remove" variant="ghost" onPress={onRemove} />
    </View>
  );
}

function formatFileSize(size: number): string {
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}
