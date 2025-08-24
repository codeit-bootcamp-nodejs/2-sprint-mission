// @ts-nocheck

// src/lib/validate.ts
import { assert, type Struct } from 'superstruct';

/** superstruct의 create 대신: 통과하면 T로 단언해서 돌려줌 */
export function validate<T>(value: unknown, struct: Struct<T>): T {
    assert(value, struct);        // 형식만 검증 (변환/기본값 없음)
    return value as T;
}
