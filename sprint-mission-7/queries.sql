/*
  1. 내 정보 업데이트 하기
  - 닉네임을 "test"로 업데이트
  - 현재 로그인한 유저 id가 1이라고 가정
*/
UPDATE users SET username = 'test' WHERE id = 1;

/*
  2. 내가 생성한 상품 조회
  - 현재 로그인한 유저 id가 1이라고 가정
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 3번째 페이지
*/
SELECT *
FROM products
WHERE seller_id = 1
ORDER BY created_at DESC
LIMIT 10 OFFSET 20;


/*
  3. 내가 생성한 상품의 총 개수
*/
SELECT COUNT(*) AS total_products
FROM products
WHERE seller_id = 1;

/*
  4. 내가 좋아요 누른 상품 조회
  - 현재 로그인한 유저 id가 1이라고 가정
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 3번째 페이지
*/
SELECT p.*
FROM products p
JOIN likes l ON p.id = l.product_id
WHERE l.user_id = 1
ORDER BY l.created_at DESC
LIMIT 10 OFFSET 20;
-- 위의 코드와 차이점은?
SELECT * 
FROM products
JOIN likes ON products.id = likes.product_id
WHERE likes.user_id = 1
ORDER BY likes.created_at DESC
LIMIT 10 OFFSET 20;

/*
  5. 내가 좋아요 누른 상품의 총 개수
*/
SELECT 
	COUNT(*) AS liked_count
FROM likes
WHERE user_id = 1;

/*
  6. 상품 생성
  - 현재 로그인한 유저 id가 1이라고 가정
*/
INSERT INTO products
	(seller_id, product_name, description, price, image_url)
	VALUES
	(1, '샘플상품', '10글자이상 설명입니다.', 10000, 'https://example.com/sample.jpg')
;

SELECT * FROM products
-- UPDATE products SET product_name = '상품F'WHERE id = 6;
-- UPDATE products SET description = '상품F의 상세 설명입니다.' WHERE id = 6;

/*
  7. 상품 목록 조회
  - "test" 로 검색
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 1번째 페이지
  - 각 상품의 좋아요 개수를 포함해서 조회하기
*/
SELECT 
  products.id,
  COUNT(likes.user_id) AS like_count,
  products.product_name,
  products.description,
  products.price,
  products.image_url,
  products.created_at
FROM products
LEFT JOIN likes ON products.id = likes.product_id
WHERE products.product_name LIKE '%test%'
GROUP BY 
  products.id,
  products.product_name,
  products.description,
  products.price,
  products.image_url,
  products.created_at
ORDER BY products.created_at DESC
LIMIT 10 OFFSET 0;



/*
  8. 상품 상세 조회
  - 1번 상품 조회
*/
SELECT * FROM products WHERE id = 1;

/*
  9. 상품 수정
  - 1번 상품 수정
*/
UPDATE products SET seller_id = 2 WHERE id = 1;
SELECT * FROM products

/*
  10. 상품 삭제
  - 1번 상품 삭제
*/
DELETE FROM products WHERE id = 1;

/*
  11. 상품 좋아요
  - 1번 유저가 2번 상품 좋아요
*/
INSERT INTO likes (user_id, product_id) VALUES (1,2);
	
/*
  12. 상품 좋아요 취소
  - 1번 유저가 2번 상품 좋아요 취소
*/
DELETE FROM likes 
WHERE user_id = 1 AND product_id = 2

SELECT * FROM likes;
/*
  13. 상품 댓글 작성
  - 1번 유저가 2번 상품에 댓글 작성
*/
SELECT * FROM comments
INSERT INTO comments (product_id, author_id, content) 
VALUES (2, 1, '비싸지만 추천합니다.')

/*
  14. 상품 댓글 조회
  - 1번 상품에 달린 댓글 목록 조회
  - 최신 순으로 정렬
  - 댓글 날짜 2025-03-25 기준으로 커서 페이지네이션
  - 10개씩 페이지네이션
*/
SELECT *
FROM comments
WHERE product_id = 2
	AND created_at < '2025-03-25 00:00:00'
ORDER BY created_at DESC
LIMIT 10; 