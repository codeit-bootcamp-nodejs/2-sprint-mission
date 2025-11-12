// 선택 정렬
function selectionSort(arr) {
  const length = arr.length;

  for (let i = 0; i < length - 1; i++) {
    let minIndex = i;

    for (let j = i + 1; j < length; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }

    if (minIndex !== i) {
      const temp = arr[i];
      arr[i] = arr[minIndex];
      arr[minIndex] = temp;
    }
  }

  return arr;
}

// 삽입 정렬
function insertionSort(arr) {
  const length = arr.length;

  for (let i = 1; i < length; i++) {
    const current = arr[i];

    let j = i - 1;

    while (j >= 0 && arr[j] > current) {
      arr[j + 1] = arr[j];
      j--;
    }

    arr[j + 1] = current;
  }

  return arr;
}

// 병합 정렬
function mergeSort(arr) {
  if (arr.length <= 1) {
    return arr.slice();
  }

  const mid = Math.floor(arr.length / 2);

  const left = arr.slice(0, mid);
  const right = arr.slice(mid);

  const sortedLeft = mergeSort(left);
  const sortedRight = mergeSort(right);

  return merge(sortedLeft, sortedRight);
}

function merge(left, right) {
  const result = [];
  let i = 0;
  let j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }

  while (i < left.length) {
    result.push(left[i]);
    i++;
  }

  while (j < right.length) {
    result.push(right[j]);
    j++;
  }

  return result;
}

// 퀵 정렬
function quickSort(arr, start = 0, end = arr.length - 1) {
  if (start >= end) return arr;

  const pivotIndex = partition(arr, start, end);

  quickSort(arr, start, pivotIndex - 1);
  quickSort(arr, pivotIndex + 1, end);

  return arr;
}

function partition(array, start, end) {
  const pivot = array[end];
  let i = start - 1;

  for (let j = start; j < end; j++) {
    if (array[j] < pivot) {
      i++;

      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }

  const temp = array[i + 1];
  array[i + 1] = array[end];
  array[end] = temp;

  return i + 1;
}

// 선택 정렬 테스트
const selectionArr = [96, 29, 73, 84, 67];
console.log("선택 정렬 이전:", selectionArr);
selectionSort(selectionArr);
console.log("선택 정렬 이후:", selectionArr);

// 삽입 정렬 테스트
const insertionArr = [96, 29, 73, 84, 67];
console.log("\n삽입 정렬 이전:", insertionArr);
insertionSort(insertionArr);
console.log("삽입 정렬 이후:", insertionArr);

// 병합 정렬 테스트
const mergeArr = [96, 29, 73, 84, 67];
const mergeSorted = mergeSort(mergeArr);
console.log("\n병합 정렬 이전:", mergeArr);
console.log("병합 정렬 이후:", mergeSorted);

// 퀵 정렬 테스트
const quickarr = [96, 29, 73, 84, 67];
console.log("\n퀵 정렬 이전:", quickarr);
quickSort(quickarr);
console.log("퀵 정렬 이후:", quickarr);
