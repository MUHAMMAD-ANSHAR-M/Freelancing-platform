-- =========================================================
-- Freelancing Platform — Relational Schema (MySQL / PostgreSQL)
-- Notes:
--   * UUID defaults shown for PostgreSQL (uuid-ossp). For MySQL,
--     swap `UUID DEFAULT gen_random_uuid()` for `CHAR(36)` and
--     generate UUIDs in the application layer, or use AUTO_INCREMENT
--     integer IDs instead — both are noted inline.
-- =========================================================

-- Enable UUID generation on PostgreSQL:
-- CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),  -- MySQL: CHAR(36) PRIMARY KEY
    name            VARCHAR(120)  NOT NULL,
    email           VARCHAR(160)  NOT NULL UNIQUE,
    password_hash   VARCHAR(255)  NOT NULL,
    role            VARCHAR(20)   NOT NULL DEFAULT 'freelancer'
                        CHECK (role IN ('client', 'freelancer', 'admin')),
    title           VARCHAR(160),
    bio             TEXT,
    hourly_rate     DECIMAL(10,2) DEFAULT 0,
    rating_average  DECIMAL(3,2)  DEFAULT 0,
    rating_count    INT           DEFAULT 0,
    is_active       BOOLEAN       DEFAULT TRUE,
    created_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE skills (
    id      SERIAL PRIMARY KEY,
    name    VARCHAR(80) NOT NULL UNIQUE
);

CREATE TABLE user_skills (
    user_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill_id  INT  NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, skill_id)
);

CREATE TABLE portfolio_items (
    id           SERIAL PRIMARY KEY,
    user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title        VARCHAR(160) NOT NULL,
    description  TEXT,
    link         VARCHAR(255),
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE jobs (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assigned_freelancer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    title                 VARCHAR(160) NOT NULL,
    description           TEXT NOT NULL,
    budget                DECIMAL(10,2) NOT NULL CHECK (budget > 0),
    category              VARCHAR(80) NOT NULL,
    status                VARCHAR(20) NOT NULL DEFAULT 'open'
                              CHECK (status IN ('open', 'in-progress', 'completed', 'cancelled')),
    created_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE job_skills (
    job_id    UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    skill_id  INT  NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    PRIMARY KEY (job_id, skill_id)
);

CREATE TABLE proposals (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id          UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    freelancer_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    cover_letter    TEXT NOT NULL,
    bid_amount      DECIMAL(10,2) NOT NULL CHECK (bid_amount > 0),
    estimated_days  INT,
    status          VARCHAR(20) NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (job_id, freelancer_id)
);

CREATE TABLE messages (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id        UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    sender_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipient_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content       TEXT NOT NULL,
    read_at       TIMESTAMP,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payments (
    id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id                   UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    client_id                UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    freelancer_id            UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount                   DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    currency                 VARCHAR(10) DEFAULT 'usd',
    stripe_payment_intent_id VARCHAR(120),
    status                   VARCHAR(20) NOT NULL DEFAULT 'pending'
                                 CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')),
    created_at               TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reviews (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id      UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reviewee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating      SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment     TEXT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (job_id, reviewer_id)
);

-- =========================================================
-- Indexes for common query patterns
-- =========================================================
CREATE INDEX idx_jobs_status_category ON jobs(status, category);
CREATE INDEX idx_jobs_client ON jobs(client_id);
CREATE INDEX idx_proposals_job ON proposals(job_id);
CREATE INDEX idx_proposals_freelancer ON proposals(freelancer_id);
CREATE INDEX idx_messages_job ON messages(job_id, created_at);
CREATE INDEX idx_payments_job ON payments(job_id);
CREATE INDEX idx_reviews_reviewee ON reviews(reviewee_id);

-- =========================================================
-- MySQL variant notes:
--   * Replace UUID PRIMARY KEY DEFAULT gen_random_uuid() with:
--       id CHAR(36) PRIMARY KEY  -- set via UUID() in application code
--     or use INT AUTO_INCREMENT PRIMARY KEY for simpler numeric keys.
--   * Replace CHECK (...) role/status constraints with ENUM(...) columns
--     if targeting MySQL versions where CHECK is not enforced (<8.0.16).
--   * TIMESTAMP DEFAULT CURRENT_TIMESTAMP works the same in MySQL 8+.
-- =========================================================
