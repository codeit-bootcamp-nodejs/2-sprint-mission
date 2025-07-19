-- 유저
CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	email VARCHAR(100) UNIQUE NOT NULL,
	password VARCHAR(100) NOT NULL,
	nickname VARCHAR(50) UNIQUE NOT NULL,
	create_at TIMESTAMP DEFAULT NOW(),
	delete_at TIMESTAMP
)
;

-- 상품
CREATE TABLE products (
	id SERIAL PRIMARY KEY,
	user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	name VARCHAR(50) NOT NULL,
	description TEXT,
	price INTEGER NOT NULL,
	create_at TIMESTAMP DEFAULT NOW(),
    update_at TIMESTAMP DEFAULT NOW()	
)
;

-- 상품 이미지
CREATE TABLE product_images (
	id SERIAL PRIMARY KEY,
	product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
	image_url VARCHAR(255) NOT NULL,
	created_at TIMESTAMP DEFAULT NOW()
)
;

-- 상품 댓글
CREATE TABLE product_comments (
	id SERIAL PRIMARY KEY,
	user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
	create_at TIMESTAMP DEFAULT NOW(),
    update_at TIMESTAMP DEFAULT NOW()
)
;

-- 상품 좋아요
CREATE TABLE product_likes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (user_id, product_id)
)
;

-- 게시글
CREATE TABLE posts (
	id SERIAL PRIMARY KEY,
	user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	title VARCHAR(100) NOT NULL,
	content TEXT,
    like_count INTEGER DEFAULT 0,
    create_at TIMESTAMP DEFAULT NOW(),
    update_at TIMESTAMP DEFAULT NOW()
)
;

-- 게시글 이미지
CREATE TABLE posts_images (
	id SERIAL PRIMARY KEY,
	post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
	image_url VARCHAR(255) NOT NULL,
	created_at TIMESTAMP DEFAULT NOW() 
)
;

-- 게시글 댓글
CREATE TABLE post_comments (
	id SERIAL PRIMARY KEY,
	user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
	create_at TIMESTAMP DEFAULT NOW(),
    update_at TIMESTAMP DEFAULT NOW()
)
;

-- 게시글 좋아요
CREATE TABLE post_likes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (user_id, post_id)
)
;

-- 태그
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) UNIQUE NOT NULL
)
;

-- 상품 태그
CREATE TABLE product_tags (
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, tag_id)
)
;