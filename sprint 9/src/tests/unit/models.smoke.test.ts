// src/tests/unit/models.smoke.test.ts
import * as ProductModel from '../../models/Product';
import * as ArticleModel from '../../models/Article';
import * as ElectronicProductModel from '../../models/ElectronicProduct';

describe('models smoke', () => {
  it('Product 모델 모듈 로드', () => {
    expect(ProductModel).toBeTruthy();
  });

  it('Article 모델 모듈 로드', () => {
    expect(ArticleModel).toBeTruthy();
  });

  it('ElectronicProduct 모델 모듈 로드', () => {
    expect(ElectronicProductModel).toBeTruthy();
  });
});
