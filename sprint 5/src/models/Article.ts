export class Article {
  /** 제목 */
  private _title: string;

  /** 내용 */
  private _content: string;

  /** 좋아요 개수 */
  private _likeCount: number;

  /** 생성 일자 (옵션) */
  private _createdAt?: Date;

  constructor(title: string, content: string, likeCount: number, createdAt?: Date) {
    this._title = title;
    this._content = content;
    this._likeCount = likeCount;
    this._createdAt = createdAt;
  }

  getTitle(): string {
    return this._title;
  }

  getContent(): string {
    return this._content;
  }

  getLikeCount(): number {
    return this._likeCount;
  }

  getCreatedAt(): Date | undefined {
    return this._createdAt;
  }

  like(): void {
    this._likeCount++;
  }
}
