// 병합 정렬 (Merge sort)
export const mergeSort = (array) => {
  const arr = [...array];
  const n = array.length;

  // 배열의 중간 지점 계산
  const mid = Math.floor(n / 2);

  if (n < 2) {
    return arr;
  }

  // 분할(Divide): 배열을 두 부분으로 나누어 재귀적으로 정렬
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  let i = 0; // left 배열의 현재 위치
  let j = 0; // right 배열의 현재 위치
  let k = 0; // 결과 배열(arr)의 현재 위치

  // 정복(Conquer): 정렬된 두 배열을 병합
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      arr[k++] = left[i++];
    } else {
      arr[k++] = right[j++];
    }
  }

  // 왼쪽 배열에 남은 요소 모두 복사
  while (i < left.length) {
    arr[k++] = left[i++];
  }
  // 오른쪽 배열에 남은 요소 모두 복사
  while (j < right.length) {
    arr[k++] = right[j++];
  }

  return arr;
};
