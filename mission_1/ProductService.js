import axios from "axios";

// [ ]  class 키워드를 이용해서 Product 클래스와 ElectronicProduct 클래스를 만들어 주세요.
// [ ] Product 클래스는 name(상품명) description(상품 설명), price(판매 가격), tags(해시태그 배열), images(이미지 배열), favoriteCount(찜하기 수)프로퍼티를 가집니다.
// [ ] Product 클래스는 favorite 메소드를 가집니다. favorite 메소드가 호출될 경우 찜하기 수가 1 증가합니다.
// [ ] ElectronicProduct 클래스는 Product를 상속하며, 추가로 manufacturer(제조사) 프로퍼티를 가집니다.
// [ ]  각 클래스 마다 constructor를 작성해 주세요.
// [ ]  추상화/캡슐화/상속/다형성을 고려하여 코드를 작성해 주세요.
// [ ]  'https://panda-market-api-crud.vercel.app/docs' 의 Product API를 이용하여 아래 함수들을 구현해 주세요.
// [ ] getProductList() : GET 메소드를 사용해 주세요.
// [ ] page, pageSize, keyword 쿼리 파라미터를 이용해 주세요.
// [ ] getProduct() : GET 메소드를 사용해 주세요.
// [ ] createProduct() : POST 메소드를 사용해 주세요.
// [ ] request body에 name, description, price, tags, images 를 포함해 주세요.
// [ ] patchProduct() : PATCH 메소드를 사용해 주세요.
// [ ] deleteProduct() : DELETE 메소드를 사용해 주세요.
// [ ]  async/await 을 이용하여 비동기 처리를 해주세요.
// [ ]  try/catch 를 이용하여 오류 처리를 해주세요.
// [ ]  fetch 혹은 axios를 이용해 주세요.
// [ ] 응답의 상태 코드가 2XX가 아닐 경우, 에러 메시지를 콘솔에 출력해 주세요.


export class Product { 
  constructor(name, description, price, tags, images, favoriteCount) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.tags = tags;
    this.images = images;
    this.favoriteCount = favoriteCount;
  }

  favorite(name) {
      this.favoriteCount += 1;
      console.log(`${name}의 찜하기 수가 ${this.favoriteCount}로 증가했습니다.`);
    }
}

const instance = axios.create({
  baseURL: 'https://panda-market-api-crud.vercel.app/'
});

export class ElectronicProduct extends Product{
  constructor(name, description, price, tags, images, favoriteCount, manufacturer) {
  super(name, description, price, tags, images, favoriteCount)
  this.manufacturer = manufacturer;
  }
}

export async function getProductList(params) {
  try {
  const res = await instance.get('products', { params });
  // console.log(res.data);
  return res.data;
  }
  catch (error) {
    console.error('에러 발생!', error);
  } 
  finally {
    console.log('작업 완료');
  }
}

export async function getProduct(id) {
  try {
    const res = await instance.get(`products/${id}`);
    // console.log(res.data);
    return res.data;
  } catch (error) {
    console.log('에러 발생', error);
  }
  finally {
    console.log('작업 완료');
  }
}

export async function createProduct(data) {
  try {
    const res = await instance.post('products', data);
    // console.log(res.data);
    return res.data;
  } catch (error) {
    console.error('에러 발생!', error);
  }
  finally {
    console.log('작업 완료');
  }
}

export async function patchProduct(id, data) {
  try {
    const res = await instance.patch(`products/${id}`, data);
    // console.log(res.data);
    return res.data;
  } catch (error) {
    console.error('에러 발생!', error);
  }
  finally {
    console.log('작업 완료');
  }
}

export async function deleteProduct(id) {
  try {
    const res = await instance.delete(`products/${id}`);
    // console.log(res.data);
    return res.data;
  } catch (error) {
    console.error('에러 발생!', error);
  } 
  finally {
    console.log('작업 완료');
  }
}
