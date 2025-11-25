const readline = require("readline");

// 선택 정렬
function selectionSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIdx]) minIdx = j;
    }
    [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
  }
}

// 삽입 정렬
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

// 병합 정렬
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
    if (left[i] < right[j]) result.push(left[i++]);
    else result.push(right[j++]);
  }

  return result.concat(left.slice(i)).concat(right.slice(j));
}

// 퀵 정렬
function quickSort(arr, left = 0, right = arr.length - 1) {
  if (left >= right) return;
  const pivotIndex = partition(arr, left, right);
  quickSort(arr, left, pivotIndex - 1);
  quickSort(arr, pivotIndex + 1, right);
}

function partition(arr, left, right) {
  const pivot = arr[right];
  let i = left - 1;
  for (let j = left; j < right; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
  return i + 1;
}

// 힙 정렬
function heapSort(arr) {
  let n = arr.length;

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }

  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }
}

function heapify(arr, heapSize, rootIdx) {
  let largest = rootIdx;
  let left = rootIdx * 2 + 1;
  let right = rootIdx * 2 + 2;

  if (left < heapSize && arr[left] > arr[largest]) {
    largest = left;
  }

  if (right < heapSize && arr[right] > arr[largest]) {
    largest = right;
  }

  if (largest !== rootIdx) {
    [arr[rootIdx], arr[largest]] = [arr[largest], arr[rootIdx]];
    heapify(arr, heapSize, largest);
  }
}


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 배열 입력
console.log("=== 정렬 알고리즘 테스트 ===");

rl.question("정렬할 숫자들을 입력하세요: ", (input) => {
  let arr = input.split(" ").map(Number);

  console.log("\n사용할 정렬 알고리즘을 선택하세요.");
  console.log("1. 선택 정렬");
  console.log("2. 삽입 정렬");
  console.log("3. 병합 정렬");
  console.log("4. 퀵 정렬");
  console.log("5. 힙 정렬");

  rl.question("번호 입력: ", (choice) => {
    console.log("\n=== 정렬 결과 ===");

    switch (choice) {
      case "1":
        selectionSort(arr);
        console.log("선택 정렬:", arr);
        break;

      case "2":
        insertionSort(arr);
        console.log("삽입 정렬:", arr);
        break;

      case "3":
        const merged = mergeSort(arr);
        console.log("병합 정렬:", merged);
        break;

      case "4":
        quickSort(arr);
        console.log("퀵 정렬:", arr);
        break;
      
      case "5":
        heapSort(arr);
        console.log("힙 정렬:", arr);
        break;

      default:
        console.log("올바른 번호를 입력하세요!");
        break;
    }

    rl.close();
  });
});
