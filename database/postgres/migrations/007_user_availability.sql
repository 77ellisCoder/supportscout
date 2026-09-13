CREATE TABLE user_availability_settings (
    user_id INTEGER PRIMARY KEY
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    minimum_minutes INTEGER NOT NULL
        DEFAULT 60,

    buffer_minutes INTEGER NOT NULL
        DEFAULT 30,

    timezone VARCHAR(100) NOT NULL
        DEFAULT 'Australia/Perth',

    updated_at TIMESTAMPTZ NOT NULL
        DEFAULT NOW()
);

CREATE TABLE user_availability_windows (
    availability_window_id
        SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    day_of_week SMALLINT NOT NULL
        CHECK (
            day_of_week BETWEEN 0 AND 6
        ),

    start_time TIME NOT NULL,

    end_time TIME NOT NULL,

    CHECK (
        start_time < end_time
    )
);

CREATE INDEX
    idx_user_availability_windows_user
ON user_availability_windows(user_id);

INSERT INTO user_availability_settings (
    user_id,
    minimum_minutes,
    buffer_minutes,
    timezone
)
VALUES (
    1,
    60,
    30,
    'Australia/Perth'
)
ON CONFLICT (user_id)
DO UPDATE SET
    minimum_minutes =
        EXCLUDED.minimum_minutes,
    buffer_minutes =
        EXCLUDED.buffer_minutes,
    timezone =
        EXCLUDED.timezone;

-- once tested, run:
-- DELETE FROM user_availability_windows
-- WHERE user_id = 1;

INSERT INTO user_availability_windows (
    user_id,
    day_of_week,
    start_time,
    end_time
)
VALUES
    (1, 1, '18:00', '23:00'),
    (1, 2, '18:00', '23:00'),
    (1, 3, '18:00', '23:00'),
    (1, 4, '18:00', '23:00'),
    (1, 5, '17:00', '23:59'),
    (1, 6, '09:00', '23:59'),
    (1, 0, '09:00', '22:00');