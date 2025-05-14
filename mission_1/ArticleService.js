import axios from 'axios';

// [ ]  'https://panda-market-api-crud.vercel.app/docs' 의 Article API를 이용하여 아래 함수들을 구현해 주세요.
// [ ]  class 키워드를 이용해서 Article 클래스를 만들어 주세요.
// [ ] Article 클래스는 title(제목), content(내용), writer(작성자), likeCount(좋아요 수) 프로퍼티를 가집니다.
// [ ] Article 클래스는 like 메소드를 가집니다. like 메소드가 호출될 경우 좋아요 수가 1 증가합니다.
// [ ]  각 클래스 마다 constructor를 작성해 주세요.
// [ ]  추상화/캡슐화/상속/다형성을 고려하여 코드를 작성해 주세요.
// [ ] getArticleList() : GET 메소드를 사용해 주세요.
// [ ] page, pageSize, keyword 쿼리 파라미터를 이용해 주세요.
// [ ] getArticle() : GET 메소드를 사용해 주세요.
// [ ] createArticle() : POST 메소드를 사용해 주세요.
// [ ] request body에 title, content, image 를 포함해 주세요.
// [ ] patchArticle() : PATCH 메소드를 사용해 주세요.
// [ ] deleteArticle() : DELETE 메소드를 사용해 주세요.
// [ ]  async/await 을 이용하여 비동기 처리를 해주세요.
// [ ]  try/catch 를 이용하여 오류 처리를 해주세요.
// [ ]  fetch 혹은 axios를 이용해 주세요.
// [ ] 응답의 상태 코드가 2XX가 아닐 경우, 에러 메시지를 콘솔에 출력해 주세요.


export class Article {
  constructor(title, content, writer, likeCount) {
    this.title = title;
    this.content = content;
    this.writer = writer;
    this.likeCount = likeCount;
    this.createdAt = new Date()
  }

  like(title) {
    this.likeCount += 1;
    console.log(`${title}의 좋아요 수가 ${this.likeCount}로 증가했습니다.`);
  }
}

export const instance = axios.create({
  baseURL: 'https://panda-market-api-crud.vercel.app/'
});


export async function getArticleList(params) {
  try {
  const res = await instance.get('articles', { params });
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


export async function getArticle(id) {
  try {
    const res = await instance.get(`articles/${id}`);
    // console.log(res.data);
    return res.data;
  } catch (error) {
    console.error('에러 발생!', error);
  }
  finally {
    console.log('작업 완료');
  }
}

export async function createArticle(data) {
  try {
    const res = await instance.post('articles/', data);
    // console.log(res.data);
    return res.data;
  } 
  catch (error) {console.error('에러 발생!', error);
  }
  finally {console.log('작업 완료');
  }
}

export async function patchArticle(id, data) {
  try {
    const res = await instance.patch(`articles/${id}`, data);
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

export async function deleteArticle(id) {
  try {
    const res = await instance.delete(`articles/${id}`);
    // console.log(res.data);
    return res.data;
  } catch (error) {
    console.error('에러 발생!', error);
  } 
  finally {
    console.log('작업 완료');
  }
}
