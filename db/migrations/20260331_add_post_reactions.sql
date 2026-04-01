CREATE TABLE IF NOT EXISTS post_reactions (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id INTEGER NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  reaction VARCHAR(16) NOT NULL CHECK (reaction IN ('❤️', '👍', '🙌', '🙏', '🥹', '💕')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, post_id)
);

CREATE INDEX IF NOT EXISTS idx_post_reactions_post_id ON post_reactions(post_id);
