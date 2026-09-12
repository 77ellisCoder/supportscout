export type BusyPeriod = {
    start: Date;
    end: Date;
};

export type CalendarProvider =
    | "google"
    | "icloud";