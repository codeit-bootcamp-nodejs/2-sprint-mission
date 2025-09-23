"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElectronicProduct = void 0;
const Product_1 = require("./Product");
class ElectronicProduct extends Product_1.Product {
    constructor(name, description, price, tags, images, favoriteCount, manufacturer) {
        super(name, description, price, tags, images, favoriteCount);
        this._manufacturer = manufacturer;
    }
    getManufacturer() {
        return this._manufacturer;
    }
}
exports.ElectronicProduct = ElectronicProduct;
