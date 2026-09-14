CREATE TABLE user_auth_identities (
    user_auth_identity_id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    provider VARCHAR(50) NOT NULL,

    provider_user_id TEXT NOT NULL,

    email TEXT,

    created_at TIMESTAMPTZ NOT NULL
        DEFAULT NOW(),

    UNIQUE (
        provider,
        provider_user_id
    )
);