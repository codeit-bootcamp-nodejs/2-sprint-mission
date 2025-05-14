export class Article {
	constructor(title = '', content = '', writer = '', likeCount = 0) {
		this.title = title; // 제목
		this.content = content; // 내용
		this.writer = writer; // 작성자
		this.likeCount = likeCount; // 좋아요 수
		this.createdAt = new Date(); // 작성일
	}

	like() {
		this.likeCount++;
	}
}