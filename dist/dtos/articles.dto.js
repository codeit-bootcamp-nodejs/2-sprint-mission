"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatchArticleDto = exports.CreateArticlesDto = exports.PatchArticle = exports.CreateArticle = void 0;
const class_validator_1 = require("class-validator");
const superstruct_1 = require("superstruct");
exports.CreateArticle = (0, superstruct_1.object)({
    title: (0, superstruct_1.size)((0, superstruct_1.string)(), 1, 30),
    content: (0, superstruct_1.size)((0, superstruct_1.string)(), 1, 1000),
});
exports.PatchArticle = (0, superstruct_1.partial)(exports.CreateArticle);
class CreateArticlesDto {
    constructor() {
        this.title = '';
        this.content = '';
    }
}
exports.CreateArticlesDto = CreateArticlesDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 30),
    __metadata("design:type", String)
], CreateArticlesDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 1000),
    __metadata("design:type", String)
], CreateArticlesDto.prototype, "content", void 0);
class PatchArticleDto {
}
exports.PatchArticleDto = PatchArticleDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 30),
    __metadata("design:type", String)
], PatchArticleDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 1000),
    __metadata("design:type", String)
], PatchArticleDto.prototype, "content", void 0);
