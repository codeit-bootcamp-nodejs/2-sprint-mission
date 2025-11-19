import { sorts } from '../utils/sort.util.js';
import { BadRequestError, NotFoundError } from '../types/error.type.js';

export const handleGetSorts = async (_req, res, _next) => {
    const items = [
        {
            name: '선택 정렬',
            endpoint: 'selection'
        },
        {
            name: '삽입 정렬',
            endpoint: 'insertion'
        },
        {
            name: '병합 정렬',
            endpoint: 'merge'
        },
        {
            name: '빠른 정렬',
            endpoint: 'quick'
        }
    ];
    const total = items.length;

    res.status(200).json({ items, total });
};

const handleSort = (type, req, res, next) => {
    const array = req.body.array;

    if (!Array.isArray(array)) {
        next(new BadRequestError('array 필드는 배열이어야 합니다.'));
    }

    const sortFunc = sorts[type];
    const start = performance.now();
    const result = sortFunc([...array]);
    const end = performance.now();

    res.status(200).json({
        type,
        input: array,
        result,
        elapsedMs: `${(end - start).toFixed(3)} ms`,
    });
};

export const handlePostSelection = (req, res, next) => handleSort('selection', req, res, next);
export const handlePostInsertion = (req, res, next) => handleSort('insertion', req, res, next);
export const handlePostMerge = (req, res, next) => handleSort('merge', req, res, next);
export const handlePostQuick = (req, res, next) => handleSort('quick', req, res, next);