// 선택 정렬
function selectionSort(arr) {
  const length = arr.length;

  for (let i = 0; i < length - 1; i++) {
    let minIndex = i;

    for (let j = i + 1; j < length; j++) {
      if (arr[j].value < arr[minIndex].value) {
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

    while (j >= 0 && arr[j].value > current.value) {
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
    if (left[i].value <= right[j].value) {
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
  const pivot = array[end].value;
  let i = start - 1;

  for (let j = start; j < end; j++) {
    if (array[j].value < pivot) {
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

// 정렬 테스트 - 삽입 정렬과 병합정렬은 안정성이 유지됨
function printArr(arr) {
  return arr.map((arr) => `${arr.value}${arr.label}`);
}

const testArr = [
  { value: 2, label: "A" },
  { value: 3, label: "B" },
  { value: 2, label: "C" },
  { value: 1, label: "D" },
  { value: 3, label: "E" },
];

function runTest(sortFunction, name) {
  const arrCopy = JSON.parse(JSON.stringify(testArr));

  console.log(`\n${name} 이전:`, printArr(arrCopy));
  const sorted = sortFunction(arrCopy);
  console.log(`${name} 이후:`, printArr(sorted));
}

runTest(selectionSort, "선택 정렬");
runTest(insertionSort, "삽입 정렬");
runTest(mergeSort, "병합 정렬");
runTest(quickSort, "퀵 정렬");
