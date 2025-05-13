//####API 기본 주소
const BASE_URL = 'https://panda-market-api-crud.vercel.app/products';


// ####[GET] 상품 목록 조회
//_페이지, 페이지 크기, 키워드 검색 기능 지원_
export async function getProductList(page = 1, pageSize = 10, keyword = '') {
  const url = `${BASE_URL}?page=${page}&pageSize=${pageSize}&keyword=${encodeURIComponent(keyword)}`;
  try {
    const res = await fetch(url); // _API 호출_
    if (!res.ok) throw new Error(`Error: ${res.status}`); // _실패 시 예외_
    return await res.json(); // _JSON 응답 반환_
  } catch (err) {
    console.error('getProductList error:', err); // _오류 로그_
  }
}


//####[GET] 단일 상품 조회
export async function getProduct(id) {
  try {
    const res = await fetch(`${BASE_URL}/${id}`); //_ID로 개별 상품 조회_
    if (!res.ok) throw new Error(`Error: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('getProduct error:', err);
  }
}


//####[POST] 상품 등록
export async function createProduct({ name, description, price, tags, images }) {
  try {
    const res = await fetch(BASE_URL, {
      method: 'POST', //####생성 요청
      headers: { 'Content-Type': 'application/json' }, //####JSON 형식 지정
      body: JSON.stringify({ name, description, price, tags, images }), //####본문 데이터
    });
    if (!res.ok) throw new Error(`Error: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('createProduct error:', err);
  }
}


//####[PATCH] 상품 정보 수정
export async function patchProduct(id, data) {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PATCH', //####부분 수정 요청
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data), //####수정 데이터
    });
    if (!res.ok) throw new Error(`Error: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('patchProduct error:', err);
  }
}


//####[DELETE] 상품 삭제
export async function deleteProduct(id) {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE', //####삭제 요청
    });
    if (!res.ok) throw new Error(`Error: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('deleteProduct error:', err);
  }
}