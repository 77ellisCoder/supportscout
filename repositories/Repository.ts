import { Platform } from "react-native";

import {
    BandRepository as DeviceBandRepository,
} from "./device/BandRepository";
import {
    GenreRepository as DeviceGenreRepository,
} from "./device/GenreRepository";
import {
    GigRepository as DeviceGigRepository,
} from "./device/GigRepository";
import {
    VenueRepository as DeviceVenueRepository,
} from "./device/VenueRepository";
import {
    PrCampaignRepository as DevicePrCampaignRepository
} from "./device/PrCampaignRepository"
import {
    PrContactRepository as DevicePrContactRepository
} from "./device/PrContactRepository"

import {
    BandRepository as WebBandRepository,
} from "./web/BandRepository";
import {
    GenreRepository as WebGenreRepository,
} from "./web/GenreRepository";
import {
    GigRepository as WebGigRepository,
} from "./web/GigRepository";
import {
    VenueRepository as WebVenueRepository,
} from "./web/VenueRepository";
import {
    PrCampaignRepository as WebPrCampaignRepository
} from "./web/PrCampaignRepository"
import {
    PrContactRepository as WebPrContactRepository
} from "./web/PrContactRepository"

const isWeb = Platform.OS === "web";

export const BandRepository =
    isWeb
        ? WebBandRepository
        : DeviceBandRepository;

export const GenreRepository =
    isWeb
        ? WebGenreRepository
        : DeviceGenreRepository;

export const GigRepository =
    isWeb
        ? WebGigRepository
        : DeviceGigRepository;

export const PrCampaignRepository =
    isWeb
        ? WebPrCampaignRepository
        : DevicePrCampaignRepository

export const PrContactRepository =
    isWeb
        ? WebPrContactRepository
        : DevicePrContactRepository

export const VenueRepository =
    isWeb
        ? WebVenueRepository
        : DeviceVenueRepository;