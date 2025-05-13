export class Article { //####게시글 클래스
  #likeCount = 0;

  constructor(title, content, writer) { // 생성자: 게시글의 기본 정보
    this.title = title;
    this.content = content;
    this.writer = writer;
    this.createdAt = new Date().toISOString();
  }

  like() { //####좋아요 기능: 좋아요 수 증가
    this.#likeCount += 1;
  }

  get likeCount() { //####좋아요 수 조회 (getter)
    return this.#likeCount;
  }
}


//####Article 인스턴스 생성
const article1 = new Article(
  "자바스크립트 클래스 완전 정복",
  "이번 글에서는 class 키워드와 객체지향 개념을 설명합니다.",
  "권나현"
);

//####좋아요 추가
article1.like();
article1.like();
article1.like();

//####결과 출력
console.log("제목:", article1.title);
console.log("내용:", article1.content);
console.log("작성자:", article1.writer);
console.log("작성일:", article1.createdAt);
console.log("좋아요 수:", article1.likeCount); // → 3
