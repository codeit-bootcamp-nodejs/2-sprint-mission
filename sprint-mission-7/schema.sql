-- updated_at 컬럼을 자동으로 NOW()로 갱신하는 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(100) NOT NULL UNIQUE,
  username VARCHAR(50) NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TRIGGER trigger_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


-- ALTER TABLE users ADD COLUMN updated_at TIMESTAMP;
-- ALTER TABLE users ALTER COLUMN updated_at DROP DEFAULT;

-- products
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  seller_id INTEGER NOT NULL,
  product_name VARCHAR(10) NOT NULL,   
  description VARCHAR CHECK (char_length(description) >= 10) NOT NULL,
  price INTEGER CHECK (price >= 0) NOT NULL,
  image_url TEXT,
  CONSTRAINT fk_products_user FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TRIGGER trigger_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- posts
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  title VARCHAR(200) NOT NULL,
  content TEXT,
  image_url TEXT,
  CONSTRAINT fk_posts_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TRIGGER trigger_posts_updated_at
BEFORE UPDATE ON posts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- comments
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL,
  author_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  CONSTRAINT fk_comment_user FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_comment_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TRIGGER trigger_comments_updated_at
BEFORE UPDATE ON comments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- tags
CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  tag VARCHAR(5) NOT NULL
);

-- images
CREATE TABLE images (
  id SERIAL PRIMARY KEY,
  image_url TEXT NOT NULL
);

-- likes
CREATE TABLE likes (
  user_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, product_id),
  CONSTRAINT fk_likes_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT fk_likes_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
);

-- product-image
CREATE TABLE product_images (
  product_id INTEGER NOT NULL,
  image_id INTEGER NOT NULL,
  PRIMARY KEY (product_id, image_id),   
  CONSTRAINT fk_product_images_image FOREIGN KEY (image_id) REFERENCES images(id) ON DELETE CASCADE,
  CONSTRAINT fk_product_images_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- product-tag
CREATE TABLE product_tags (
  tag_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  PRIMARY KEY (product_id, tag_id),    
  CONSTRAINT fk_product_tags_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
  CONSTRAINT fk_product_tags_tag FOREIGN KEY( tag_id) REFERENCES tags (id) ON DELETE CASCADE
);

