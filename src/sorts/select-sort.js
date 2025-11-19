// 선택 정렬 (Selection sort)
export const selectionSort = (array) => {
  const arr = [...array];
  const n = array.length;

  const swap = (minIdx, targetIdx) =>
    ([arr[minIdx], arr[targetIdx]] = [arr[targetIdx], arr[minIdx]]);

  // 전체 list 순회
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    // 최소값 비교 순회
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }

    // 현재 인덱스 위치와 최소 인덱스 위치가 맞지 않을 경우만 교환
    if (i !== minIdx) {
      swap(minIdx, i);
    }
  }

  return arr;
};
