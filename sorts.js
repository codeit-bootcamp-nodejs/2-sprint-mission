//  선택정렬
function selectionSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    
    [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
  }
}

const nums1 = [3, 1, 2];
selectionSort(nums1);
console.log(nums1); // [1, 2, 3]

// 삽입정렬

function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let current = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > current) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = current;
  }
}

const nums2 = [5, 2, 4, 6, 1, 3];
insertionSort(nums2);
console.log(nums2); // [1, 2, 3, 4, 5, 6]

// 병합정렬
function mergeSort(arr) {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }

  return result.concat(left.slice(i)).concat(right.slice(j));
}
const nums3 = [3, 1, 4, 1, 5];
const sorted = mergeSort(nums3);
console.log(sorted); // [1, 1, 3, 4, 5]


// 퀵 정렬

function quickSort(arr, start = 0, end = arr.length - 1) {
  if (start >= end) return;

  const pivotIndex = partition(arr, start, end);
  quickSort(arr, start, pivotIndex - 1);
  quickSort(arr, pivotIndex + 1, end);
}

function partition(arr, start, end) {
  const pivot = arr[end];
  let i = start;

  for (let j = start; j < end; j++) {
    if (arr[j] < pivot) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      i++;
    }
  }

  [arr[i], arr[end]] = [arr[end], arr[i]];
  return i;
}
const nums4 = [9, 3, 7, 1, 4];
quickSort(nums4);
console.log(nums4); // [1, 3, 4, 7, 9]