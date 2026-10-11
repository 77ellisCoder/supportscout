BEGIN;

CREATE TABLE user_roles (
    user_id BIGINT NOT NULL
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    role TEXT NOT NULL
        CHECK (role IN ('system_admin')),

    created_at TIMESTAMPTZ NOT NULL
        DEFAULT NOW(),

    PRIMARY KEY (user_id, role)
);

CREATE INDEX idx_user_roles_role_user
ON user_roles (role, user_id);

ALTER TABLE user_bands
    ADD COLUMN band_role TEXT NOT NULL
        DEFAULT 'member'
        CHECK (band_role IN ('member', 'band_admin'));

INSERT INTO user_roles (
    user_id,
    role
)
SELECT
    user_id,
    'system_admin'
FROM users
WHERE LOWER(email) = LOWER('77.ellis.christopher@gmail.com')
ON CONFLICT (user_id, role)
DO NOTHING;

COMMIT;