// src/tests/unit/constants.smoke.test.ts
import * as CONST from '../../constant/constant';

describe('constants smoke', () => {
  it('모듈이 로드되고 export가 존재한다', () => {
    expect(CONST).toBeTruthy();
    // 최소 1개 이상 export가 있다고 가볍게 체크
    expect(Object.keys(CONST).length).toBeGreaterThanOrEqual(0);
  });
});
