import { encryptToken, decryptToken } from "./crypto";

const FREEBUSY_SCOPE =
    "https://www.googleapis.com/auth/calendar.freebusy";

function env(name: string): string {
    const value = process.env[name];

    if (!value) {
        throw new Error(
            `${name} is not configured`
        );
    }

    return value;
}

function clientCredentials() {
    return {
        clientId:
            env("GOOGLE_CLIENT_ID"),
        clientSecret:
            env("GOOGLE_CLIENT_SECRET"),
        redirectUri:
            env("GOOGLE_REDIRECT_URI"),
    };
}

export function createGoogleAuthorizationUrl(
    state: string
): string {
    const {
        clientId,
        redirectUri,
    } = clientCredentials();

    const params =
        new URLSearchParams({
            client_id: clientId,
            redirect_uri: redirectUri,
            response_type: "code",
            access_type: "offline",
            prompt: "consent",
            scope: FREEBUSY_SCOPE,
            state,
        });

    return (
        "https://accounts.google.com/o/oauth2/v2/auth?" +
        params.toString()
    );
}

export async function exchangeGoogleCode(
    code: string
) {
    const {
        clientId,
        clientSecret,
        redirectUri,
    } = clientCredentials();

    const tokenResponse =
        await fetch(
            "https://oauth2.googleapis.com/token",
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/x-www-form-urlencoded",
                },
                body:
                    new URLSearchParams({
                        code,
                        client_id: clientId,
                        client_secret:
                            clientSecret,
                        redirect_uri:
                            redirectUri,
                        grant_type:
                            "authorization_code",
                    }),
            }
        );

    const tokens =
        await tokenResponse.json();

    if (
        !tokenResponse.ok ||
        !tokens.refresh_token
    ) {
        throw new Error(
            tokens.error_description ??
                "Google did not return a refresh token."
        );
    }

    const userInfoResponse =
        await fetch(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            {
                headers: {
                    Authorization:
                        `Bearer ${tokens.access_token}`,
                },
            }
        );

    const userInfo =
        await userInfoResponse.json();

    if (!userInfoResponse.ok) {
        throw new Error(
            "Unable to retrieve Google account information."
        );
    }

    return {
        email:
            userInfo.email ??
            null,
        providerAccountId:
            userInfo.id ??
            null,
        encryptedRefreshToken:
            encryptToken(
                tokens.refresh_token
            ),
    };
}

async function getAccessToken(
    encryptedRefreshToken: string
) {
    const {
        clientId,
        clientSecret,
    } = clientCredentials();

    const response =
        await fetch(
            "https://oauth2.googleapis.com/token",
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/x-www-form-urlencoded",
                },
                body:
                    new URLSearchParams({
                        client_id: clientId,
                        client_secret:
                            clientSecret,
                        refresh_token:
                            decryptToken(
                                encryptedRefreshToken
                            ),
                        grant_type:
                            "refresh_token",
                    }),
            }
        );

    const body =
        await response.json();

    if (!response.ok) {
        throw new Error(
            body.error_description ??
                "Unable to refresh Google Calendar access."
        );
    }

    return body.access_token as string;
}

export async function getGoogleBusyPeriods(
    encryptedRefreshToken: string,
    from: Date,
    to: Date
) {
    const accessToken =
        await getAccessToken(
            encryptedRefreshToken
        );

    const response =
        await fetch(
            "https://www.googleapis.com/calendar/v3/freeBusy",
            {
                method: "POST",
                headers: {
                    Authorization:
                        `Bearer ${accessToken}`,
                    "Content-Type":
                        "application/json",
                },
                body: JSON.stringify({
                    timeMin:
                        from.toISOString(),
                    timeMax:
                        to.toISOString(),
                    items: [
                        {
                            id: "primary",
                        },
                    ],
                }),
            }
        );

    const body =
        await response.json();

    if (!response.ok) {
        throw new Error(
            body.error?.message ??
                "Unable to read Google Calendar availability."
        );
    }

    const busy =
        body.calendars?.primary?.busy ??
        [];

    return busy.map(
        (period: {
            start: string;
            end: string;
        }) => ({
            start:
                new Date(
                    period.start
                ),
            end:
                new Date(
                    period.end
                ),
        })
    );
}
