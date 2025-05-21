class Article {
    title;
  content;
  writer;
  likeCount;
}
  constructor(title, content, writer, likeCount = 0); {
    this.title = title;
    this.content = content;
    this.writer = writer;
    this.likeCount = likeCount;
} 
like (
    this.likeCount++)

    like(); {
        this .likeCount++;
    }


{
 display();{//추상화
        this; new Error
    }
}
class Article extends BaseArticle {
    constructor(title, content, writer) {
        super(title, content, writer);
    }

    display() {
        console.log(`제목: ${this.title}\n내용: ${this.content}\n작성자: ${this.writer}\n좋아요 수: ${this.likeCount}`);
    }
}

class Article {
    importance;

    constructor(title, content, writer, importance) {
        super(title, content, writer);
        this.importance = importance;
    }

    display() {
        console.log(`[중요도: ${this.importance}] 제목: ${this.title}\n내용: ${this.content}\n작성자: ${this.writer}\n좋아요 수: ${this.likeCount}`);
    }
  }
class Article extends {//캡슐화

  constructor(title, content, writer, like = 0) {
    this.title = title;
    this.content = content;
    this.writer = writer;
    this.likeCount = like;
  }

  ,like() {
    this.likeCount++;
  }
}{}