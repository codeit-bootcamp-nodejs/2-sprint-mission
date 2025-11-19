// 배열 요소의 타입을 number로 가정하고 타입을 명시했습니다.

/**
 * 선택 정렬 (Selection Sort)
 * 배열을 순회하며 가장 작은 요소를 찾아 현재 위치의 요소와 교환합니다.
 * @param arr 정렬할 숫자 배열
 */
function selectionSort(arr: number[]): void {
  for (let i = 0; i < arr.length; i++) {
    let minIndex: number = i;

    // 현재 위치(i) 이후의 배열에서 최소값 인덱스를 찾습니다.
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }

    // 최소값이 현재 위치의 요소가 아니라면 교환합니다.
    if (minIndex !== i) {
      const temp: number = arr[i];
      arr[i] = arr[minIndex];
      arr[minIndex] = temp;
    }
  }
}

/**
 * 삽입 정렬 (Insertion Sort)
 * 현재 요소를 정렬된 부분 배열의 올바른 위치에 삽입합니다.
 * @param arr 정렬할 숫자 배열
 */
function insertionSort(arr: number[]): void {
  for (let i = 1; i < arr.length; i++) {
    const current: number = arr[i];

    let j: number = i - 1;
    // current가 정렬된 부분 배열의 요소보다 작으면 요소들을 오른쪽으로 이동시킵니다.
    while (j >= 0 && arr[j] > current) {
      arr[j + 1] = arr[j];
      j--;
    }

    // 올바른 위치에 current를 삽입합니다.
    arr[j + 1] = current;
  }
}

/**
 * 병합 정렬 (Merge Sort) - 분할 단계
 * 배열을 반으로 나누고 재귀적으로 정렬한 후 병합합니다.
 * @param arr 정렬할 숫자 배열
 * @returns 정렬된 새로운 숫자 배열
 */
function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) {
    return arr;
  }

  // Divide 단계
  const mid: number = Math.floor(arr.length / 2);
  const left: number[] = arr.slice(0, mid);
  const right: number[] = arr.slice(mid);

  // Conquer 단계 (재귀 호출)
  const sortedLeft: number[] = mergeSort(left);
  const sortedRight: number[] = mergeSort(right);

  // Combine 단계 (병합)
  return merge(sortedLeft, sortedRight);
}

/**
 * 병합 함수 (Merge)
 * 정렬된 두 배열을 합쳐 하나의 정렬된 배열을 만듭니다.
 * @param left 이미 정렬된 왼쪽 배열
 * @param right 이미 정렬된 오른쪽 배열
 * @returns 병합된 정렬된 배열
 */
function merge(left: number[], right: number[]): number[] {
  const result: number[] = [];
  let i: number = 0; // 왼쪽 배열 인덱스
  let j: number = 0; // 오른쪽 배열 인덱스

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }

  // 남아있는 요소들을 모두 추가합니다.
  result.push(...left.slice(i));
  result.push(...right.slice(j));
  return result;
}

/**
 * 퀵 정렬 (Quick Sort) - 주 함수
 * 배열의 요소를 분할(partition)하고 재귀적으로 정렬합니다. (제자리 정렬)
 * @param arr 정렬할 숫자 배열
 * @param start 부분 배열의 시작 인덱스
 * @param end 부분 배열의 끝 인덱스 (null이면 배열의 끝으로 설정)
 */
function quickSort(arr: number[], start: number = 0, end: number | null = null): void {
  // end 매개변수의 타입을 number | null로 지정하고 null 체크 로직을 함수 내부에 넣었습니다.
  if (end === null) {
    end = arr.length - 1;
  }
  
  // start와 end가 유효한 경우에만 진행합니다.
  if (start < end) {
    // Divide 단계 (분할)
    const pivotIndex: number = partition(arr, start, end);
    
    // Conquer 단계 (재귀 호출)
    quickSort(arr, start, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, end);
    
    // Quick Sort는 제자리 정렬이므로 별도의 Combine 단계는 없습니다.
  }
}

/**
 * 분할 함수 (Partition)
 * 배열의 특정 범위 내에서 피벗 요소를 기준으로 요소를 재배치합니다.
 * @param arr 배열
 * @param start 시작 인덱스
 * @param end 끝 인덱스 (피벗이 될 요소의 인덱스)
 * @returns 피벗 요소의 최종 위치 인덱스
 */
function partition(arr: number[], start: number, end: number): number {
  const pivot: number = arr[end]; // 가장 오른쪽 요소를 피벗으로 선택
  let i: number = start - 1; // 피벗보다 작은 요소들의 경계 인덱스

  for (let j: number = start; j < end; j++) {
    // 현재 요소가 피벗보다 작거나 같으면
    if (arr[j] <= pivot) {
      i++;
      // 요소 교환: arr[i]와 arr[j]를 스왑
      const temp: number = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
  }

  // 마지막으로 피벗 요소를 최종 위치 (i + 1)로 이동
  const temp: number = arr[end];
  arr[end] = arr[i + 1]
  arr[i + 1] = temp;

  return i + 1; // 새로운 피벗 인덱스 반환
}