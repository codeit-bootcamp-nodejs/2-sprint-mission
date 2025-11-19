// 선택 정렬 (Selection Sort)
const selectionSort = (arr) => {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIndex]) minIndex = j;
    }
    if (minIndex !== i) [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
  }
  return arr;
};

// 삽입 정렬 (Insertion Sort)
const insertionSort = (arr) => {
  const n = arr.length;
  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
};

// 병합 정렬 (Merge Sort)
const mergeSort = (arr) => {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
};

const merge = (left, right) => {
  const result = [];
  let i = 0, j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) result.push(left[i++]);
    else result.push(right[j++]);
  }

  return result.concat(left.slice(i), right.slice(j));
};

// 퀵 정렬 (Quick Sort)
const quickSort = (arr, left = 0, right = arr.length - 1) => {
  if (left >= right) return arr;

  const pivotIndex = partition(arr, left, right);
  quickSort(arr, left, pivotIndex - 1);
  quickSort(arr, pivotIndex + 1, right);

  return arr;
};

const partition = (arr, left, right) => {
  const pivot = arr[right];
  let i = left - 1;

  for (let j = left; j < right; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
  return i + 1;
};

// 테스트 코드
const list1 = [100, 65, 32, 5, 12];
console.log("==== Selection Sort ====");
console.log("정렬 전:", list1);
selectionSort(list1);
console.log("정렬 후:", list1, "\n");

const list2 = [88, 15, 42, 7, 29];
console.log("==== Insertion Sort ====");
console.log("정렬 전:", list2);
insertionSort(list2);
console.log("정렬 후:", list2, "\n");

const list3 = [99, 11, 55, 22, 33];
console.log("==== Merge Sort ====");
console.log("정렬 전:", list3);
console.log("정렬 후:", mergeSort(list3), "\n");

const list4 = [33, 10, 55, 26, 78];
console.log("==== Quick Sort ====");
console.log("정렬 전:", list4);
quickSort(list4);
console.log("정렬 후:", list4);
