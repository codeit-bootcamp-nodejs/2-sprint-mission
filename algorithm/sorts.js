
/* ------------------------------------------------------------------ */
/* 🟦 선택 정렬 (Selection Sort, in-place)                            */
/* ------------------------------------------------------------------ */

/**
 * Selection Sort
 * - 매 단계마다 "가장 작은 값"을 선택해서 앞으로 보내는 방식
 *
 * @param {number[]} arr - 정렬할 숫자 배열 (원본이 수정됩니다)
 */
export function selectionSort(arr) {
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;

    // i 이후 구간에서 최솟값의 인덱스 탐색
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }

    // 현재 위치(i)와 최솟값 위치(minIndex)를 교환
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
  }
}

/* ------------------------------------------------------------------ */
/* 🟩 삽입 정렬 (Insertion Sort, in-place)                            */
/* ------------------------------------------------------------------ */

/**
 * Insertion Sort
 * - "이미 정렬된 구간"에 현재 값을 알맞은 위치에 끼워 넣는 방식
 *
 * @param {number[]} arr - 정렬할 숫자 배열 (원본이 수정됩니다)
 */
export function insertionSort(arr) {
  const n = arr.length;

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;

    // key보다 큰 값들은 한 칸씩 오른쪽으로 밀기
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }

    // 비어 있는 자리에 key 삽입
    arr[j + 1] = key;
  }
}

/* ------------------------------------------------------------------ */
/* 🟨 병합 정렬 (Merge Sort, 새 배열 반환)                            */
/* ------------------------------------------------------------------ */

/**
 * Merge Sort
 * - 배열을 반으로 잘라 재귀적으로 정렬한 뒤, 두 정렬된 배열을 병합
 *
 * @param {number[]} arr - 정렬할 숫자 배열 (원본은 변경되지 않습니다)
 * @returns {number[]}   - 정렬된 새 배열
 */
export function mergeSort(arr) {
  // 길이가 0 또는 1이면 이미 정렬된 상태
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

/**
 * 두 개의 정렬된 배열(left, right)을 하나의 정렬된 배열로 병합
 *
 * @param {number[]} left
 * @param {number[]} right
 * @returns {number[]}
 */
function merge(left, right) {
  const result = [];
  let i = 0;
  let j = 0;

  // 두 배열에 아직 원소가 남아 있는 동안, 더 작은 값을 결과에 추가
  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }

  // 남은 값들 모두 뒤에 이어 붙이기
  return result.concat(left.slice(i)).concat(right.slice(j));
}

/* ------------------------------------------------------------------ */
/* 🟥 퀵 정렬 (Quick Sort, in-place)                                  */
/* ------------------------------------------------------------------ */

/**
 * Quick Sort
 * - 피벗(pivot)을 기준으로 작은 값/큰 값을 양쪽으로 분할한 뒤 재귀적으로 정렬
 *
 * @param {number[]} arr  - 정렬할 숫자 배열 (원본이 수정됩니다)
 * @param {number} [left] - 정렬 구간의 시작 인덱스 (내부 재귀용)
 * @param {number} [right]- 정렬 구간의 끝 인덱스 (내부 재귀용)
 */
export function quickSort(arr, left = 0, right = arr.length - 1) {
  if (left >= right) return;

  const pivotIndex = partition(arr, left, right);

  // 피벗 기준 왼쪽/오른쪽 부분 배열을 재귀적으로 정렬
  quickSort(arr, left, pivotIndex - 1);
  quickSort(arr, pivotIndex + 1, right);
}

/**
 * 파티션 함수
 * - 맨 오른쪽 값을 피벗으로 잡고,
 *   피벗보다 작은 값들은 왼쪽, 큰 값들은 오른쪽으로 재배치
 *
 * @param {number[]} arr
 * @param {number} left
 * @param {number} right
 * @returns {number} - 정렬 후 피벗이 위치하게 되는 인덱스
 */
function partition(arr, left, right) {
  const pivot = arr[right];
  let i = left - 1;

  for (let j = left; j < right; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  // 피벗을 i+1 위치로 이동
  [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
  return i + 1;
}

