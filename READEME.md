## 요구사항

### 기본
#### 1. 초급 문제
- [x] 모든 주문 조회 (orders)
- [x] 주문 ID가 423인 주문 조회
- [x] 총 주문 건수 조회 (total_orders)
- [x] 최신순 주문 조회 (date, time 주의)
- [x] 오프셋 기반 1페이지 조회 (10개, 최신순)
- [x] 오프셋 기반 5페이지 조회 (10개, 최신순)
- [x] 커서 기반 페이지네이션 (커서 ID 42 기준 다음 10개)
- [x] 2025년 3월 주문 조회
- [x] 2025년 3월 12일 오전 주문 조회
- [x] 이름에 'Cheese' 또는 'Chicken' 포함된 피자 종류 조회

#### 2. 중급 문제 
- [x] 피자별(pizza_id) 주문된 건수 (order_id 수)
- [x] 피자별 총 주문 수량
- [x] 가격이 20 이상인 피자들의 주문 내역 (서브쿼리 활용)
- [x] 하루 주문 수가 80건 이상인 날짜와 주문 수 (order_count), 최신순 정렬
- [x] 피자별 주문 수량이 10 이상인 항목만, 수량 내림차순 정렬
- [x] 피자별 총 수익(quantity * price) 계산 → total_revenue
- [x] 날짜별 주문 건수(order_count)와 총 수량(total_quantity)

#### 3. 고급 문제
- [x] 피자별 판매 수량 Top 10 조회 (pizzas.*, total_quantity)
- [x] 2025년 3월 일별 주문 건수(total_orders), 총 금액(total_amount)
- [x] 주문 ID = 78의 주문 내역 조회 (pizza_name, pizza_size, pizza_price, quantity, total_amount)
- [x] 피자 크기별 총 수익 계산 (size, total_revenue)
- [x] 피자 종류별 총 수익 계산 (pizza_type.name, total_revenue)

## 멘토님에게

- 매운맛🔥: 뒤는 없습니다. 그냥 필터 없이 말해주세요. 책임은 제가 집니다.