import { useEffect, useMemo, useState } from "react";
import { router } from "expo-router";

import {
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";

import { Button } from "../../components/ui/Button";
import { usePrContacts } from "../../hooks/usePrContacts";
import { styles } from "./index.styles";

type Filter = "all" | "email" | "manual";

export default function PrContactsScreen() {

    const [page, setPage] = useState(1);

    const [pageSize, setPageSize] = useState<10 | 25>(25);

    const {
        data: contacts = [],
        isLoading,
        error,
    } = usePrContacts();

    const [search, setSearch] =
        useState("");

    const [filter, setFilter] =
        useState<Filter>("all");

    const [selectedIds, setSelectedIds] =
        useState<number[]>([]);

    const emailCount = useMemo(
        () =>
            contacts.filter(
                (contact) => !!contact.email
            ).length,
        [contacts]
    );

    const manualCount =
        contacts.length - emailCount;

    const filteredContacts = useMemo(() => {
        const query =
            search.trim().toLowerCase();

        return contacts.filter((contact) => {
            if (
                filter === "email" &&
                !contact.email
            ) {
                return false;
            }

            if (
                filter === "manual" &&
                contact.email
            ) {
                return false;
            }

            if (!query) {
                return true;
            }

            return [
                contact.outlet,
                contact.contactName,
                contact.email,
                contact.location,
                contact.contactType,
            ].some((value) =>
                value
                    ?.toLowerCase()
                    .includes(query)
            );
        });
    }, [contacts, filter, search]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredContacts.length / pageSize)
    );

    const paginatedContacts = useMemo(() => {
        const start = (page - 1) * pageSize;

        return filteredContacts.slice(
            start,
            start + pageSize
        );
    }, [
        filteredContacts,
        page,
        pageSize,
    ]);

    const visibleEmailIds = useMemo(
        () =>
            filteredContacts
                .filter((contact) => !!contact.email)
                .map((contact) => contact.id),
        [filteredContacts]
    );

    const allVisibleEmailSelected =
        visibleEmailIds.length > 0 &&
        visibleEmailIds.every((id) =>
            selectedIds.includes(id)
        );

    useEffect(() => {
        setPage(1);
    }, [search, filter, pageSize]);

    function toggleContact(id: number) {
        setSelectedIds((current) =>
            current.includes(id)
                ? current.filter(
                    (item) => item !== id
                )
                : [...current, id]
        );
    }

    function selectAllEmail() {
        const emailIds = filteredContacts
            .filter((contact) => !!contact.email)
            .map((contact) => contact.id);

        const allSelected =
            emailIds.length > 0 &&
            emailIds.every((id) =>
                selectedIds.includes(id)
            );

        if (allSelected) {
            setSelectedIds((current) =>
                current.filter(
                    (id) => !emailIds.includes(id)
                )
            );
        } else {
            setSelectedIds((current) => [
                ...new Set([
                    ...current,
                    ...emailIds,
                ]),
            ]);
        }
    }

    if (isLoading) {
        return (
            <View style={styles.screen}>
                <View style={styles.content}>
                    <Text style={styles.primaryText}>
                        Loading PR contacts...
                    </Text>
                </View>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.screen}>
                <View style={styles.content}>
                    <Text style={styles.primaryText}>
                        Unable to load PR contacts.
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
                        <View style={styles.headerRow}>
                            <View style={styles.headerTitle}>
                                <Text style={styles.title}>
                                    PR Contacts
                                </Text>

                                <Text style={styles.stats}>
                                    {contacts.length} contacts
                                    {" • "}
                                    {emailCount} email
                                    {" • "}
                                    {manualCount} manual
                                </Text>
                            </View>

                            <Button
                                title="Campaigns"
                                variant="secondary"
                                onPress={() =>
                                    router.push("/pr/campaigns")
                                }
                            />
                        </View>
                    </View>

                    <View style={styles.toolbar}>
                        <TextInput
                            value={search}
                            onChangeText={setSearch}
                            placeholder="Search contacts..."
                            placeholderTextColor="#777"
                            style={styles.searchInput}
                        />

                        {(
                            [
                                ["all", "All"],
                                ["email", "Email"],
                                ["manual", "Manual"],
                            ] as const
                        ).map(([value, label]) => {
                            const selected =
                                filter === value;

                            return (
                                <Pressable
                                    key={value}
                                    onPress={() =>
                                        setFilter(value)
                                    }
                                    style={[
                                        styles.filterButton,
                                        selected &&
                                        styles.filterButtonSelected,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.filterText,
                                            selected &&
                                            styles.filterTextSelected,
                                        ]}
                                    >
                                        {label}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>

                    <View style={styles.table}>
                        <View
                            style={[
                                styles.row,
                                styles.headerRow,
                            ]}
                        >
                            <View style={styles.checkbox} />

                            <Text
                                style={[
                                    styles.headerText,
                                    styles.outlet,
                                ]}
                            >
                                Outlet
                            </Text>

                            <Text
                                style={[
                                    styles.headerText,
                                    styles.contact,
                                ]}
                            >
                                Contact
                            </Text>

                            <Text
                                style={[
                                    styles.headerText,
                                    styles.email,
                                ]}
                            >
                                Email
                            </Text>

                            <Text
                                style={[
                                    styles.headerText,
                                    styles.location,
                                ]}
                            >
                                Location
                            </Text>

                            <Text
                                style={[
                                    styles.headerText,
                                    styles.method,
                                ]}
                            >
                                Method
                            </Text>
                        </View>

                        {paginatedContacts.map(
                            (contact) => {
                                const selected =
                                    selectedIds.includes(
                                        contact.id
                                    );

                                return (
                                    <View
                                        key={contact.id}
                                        style={styles.row}
                                    >
                                        <View
                                            style={
                                                styles.checkbox
                                            }
                                        >
                                            {contact.email && (
                                                <Pressable
                                                    onPress={() =>
                                                        toggleContact(
                                                            contact.id
                                                        )
                                                    }
                                                    style={[
                                                        styles.checkboxBox,
                                                        selected &&
                                                        styles.checkboxSelected,
                                                    ]}
                                                >
                                                    {selected && (
                                                        <Text
                                                            style={
                                                                styles.checkboxTick
                                                            }
                                                        >
                                                            ✓
                                                        </Text>
                                                    )}
                                                </Pressable>
                                            )}
                                        </View>

                                        <Text
                                            style={[
                                                styles.primaryText,
                                                styles.outlet,
                                            ]}
                                        >
                                            {contact.outlet}
                                        </Text>

                                        <Text
                                            style={[
                                                styles.secondaryText,
                                                styles.contact,
                                            ]}
                                        >
                                            {contact.contactName ??
                                                "—"}
                                        </Text>

                                        <Text
                                            style={[
                                                styles.secondaryText,
                                                styles.email,
                                            ]}
                                        >
                                            {contact.email ??
                                                "Manual / web form"}
                                        </Text>

                                        <Text
                                            style={[
                                                styles.secondaryText,
                                                styles.location,
                                            ]}
                                        >
                                            {contact.location ??
                                                "—"}
                                        </Text>

                                        <Text
                                            style={[
                                                styles.secondaryText,
                                                styles.method,
                                            ]}
                                        >
                                            {contact.email
                                                ? "Email"
                                                : "Manual"}
                                        </Text>
                                    </View>
                                );
                            }
                        )}

                        {filteredContacts.length ===
                            0 && (
                                <View style={styles.empty}>
                                    <Text
                                        style={
                                            styles.emptyText
                                        }
                                    >
                                        No PR contacts found.
                                    </Text>
                                </View>
                            )}
                    </View>

                    {/* Pagination controls */}
                    <View style={styles.pagination}>
                        <View style={styles.pageSizeControls}>
                            <Text style={styles.footerText}>
                                Rows:
                            </Text>

                            <Pressable
                                onPress={() => setPageSize(10)}
                                style={[
                                    styles.pageSizeButton,
                                    pageSize === 10 &&
                                    styles.pageSizeButtonSelected,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.pageSizeText,
                                        pageSize === 10 &&
                                        styles.pageSizeTextSelected,
                                    ]}
                                >
                                    10
                                </Text>
                            </Pressable>

                            <Pressable
                                onPress={() => setPageSize(25)}
                                style={[
                                    styles.pageSizeButton,
                                    pageSize === 25 &&
                                    styles.pageSizeButtonSelected,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.pageSizeText,
                                        pageSize === 25 &&
                                        styles.pageSizeTextSelected,
                                    ]}
                                >
                                    25
                                </Text>
                            </Pressable>
                        </View>

                        <View style={styles.pageControls}>
                            <Pressable
                                disabled={page === 1}
                                onPress={() =>
                                    setPage((current) =>
                                        Math.max(1, current - 1)
                                    )
                                }
                                style={[
                                    styles.pageButton,
                                    page === 1 &&
                                    styles.pageButtonDisabled,
                                ]}
                            >
                                <Text style={styles.pageButtonText}>
                                    Previous
                                </Text>
                            </Pressable>

                            <Text style={styles.footerText}>
                                {filteredContacts.length === 0
                                    ? "0 contacts"
                                    : `${(page - 1) * pageSize + 1}–${Math.min(
                                        page * pageSize,
                                        filteredContacts.length
                                    )} of ${filteredContacts.length}`}
                            </Text>

                            <Pressable
                                disabled={page >= totalPages}
                                onPress={() =>
                                    setPage((current) =>
                                        Math.min(
                                            totalPages,
                                            current + 1
                                        )
                                    )
                                }
                                style={[
                                    styles.pageButton,
                                    page >= totalPages &&
                                    styles.pageButtonDisabled,
                                ]}
                            >
                                <Text style={styles.pageButtonText}>
                                    Next
                                </Text>
                            </Pressable>
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <Pressable
                            onPress={selectAllEmail}
                            style={styles.selectAllButton}
                        >
                            <Text style={styles.selectAllButtonText}>
                                {allVisibleEmailSelected
                                    ? "Deselect All"
                                    : "Select All"}
                            </Text>
                        </Pressable>

                        <View style={styles.footerActions}>
                            <Text style={styles.footerText}>
                                {selectedIds.length} selected
                            </Text>

                            <Pressable
                                disabled={selectedIds.length === 0}
                                onPress={() => {
                                    router.push({
                                        pathname: "/pr/campaign/create",
                                        params: {
                                            contactIds:
                                                selectedIds.join(","),
                                        },
                                    });
                                }}
                                style={[
                                    styles.createButton,
                                    selectedIds.length === 0 &&
                                    styles.createButtonDisabled,
                                ]}
                            >
                                <Text style={styles.createButtonText}>
                                    Create Campaign
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}