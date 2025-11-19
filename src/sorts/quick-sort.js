// 퀵 정렬 (Quick sort)
export const quickSort = (array) => {
  const arr = [...array];
  const n = array.length;

  if (n < 2) {
    return arr;
  }

  const pivot = arr[n - 1]; // 피벗 선택: 배열의 마지막 요소를 피벗으로 선택
  const left = []; // 피벗보다 작은 요소들을 담을 배열
  const right = []; // 피벗보다 큰 요소들을 담을 배열
  const equal = []; // 피벗과 같은 요소들을 담을 배열

  for (let i = 0; i < n; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i]);
    } else if (arr[i] > pivot) {
      right.push(arr[i]);
    } else {
      equal.push(arr[i]);
    }
  }

  return [...quickSort(left), ...equal, ...quickSort(right)];
};
