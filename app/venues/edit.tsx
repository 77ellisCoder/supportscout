import { router, useLocalSearchParams } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";

import type { Venue, VenueStatus } from "../../models/Venue";
import { VenueRepository } from "../../repositories/VenueRepository";
import { colors } from "../../theme";
import { styles } from "../../styles/venue-edit.styles";

export default function EditVenueScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();

  const venueId = Number(id);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [venueName, setVenueName] = useState("");
  const [suburb, setSuburb] = useState("");
  const [address, setAddress] = useState("");
  const [capacity, setCapacity] = useState("");
  const [venueType, setVenueType] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [bookingUrl, setBookingUrl] = useState("");
  const [bookingEmail, setBookingEmail] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [internalNotes, setInternalNotes] = useState("");
  const [status, setStatus] = useState<VenueStatus>("active");
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    async function loadVenue() {
      try {
        setLoading(true);
        setError(null);

        if (!Number.isFinite(venueId)) {
          throw new Error("Invalid venue ID.");
        }

        const venue = await VenueRepository.getById(venueId);

        if (!venue) {
          throw new Error("Venue not found.");
        }

        setVenueName(venue.venueName);
        setSuburb(venue.suburb ?? "");
        setAddress(venue.address ?? "");
        setCapacity(
          venue.capacity != null
            ? String(venue.capacity)
            : ""
        );
        setVenueType(venue.venueType ?? "");
        setWebsiteUrl(venue.websiteUrl ?? "");
        setBookingUrl(venue.bookingUrl ?? "");
        setBookingEmail(venue.bookingEmail ?? "");
        setShortDescription(venue.shortDescription ?? "");
        setInternalNotes(venue.internalNotes ?? "");
        setStatus(venue.status);
        setIsVerified(venue.isVerified);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load venue."
        );
      } finally {
        setLoading(false);
      }
    }

    loadVenue();
  }, [venueId]);

  async function handleSave() {
    if (!venueName.trim()) {
      setError("Venue name is required.");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const parsedCapacity =
        capacity.trim().length > 0
          ? Number(capacity)
          : null;

      if (
        parsedCapacity != null &&
        !Number.isFinite(parsedCapacity)
      ) {
        setError("Capacity must be a number.");
        return;
      }

      await VenueRepository.update(venueId, {
        venueName: venueName.trim(),
        suburb: suburb.trim() || null,
        address: address.trim() || null,
        capacity: parsedCapacity,
        venueType: venueType.trim() || null,
        websiteUrl: websiteUrl.trim() || null,
        bookingUrl: bookingUrl.trim() || null,
        bookingEmail: bookingEmail.trim() || null,
        shortDescription:
          shortDescription.trim() || null,
        internalNotes:
          internalNotes.trim() || null,
        status,
        isVerified,
      });

      await queryClient.invalidateQueries({
        queryKey: ["venues"],
      });

      router.replace(`/venues/${venueId}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save venue."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primaryLight} />
        <Text style={styles.loadingText}>
          Loading venue...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.eyebrow}>
        EDIT VENUE
      </Text>

      <Text style={styles.title}>
        Venue details
      </Text>

      {error && (
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>
            {error}
          </Text>
        </View>
      )}

      <Field
        label="Venue name"
        value={venueName}
        onChangeText={setVenueName}
      />

      <Field
        label="Suburb"
        value={suburb}
        onChangeText={setSuburb}
      />

      <Field
        label="Address"
        value={address}
        onChangeText={setAddress}
      />

      <Field
        label="Capacity"
        value={capacity}
        onChangeText={setCapacity}
        keyboardType="number-pad"
      />

      <Field
        label="Venue type"
        value={venueType}
        onChangeText={setVenueType}
        placeholder="live_music_bar"
      />

      <Field
        label="Website"
        value={websiteUrl}
        onChangeText={setWebsiteUrl}
        keyboardType="url"
        autoCapitalize="none"
      />

      <Field
        label="Booking URL"
        value={bookingUrl}
        onChangeText={setBookingUrl}
        keyboardType="url"
        autoCapitalize="none"
      />

      <Field
        label="Booking email"
        value={bookingEmail}
        onChangeText={setBookingEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Field
        label="Description"
        value={shortDescription}
        onChangeText={setShortDescription}
        multiline
      />

      <Field
        label="Internal notes"
        value={internalNotes}
        onChangeText={setInternalNotes}
        multiline
      />

      <View style={styles.section}>
        <Text style={styles.fieldLabel}>
          Status
        </Text>

        <View style={styles.statusRow}>
          {(
            [
              "active",
              "inactive",
              "closed",
              "unknown",
            ] as VenueStatus[]
          ).map((value) => (
            <Pressable
              key={value}
              onPress={() => setStatus(value)}
              style={[
                styles.statusChip,
                status === value &&
                styles.statusChipSelected,
              ]}
            >
              <Text
                style={[
                  styles.statusChipText,
                  status === value &&
                  styles.statusChipTextSelected,
                ]}
              >
                {value}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.switchRow}>
        <View>
          <Text style={styles.fieldLabel}>
            Verified
          </Text>

          <Text style={styles.helperText}>
            Mark this venue as verified research.
          </Text>
        </View>

        <Switch
          value={isVerified}
          onValueChange={setIsVerified}
          trackColor={{
            false: colors.border,
            true: colors.primary,
          }}
        />
      </View>

      <Pressable
        disabled={saving}
        onPress={handleSave}
        style={({ pressed }) => [
          styles.saveButton,
          pressed && styles.saveButtonPressed,
          saving && styles.saveButtonDisabled,
        ]}
      >
        {saving ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Text style={styles.saveButtonText}>
            Save Venue
          </Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  keyboardType?: React.ComponentProps<
    typeof TextInput
  >["keyboardType"];
  autoCapitalize?: React.ComponentProps<
    typeof TextInput
  >["autoCapitalize"];
};

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  keyboardType,
  autoCapitalize,
}: FieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>
        {label}
      </Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        multiline={multiline}
        style={[
          styles.input,
          multiline && styles.textArea,
        ]}
      />
    </View>
  );
}