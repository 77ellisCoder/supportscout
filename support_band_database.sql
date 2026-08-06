-- Perth Support Band Database
-- PostgreSQL 14+

CREATE SCHEMA IF NOT EXISTS supportbands;
SET search_path TO supportbands;

CREATE TABLE bands (
    band_id BIGSERIAL PRIMARY KEY,
    band_name VARCHAR(150) NOT NULL,
    slug VARCHAR(160) UNIQUE,
    hometown VARCHAR(100) DEFAULT 'Perth',
    state_region VARCHAR(100) DEFAULT 'Western Australia',
    country_code CHAR(2) DEFAULT 'AU',
    member_count SMALLINT,
    formation_year SMALLINT,
    status VARCHAR(30) NOT NULL DEFAULT 'active'
        CHECK (status IN ('active','inactive','hiatus','unknown')),
    short_description TEXT,
    internal_notes TEXT,
    is_our_band BOOLEAN NOT NULL DEFAULT FALSE,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    archived_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX uq_active_band_name
ON bands (LOWER(band_name))
WHERE archived_at IS NULL;

CREATE TABLE genres (
    genre_id BIGSERIAL PRIMARY KEY,
    genre_name VARCHAR(100) UNIQUE NOT NULL,
    parent_genre_id BIGINT REFERENCES genres(genre_id),
    description TEXT
);

CREATE TABLE band_genres (
    band_id BIGINT REFERENCES bands(band_id) ON DELETE CASCADE,
    genre_id BIGINT REFERENCES genres(genre_id),
    relevance SMALLINT DEFAULT 3 CHECK (relevance BETWEEN 1 AND 5),
    is_primary BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (band_id, genre_id)
);

CREATE TABLE artists (
    artist_id BIGSERIAL PRIMARY KEY,
    artist_name VARCHAR(150) NOT NULL,
    artist_type VARCHAR(30) DEFAULT 'reference'
      CHECK (artist_type IN ('local_band','reference','national','international')),
    related_band_id BIGINT REFERENCES bands(band_id),
    UNIQUE(LOWER(artist_name))
);

CREATE TABLE band_similar_artists (
    band_id BIGINT REFERENCES bands(band_id) ON DELETE CASCADE,
    artist_id BIGINT REFERENCES artists(artist_id) ON DELETE CASCADE,
    similarity_type VARCHAR(30) DEFAULT 'sound'
      CHECK (similarity_type IN ('sound','audience','influence','scene','stage_energy')),
    similarity_score NUMERIC(4,2) CHECK (similarity_score BETWEEN 0 AND 10),
    PRIMARY KEY (band_id,artist_id,similarity_type)
);

CREATE TABLE band_members (
    band_member_id BIGSERIAL PRIMARY KEY,
    band_id BIGINT REFERENCES bands(band_id) ON DELETE CASCADE,
    person_name VARCHAR(150),
    role_name VARCHAR(100),
    instrument VARCHAR(100),
    joined_on DATE,
    left_on DATE,
    is_current BOOLEAN DEFAULT TRUE,
    notes TEXT
);

CREATE TABLE band_contacts (
    contact_id BIGSERIAL PRIMARY KEY,
    band_id BIGINT REFERENCES bands(band_id) ON DELETE CASCADE,
    contact_name VARCHAR(150),
    contact_role VARCHAR(50),
    email VARCHAR(254),
    phone VARCHAR(50),
    preferred_method VARCHAR(30),
    is_primary BOOLEAN DEFAULT FALSE,
    permission_to_contact BOOLEAN DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE band_links (
    band_link_id BIGSERIAL PRIMARY KEY,
    band_id BIGINT REFERENCES bands(band_id) ON DELETE CASCADE,
    link_type VARCHAR(30) NOT NULL,
    url TEXT NOT NULL,
    follower_count INTEGER,
    checked_at TIMESTAMPTZ,
    UNIQUE(band_id,link_type,url)
);

CREATE TABLE venues (
    venue_id BIGSERIAL PRIMARY KEY,
    venue_name VARCHAR(150) NOT NULL,
    suburb VARCHAR(100),
    city VARCHAR(100) DEFAULT 'Perth',
    capacity INTEGER,
    venue_type VARCHAR(50),
    website_url TEXT,
    notes TEXT
);

CREATE TABLE performances (
    performance_id BIGSERIAL PRIMARY KEY,
    band_id BIGINT REFERENCES bands(band_id) ON DELETE CASCADE,
    venue_id BIGINT REFERENCES venues(venue_id),
    event_name VARCHAR(200),
    performance_date DATE,
    billing_position VARCHAR(30),
    related_headliner VARCHAR(150),
    attendance_estimate INTEGER,
    tickets_sold INTEGER,
    ticket_price NUMERIC(10,2),
    source_url TEXT,
    performance_status VARCHAR(20) DEFAULT 'confirmed',
    notes TEXT
);

CREATE TABLE band_metrics (
    band_metric_id BIGSERIAL PRIMARY KEY,
    band_id BIGINT REFERENCES bands(band_id) ON DELETE CASCADE,
    measured_on DATE DEFAULT CURRENT_DATE,
    estimated_draw_min INTEGER,
    estimated_draw_max INTEGER,
    estimated_draw_typical INTEGER,
    instagram_followers INTEGER,
    facebook_followers INTEGER,
    spotify_monthly_listeners INTEGER,
    confidence_level SMALLINT DEFAULT 3 CHECK (confidence_level BETWEEN 1 AND 5),
    notes TEXT
);

CREATE TABLE assessment_criteria (
    criterion_id BIGSERIAL PRIMARY KEY,
    criterion_code VARCHAR(50) UNIQUE,
    criterion_name VARCHAR(100),
    default_weight NUMERIC(6,3),
    maximum_score NUMERIC(6,2) DEFAULT 10,
    display_order SMALLINT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE
);

INSERT INTO assessment_criteria
(criterion_code,criterion_name,default_weight,display_order)
VALUES
('musical_fit','Musical Fit',0.25,1),
('audience_overlap','Audience Crossover',0.20,2),
('draw','Estimated Draw',0.15,3),
('momentum','Current Momentum',0.10,4),
('live_quality','Live Quality',0.10,5),
('professionalism','Professionalism',0.08,6),
('relationship','Relationship Strength',0.05,7),
('availability','Availability',0.04,8),
('location','Location',0.03,9);

CREATE TABLE lineup_assessments (
    assessment_id BIGSERIAL PRIMARY KEY,
    subject_band_id BIGINT REFERENCES bands(band_id) ON DELETE CASCADE,
    assessing_band_id BIGINT REFERENCES bands(band_id) ON DELETE CASCADE,
    criterion_id BIGINT REFERENCES assessment_criteria(criterion_id),
    score NUMERIC(6,2) CHECK(score BETWEEN 0 AND 10),
    confidence_level SMALLINT DEFAULT 3 CHECK(confidence_level BETWEEN 1 AND 5),
    assessed_by VARCHAR(150),
    assessed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    evidence TEXT,
    notes TEXT
);

CREATE TABLE events (
    event_id BIGSERIAL PRIMARY KEY,
    event_name VARCHAR(200),
    venue_id BIGINT REFERENCES venues(venue_id),
    event_date DATE,
    expected_capacity INTEGER,
    event_status VARCHAR(30) DEFAULT 'planning',
    notes TEXT
);

CREATE TABLE lineups (
    lineup_id BIGSERIAL PRIMARY KEY,
    event_id BIGINT REFERENCES events(event_id) ON DELETE CASCADE,
    lineup_name VARCHAR(150),
    description TEXT,
    is_selected BOOLEAN DEFAULT FALSE,
    projected_draw_min INTEGER,
    projected_draw_max INTEGER,
    calculated_score NUMERIC(8,3)
);

CREATE TABLE lineup_candidates (
    lineup_candidate_id BIGSERIAL PRIMARY KEY,
    lineup_id BIGINT REFERENCES lineups(lineup_id) ON DELETE CASCADE,
    band_id BIGINT REFERENCES bands(band_id) ON DELETE CASCADE,
    proposed_position VARCHAR(30),
    candidate_status VARCHAR(30) DEFAULT 'considering',
    proposed_fee NUMERIC(10,2),
    confirmed_fee NUMERIC(10,2),
    manual_rank INTEGER,
    notes TEXT,
    UNIQUE(lineup_id,band_id)
);

CREATE TABLE contact_history (
    contact_history_id BIGSERIAL PRIMARY KEY,
    band_id BIGINT REFERENCES bands(band_id) ON DELETE CASCADE,
    event_id BIGINT REFERENCES events(event_id),
    contact_id BIGINT REFERENCES band_contacts(contact_id),
    contact_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    contact_method VARCHAR(30),
    direction VARCHAR(10),
    subject VARCHAR(200),
    summary TEXT,
    follow_up_date DATE,
    response_status VARCHAR(30)
);

CREATE TABLE tags (
    tag_id BIGSERIAL PRIMARY KEY,
    tag_name VARCHAR(80) UNIQUE,
    tag_category VARCHAR(50)
);

CREATE TABLE band_tags (
    band_id BIGINT REFERENCES bands(band_id) ON DELETE CASCADE,
    tag_id BIGINT REFERENCES tags(tag_id) ON DELETE CASCADE,
    PRIMARY KEY (band_id,tag_id)
);

CREATE TABLE band_relationships (
    band_relationship_id BIGSERIAL PRIMARY KEY,
    band_a_id BIGINT REFERENCES bands(band_id),
    band_b_id BIGINT REFERENCES bands(band_id),
    audience_overlap_score NUMERIC(5,2),
    musical_compatibility_score NUMERIC(5,2),
    relationship_strength_score NUMERIC(5,2),
    have_shared_bill BOOLEAN DEFAULT FALSE,
    shared_bill_count INTEGER DEFAULT 0,
    notes TEXT,
    assessed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CHECK (band_a_id < band_b_id),
    UNIQUE(band_a_id,band_b_id)
);

CREATE VIEW band_ranking AS
SELECT
    la.subject_band_id,
    la.assessing_band_id,
    b.band_name,
    ROUND(
        100 * SUM(
            (la.score/ac.maximum_score)
            * ac.default_weight
            * (0.80 + la.confidence_level*0.04)
        ) / NULLIF(SUM(ac.default_weight),0),2
    ) AS calculated_score,
    COUNT(DISTINCT la.criterion_id) AS criteria_scored
FROM lineup_assessments la
JOIN assessment_criteria ac ON ac.criterion_id=la.criterion_id
JOIN bands b ON b.band_id=la.subject_band_id
GROUP BY la.subject_band_id,la.assessing_band_id,b.band_name;
