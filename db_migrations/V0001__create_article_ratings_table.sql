CREATE TABLE IF NOT EXISTS article_ratings (
    id SERIAL PRIMARY KEY,
    article_id INTEGER NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(article_id)
);