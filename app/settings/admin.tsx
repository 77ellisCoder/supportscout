import { useEffect, useMemo, useState } from "react";
import { router } from "expo-router";
import {
    ActivityIndicator,
    Alert,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "../../components/ui/Button";
import { ScreenActionBar } from "../../components/ui/ScreenActionBar";
import { AdminService, type AdminBandMember } from "../../services/admin/AdminService";
import { colors } from "../../theme";
import { styles } from "../../styles/admin.styles";

export default function AdminScreen() {
    const queryClient = useQueryClient();
    const [selectedBandId, setSelectedBandId] = useState<number | null>(null);
    const [userSearch, setUserSearch] = useState("");
    const [memberSearch, setMemberSearch] = useState("");

    const accessQuery = useQuery({
        queryKey: ["admin", "me"],
        queryFn: AdminService.getAccess,
    });
    const systemAdmin = accessQuery.data?.systemAdmin ?? false;
    const hasAccess = systemAdmin || (accessQuery.data?.bandAdminIds.length ?? 0) > 0;

    const bandsQuery = useQuery({
        queryKey: ["admin", "bands"],
        queryFn: AdminService.getBands,
        enabled: hasAccess,
    });
    const usersQuery = useQuery({
        queryKey: ["admin", "users"],
        queryFn: AdminService.getUsers,
        enabled: systemAdmin,
    });

    useEffect(() => {
        const bands = bandsQuery.data ?? [];
        if (bands.length > 0 && !bands.some((band) => band.bandId === selectedBandId)) {
            setSelectedBandId(bands[0].bandId);
        }
    }, [bandsQuery.data, selectedBandId]);

    const membersQuery = useQuery({
        queryKey: ["admin", "band-members", selectedBandId],
        queryFn: () => AdminService.getBandMembers(selectedBandId ?? 0),
        enabled: hasAccess && selectedBandId !== null,
    });
    const availableUsersQuery = useQuery({
        queryKey: ["admin", "available-band-users", selectedBandId, memberSearch],
        queryFn: () => AdminService.getAvailableBandUsers(selectedBandId ?? 0, memberSearch),
        enabled: hasAccess && selectedBandId !== null,
    });

    const filteredUsers = useMemo(() => {
        const term = userSearch.trim().toLowerCase();
        return (usersQuery.data ?? []).filter((user) =>
            !term ||
            user.email.toLowerCase().includes(term) ||
            (user.displayName ?? "").toLowerCase().includes(term)
        );
    }, [usersQuery.data, userSearch]);

    const refreshUsers = () =>
        queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    const refreshBand = () => {
        void queryClient.invalidateQueries({
            queryKey: ["admin", "band-members", selectedBandId],
        });
        void queryClient.invalidateQueries({
            queryKey: ["admin", "available-band-users", selectedBandId],
        });
    };

    const setSystemAdmin = useMutation({
        mutationFn: ({ userId, enabled }: { userId: number; enabled: boolean }) =>
            AdminService.setSystemAdmin(userId, enabled),
        onSuccess: refreshUsers,
    });
    const addMember = useMutation({
        mutationFn: (userId: number) =>
            AdminService.addBandMember(selectedBandId ?? 0, userId),
        onSuccess: refreshBand,
    });
    const changeBandRole = useMutation({
        mutationFn: ({ userId, bandRole }: {
            userId: number;
            bandRole: AdminBandMember["bandRole"];
        }) => AdminService.setBandRole(selectedBandId ?? 0, userId, bandRole),
        onSuccess: refreshBand,
    });
    const removeMember = useMutation({
        mutationFn: (userId: number) =>
            AdminService.removeBandMember(selectedBandId ?? 0, userId),
        onSuccess: refreshBand,
    });

    function confirmRemoveMember(member: AdminBandMember) {
        const remove = () => removeMember.mutate(member.userId);
        const name = member.displayName ?? member.email;

        if (Platform.OS === "web") {
            if (window.confirm(`Remove ${name} from this band?`)) remove();
            return;
        }

        Alert.alert("Remove band member?", `Remove ${name} from this band?`, [
            { text: "Cancel", style: "cancel" },
            { text: "Remove", style: "destructive", onPress: remove },
        ]);
    }

    const queryError =
        accessQuery.error ??
        bandsQuery.error ??
        usersQuery.error ??
        membersQuery.error ??
        availableUsersQuery.error;
    const mutationError =
        setSystemAdmin.error ??
        addMember.error ??
        changeBandRole.error ??
        removeMember.error;

    if (accessQuery.isLoading) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator color={colors.primaryLight} />
            </View>
        );
    }

    if (!hasAccess) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Admin access required</Text>
                <Text style={styles.description}>
                    You need system-admin or band-admin access to manage members.
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.screen}>
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.header}>
                    <Text style={styles.title}>Administration</Text>
                    <Text style={styles.description}>
                        Manage global access and band membership.
                    </Text>
                </View>

                {queryError && (
                    <Text accessibilityRole="alert" style={styles.error}>
                        {queryError instanceof Error
                            ? queryError.message
                            : "Unable to load administration data."}
                    </Text>
                )}
                {mutationError && (
                    <Text accessibilityRole="alert" style={styles.error}>
                        {mutationError instanceof Error
                            ? mutationError.message
                            : "Unable to update access."}
                    </Text>
                )}

                {systemAdmin && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>SYSTEM ADMINS</Text>
                        <TextInput
                            accessibilityLabel="Search users for system-admin access"
                            value={userSearch}
                            onChangeText={setUserSearch}
                            placeholder="Search users..."
                            placeholderTextColor={colors.textMuted}
                            style={styles.input}
                        />
                        {usersQuery.isLoading ? (
                            <ActivityIndicator color={colors.primaryLight} />
                        ) : (
                            <View style={styles.list}>
                                {filteredUsers.map((user) => (
                                    <View key={user.userId} style={styles.row}>
                                        <View style={styles.userDetails}>
                                            <Text style={styles.userName}>
                                                {user.displayName ?? user.email}
                                            </Text>
                                            {user.displayName && (
                                                <Text style={styles.secondaryText}>
                                                    {user.email}
                                                </Text>
                                            )}
                                        </View>
                                        <Button
                                            title={user.systemAdmin ? "Remove admin" : "Make admin"}
                                            variant="secondary"
                                            disabled={
                                                setSystemAdmin.isPending ||
                                                (user.systemAdmin &&
                                                    usersQuery.data?.filter((item) => item.systemAdmin).length === 1)
                                            }
                                            onPress={() =>
                                                setSystemAdmin.mutate({
                                                    userId: user.userId,
                                                    enabled: !user.systemAdmin,
                                                })
                                            }
                                        />
                                    </View>
                                ))}
                                {filteredUsers.length === 0 && (
                                    <Text style={styles.empty}>No users found.</Text>
                                )}
                            </View>
                        )}
                    </View>
                )}

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>BAND MEMBERS</Text>
                    {bandsQuery.isLoading ? (
                        <ActivityIndicator color={colors.primaryLight} />
                    ) : (
                        <View style={styles.bandPicker}>
                            {(bandsQuery.data ?? []).map((band) => (
                                <Pressable
                                    key={band.bandId}
                                    accessibilityRole="button"
                                    accessibilityState={{
                                        selected: band.bandId === selectedBandId,
                                    }}
                                    onPress={() => setSelectedBandId(band.bandId)}
                                    style={[
                                        styles.bandOption,
                                        band.bandId === selectedBandId &&
                                            styles.bandOptionSelected,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.bandOptionText,
                                            band.bandId === selectedBandId &&
                                                styles.bandOptionTextSelected,
                                        ]}
                                    >
                                        {band.bandName}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    )}

                    {selectedBandId !== null && (
                        <>
                            {membersQuery.isLoading ? (
                                <ActivityIndicator color={colors.primaryLight} />
                            ) : (
                                <View style={styles.list}>
                                    {(membersQuery.data ?? []).map((member) => (
                                        <View key={member.userId} style={styles.row}>
                                            <View style={styles.userDetails}>
                                                <Text style={styles.userName}>
                                                    {member.displayName ?? member.email}
                                                </Text>
                                                {member.displayName && (
                                                    <Text style={styles.secondaryText}>
                                                        {member.email}
                                                    </Text>
                                                )}
                                                <Text style={styles.roleText}>
                                                    {member.bandRole.replace("_", " ")}
                                                </Text>
                                            </View>
                                            <View style={styles.rowActions}>
                                                {systemAdmin && (
                                                    <Button
                                                        title={member.bandRole === "band_admin"
                                                            ? "Demote"
                                                            : "Make admin"}
                                                        variant="secondary"
                                                        disabled={changeBandRole.isPending}
                                                        onPress={() =>
                                                            changeBandRole.mutate({
                                                                userId: member.userId,
                                                                bandRole: member.bandRole === "band_admin"
                                                                    ? "member"
                                                                    : "band_admin",
                                                            })
                                                        }
                                                    />
                                                )}
                                                <Button
                                                    title="Remove"
                                                    variant="ghost"
                                                    disabled={removeMember.isPending}
                                                    onPress={() => confirmRemoveMember(member)}
                                                />
                                            </View>
                                        </View>
                                    ))}
                                    {membersQuery.data?.length === 0 && (
                                        <Text style={styles.empty}>
                                            No members are linked to this band.
                                        </Text>
                                    )}
                                </View>
                            )}

                            <Text style={styles.subheading}>ADD A USER</Text>
                            <TextInput
                                accessibilityLabel="Search users to add to band"
                                value={memberSearch}
                                onChangeText={setMemberSearch}
                                placeholder="Search by name or email..."
                                placeholderTextColor={colors.textMuted}
                                style={styles.input}
                            />
                            {availableUsersQuery.isLoading ? (
                                <ActivityIndicator color={colors.primaryLight} />
                            ) : (
                                <View style={styles.list}>
                                    {(availableUsersQuery.data ?? []).map((user) => (
                                        <View key={user.userId} style={styles.row}>
                                            <View style={styles.userDetails}>
                                                <Text style={styles.userName}>
                                                    {user.displayName ?? user.email}
                                                </Text>
                                                {user.displayName && (
                                                    <Text style={styles.secondaryText}>
                                                        {user.email}
                                                    </Text>
                                                )}
                                            </View>
                                            <Button
                                                title="Add"
                                                variant="secondary"
                                                disabled={addMember.isPending}
                                                onPress={() => addMember.mutate(user.userId)}
                                            />
                                        </View>
                                    ))}
                                    {availableUsersQuery.data?.length === 0 && (
                                        <Text style={styles.empty}>
                                            No matching users available.
                                        </Text>
                                    )}
                                </View>
                            )}
                        </>
                    )}
                </View>
            </ScrollView>

            <ScreenActionBar>
                <Button title="Back" variant="ghost" onPress={() => router.back()} />
            </ScreenActionBar>
        </View>
    );
}