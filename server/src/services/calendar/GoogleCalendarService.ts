import { encryptToken, decryptToken } from "./crypto";

const GOOGLE_SCOPES = [
    "openid",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/calendar.freebusy",
];

function clientCredentials() {
    return {
        clientId:
            process.env.GOOGLE_CLIENT_ID,
        clientSecret:
            process.env.GOOGLE_CLIENT_SECRET,
        redirectUri:
            process.env.GOOGLE_REDIRECT_URI,
    };
}

export function createGoogleAuthorizationUrl(
    state: string
): string {
    const {
        clientId,
        redirectUri,
    } = clientCredentials();

    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: "code",
        scope: GOOGLE_SCOPES.join(" "),
        access_type: "offline",
        prompt: "consent",
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

    console.log("Google token response:", {
        access_token_present: !!tokens.access_token,
        refresh_token_present: !!tokens.refresh_token,
        token_type: tokens.token_type,
        expires_in: tokens.expires_in,
        scope: tokens.scope,
    });

    const userInfoResponse = await fetch(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
            headers: {
                Authorization: `Bearer ${tokens.access_token}`,
            },
        }
    );

    if (!userInfoResponse.ok) {
        const errorText = await userInfoResponse.text();

        console.error(
            "Google UserInfo failed:",
            userInfoResponse.status,
            errorText
        );

        throw new Error(
            `Google UserInfo ${userInfoResponse.status}: ${errorText}`
        );
    }

    const userInfo = await userInfoResponse.json();

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
