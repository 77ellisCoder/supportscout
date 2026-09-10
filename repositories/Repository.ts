import { Platform } from "react-native";

import * as DeviceRepositories
    from "./device";

import * as WebRepositories
    from "./web";

const repositories =
    Platform.OS === "web"
        ? WebRepositories
        : DeviceRepositories;

export const {
    BandRepository,
    GenreRepository,
    GigRepository,
    VenueRepository,
    PrCampaignRepository,
    PrContactRepository,
} = repositories;