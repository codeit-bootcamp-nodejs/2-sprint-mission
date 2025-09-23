"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
class Product {
    constructor(name, description, price, tags, images, favoriteCount) {
        this._name = name;
        this._description = description;
        this._price = price;
        this._tags = Array.from(tags); // 깊은 복사
        this._images = Array.from(images);
        this._favoriteCount = favoriteCount;
    }
    getName() {
        return this._name;
    }
    getDescription() {
        return this._description;
    }
    getPrice() {
        return this._price;
    }
    getTags() {
        return Array.from(this._tags); // 깊은 복사
    }
    getImages() {
        return Array.from(this._images);
    }
    getFavoriteCount() {
        return this._favoriteCount;
    }
    favorite() {
        this._favoriteCount++;
    }
}
exports.Product = Product;
