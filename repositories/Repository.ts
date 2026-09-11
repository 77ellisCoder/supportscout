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
    DrinkTokenRepository,
    BandRepository,
    GenreRepository,
    GigRepository,
    VenueRepository,
} = repositories;


// TODO: server/web only for now
export {
    PrCampaignRepository,
    PrContactRepository,
} from "./web";