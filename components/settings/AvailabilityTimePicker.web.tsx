import React, {
    useMemo,
} from "react";

type Props = {
    value: string;

    onChange: (
        value: string
    ) => void;
};

const INTERVAL_MINUTES =
    30;

export function AvailabilityTimePicker({
    value,
    onChange,
}: Props) {
    const options =
        useMemo(
            () =>
                buildTimeOptions(
                    INTERVAL_MINUTES
                ),
            []
        );

    const normalizedValue =
        value.slice(
            0,
            5
        );

    return (
        <select
            value={
                normalizedValue
            }

            onChange={(
                event
            ) =>
                onChange(
                    event.target.value
                )
            }

            style={{
                minWidth:
                    110,

                height:
                    38,

                padding:
                    "0 12px",

                borderRadius:
                    9,

                border:
                    "1px solid #403650",

                background:
                    "#0b0910",

                color:
                    "#ffffff",

                fontSize:
                    14,

                fontWeight:
                    500,

                cursor:
                    "pointer",

                outline:
                    "none",

                colorScheme:
                    "dark",
            }}
        >
            {options.map(
                (
                    option
                ) => (
                    <option
                        key={
                            option.value
                        }

                        value={
                            option.value
                        }
                    >
                        {
                            option.label
                        }
                    </option>
                )
            )}
        </select>
    );
}

function buildTimeOptions(
    intervalMinutes: number
) {
    const result: {
        value: string;
        label: string;
    }[] = [];

    for (
        let minutes = 0;
        minutes <
        24 * 60;
        minutes +=
        intervalMinutes
    ) {
        const hours =
            Math.floor(
                minutes / 60
            );

        const mins =
            minutes % 60;

        const value =
            `${String(
                hours
            ).padStart(
                2,
                "0"
            )}:${String(
                mins
            ).padStart(
                2,
                "0"
            )}`;

        result.push({
            value,

            label:
                formatDisplayTime(
                    value
                ),
        });
    }

    result.push({
        value:
            "23:59",

        label:
            "Midnight",
    });

    return result;
}

function formatDisplayTime(
    value: string
): string {
    if (
        value ===
        "23:59"
    ) {
        return "Midnight";
    }

    const [
        hours,
        minutes,
    ] = value
        .split(":")
        .map(Number);

    const date =
        new Date();

    date.setHours(
        hours,
        minutes,
        0,
        0
    );

    return date.toLocaleTimeString(
        "en-AU",
        {
            hour:
                "numeric",

            minute:
                "2-digit",
        }
    );
}