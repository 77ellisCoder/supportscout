CREATE TABLE user_auth_credentials (
    user_id BIGINT PRIMARY KEY
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    password_hash TEXT NOT NULL,

    created_at TIMESTAMPTZ NOT NULL
        DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL
        DEFAULT NOW()
);