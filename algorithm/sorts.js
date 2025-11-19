/**
 * 선택 정렬 (Selection Sort)
 * - 배열에서 가장 작은 값을 찾아서 맨 앞부터 차례대로 정렬
 * - 시간 복잡도: O(n²)
 * - 공간 복잡도: O(1)
 */
function selectionSort(nums) {
  const n = nums.length;

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;

    for (let j = i + 1; j < n; j++) {
      if (nums[j] < nums[minIndex]) {
        minIndex = j;
      }
    }

    if (minIndex !== i) {
      [nums[i], nums[minIndex]] = [nums[minIndex], nums[i]];
    }
  }
}

// 테스트 코드
console.log("=== 선택 정렬 테스트 ===");
const nums1 = [3, 1, 2];
console.log("정렬 전:", nums1); // [3, 1, 2]
selectionSort(nums1);
console.log("정렬 후:", nums1); // [1, 2, 3]

const nums2 = [64, 25, 12, 22, 11];
console.log("\n정렬 전:", nums2);
selectionSort(nums2);
console.log("정렬 후:", nums2); // [11, 12, 22, 25, 64]

/**
 * 삽입 정렬 (Insertion Sort)
 * - 배열을 정렬된 부분과 정렬되지 않은 부분으로 나누어
 * - 정렬되지 않은 부분의 값을 정렬된 부분의 적절한 위치에 삽입
 * - 시간 복잡도: 최악 O(n²),  최선 O(n)
 * - 공간 복잡도: O(1)
 */
function insertionSort(nums) {
  const n = nums.length;

  // 두 번째 요소부터 시작 (첫 번째 요소는 이미 정렬되어 있다고 가정)
  for (let i = 1; i < n; i++) {
    const key = nums[i];
    let j = i - 1;

    while (j >= 0 && nums[j] > key) {
      nums[j + 1] = nums[j];
      j--;
    }

    nums[j + 1] = key;
  }
}

// 테스트 코드
console.log("\n=== 삽입 정렬 테스트 ===");
const nums3 = [3, 1, 2];
console.log("정렬 전:", nums3); // [3, 1, 2]
insertionSort(nums3);
console.log("정렬 후:", nums3); // [1, 2, 3]

const nums4 = [64, 25, 12, 22, 11];
console.log("\n정렬 전:", nums4);
insertionSort(nums4);
console.log("정렬 후:", nums4); // [11, 12, 22, 25, 64]

/**
 * 병합 정렬 (Merge Sort)
 * - 분할 정복 알고리즘을 사용
 * - 배열을 절반으로 나누고, 각각을 정렬한 후 병합
 * - 시간 복잡도: O(n log n)
 * - 공간 복잡도: O(n)
 */
function mergeSort(nums) {
  // 기저 조건: 배열의 길이가 1 이하면 이미 정렬된 상태
  if (nums.length <= 1) {
    return nums;
  }

  // 배열을 절반으로 나누기
  const mid = Math.floor(nums.length / 2);
  const left = nums.slice(0, mid);
  const right = nums.slice(mid);

  // 재귀적으로 각 부분을 정렬하고 병합
  return merge(mergeSort(left), mergeSort(right));
}

/**
 * 두 개의 정렬된 배열을 하나의 정렬된 배열로 병합
 * @param {number[]} left - 정렬된 왼쪽 배열
 * @param {number[]} right - 정렬된 오른쪽 배열
 * @returns {number[]} 병합된 정렬 배열
 */
function merge(left, right) {
  const result = [];
  let leftIndex = 0;
  let rightIndex = 0;

  // 두 배열을 비교하며 작은 값부터 결과 배열에 추가
  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] < right[rightIndex]) {
      result.push(left[leftIndex]);
      leftIndex++;
    } else {
      result.push(right[rightIndex]);
      rightIndex++;
    }
  }

  // 남은 요소들을 결과 배열에 추가
  return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}

// 테스트 코드
console.log("\n=== 병합 정렬 테스트 ===");
const nums5 = [3, 1, 2];
console.log("정렬 전:", nums5); // [3, 1, 2]
const sorted5 = mergeSort(nums5);
console.log("정렬 후:", sorted5); // [1, 2, 3]
console.log("원본 배열:", nums5); // [3, 1, 2] - 원본은 변경되지 않음

const nums6 = [64, 25, 12, 22, 11];
console.log("\n정렬 전:", nums6);
const sorted6 = mergeSort(nums6);
console.log("정렬 후:", sorted6); // [11, 12, 22, 25, 64]

/**
 * 퀵 정렬 (Quick Sort)
 * - 분할 정복 알고리즘을 사용
 * - 피벗을 선택하고, 피벗보다 작은 값은 왼쪽, 큰 값은 오른쪽으로 분할
 * - 시간 복잡도: 평균 O(n log n), 최악 O(n²)
 * - 공간 복잡도: O(log n)
 */
function quickSort(nums, left = 0, right = nums.length - 1) {
  // 기저 조건: 범위가 유효하지 않으면 종료
  if (left >= right) {
    return;
  }

  // 파티션을 나누고 피벗의 최종 위치를 얻음
  const pivotIndex = partition(nums, left, right);

  // 피벗을 기준으로 왼쪽과 오른쪽 부분을 재귀적으로 정렬
  quickSort(nums, left, pivotIndex - 1);
  quickSort(nums, pivotIndex + 1, right);
}

/**
 * 배열을 피벗을 기준으로 분할하는 함수
 * @param {number[]} nums - 정렬할 배열
 * @param {number} left - 분할 범위의 시작 인덱스
 * @param {number} right - 분할 범위의 끝 인덱스
 * @returns {number} 피벗의 최종 위치
 */
function partition(nums, left, right) {
  // 피벗을 배열의 마지막 요소로 선택
  const pivot = nums[right];
  let i = left - 1; // 작은 요소들의 마지막 인덱스

  // left부터 right-1까지 순회
  for (let j = left; j < right; j++) {
    // 현재 요소가 피벗보다 작거나 같으면
    if (nums[j] <= pivot) {
      i++;
      // i와 j 위치의 요소를 교환
      [nums[i], nums[j]] = [nums[j], nums[i]];
    }
  }

  // 피벗을 올바른 위치로 이동
  [nums[i + 1], nums[right]] = [nums[right], nums[i + 1]];

  return i + 1; // 피벗의 최종 위치 반환
}

// 테스트 코드
console.log("\n=== 퀵 정렬 테스트 ===");
const nums7 = [3, 1, 2];
console.log("정렬 전:", nums7); // [3, 1, 2]
quickSort(nums7);
console.log("정렬 후:", nums7); // [1, 2, 3]

const nums8 = [64, 25, 12, 22, 11];
console.log("\n정렬 전:", nums8);
quickSort(nums8);
console.log("정렬 후:", nums8); // [11, 12, 22, 25, 64]

module.exports = {
  selectionSort,
  insertionSort,
  mergeSort,
  quickSort,
};
