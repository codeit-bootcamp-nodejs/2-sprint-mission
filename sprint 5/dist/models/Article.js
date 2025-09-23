"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Article = void 0;
class Article {
    constructor(title, content, likeCount, createdAt) {
        this._title = title;
        this._content = content;
        this._likeCount = likeCount;
        this._createdAt = createdAt;
    }
    getTitle() {
        return this._title;
    }
    getContent() {
        return this._content;
    }
    getLikeCount() {
        return this._likeCount;
    }
    getCreatedAt() {
        return this._createdAt;
    }
    like() {
        this._likeCount++;
    }
}
exports.Article = Article;
