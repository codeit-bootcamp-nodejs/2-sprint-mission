// 선택 정렬
function selectionSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIndex]) minIndex = j;
    }
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
  }
}

// 삽입 정렬
function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    const current = arr[i];
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
    if (left[i] <= right[j]) result.push(left[i++]);
    else result.push(right[j++]);
  }
  return result.concat(left.slice(i)).concat(right.slice(j));
}

// 퀵 정렬
function quickSort(arr, left = 0, right = arr.length - 1) {
  if (left >= right) return;
  const pivot = arr[Math.floor((left + right) / 2)];
  const index = partition(arr, left, right, pivot);
  quickSort(arr, left, index - 1);
  quickSort(arr, index, right);
}
function partition(arr, left, right, pivot) {
  while (left <= right) {
    while (arr[left] < pivot) left++;
    while (arr[right] > pivot) right--;
    if (left <= right) {
      [arr[left], arr[right]] = [arr[right], arr[left]];
      left++;
      right--;
    }
  }
  return left;
}


if (require.main === module) {
  const readline = require("readline");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  function showMenu() {
    console.log("\n사용할 정렬 알고리즘을 선택하세요.");
    console.log("1. 선택 정렬 (Selection Sort)");
    console.log("2. 삽입 정렬 (Insertion Sort)");
    console.log("3. 병합 정렬 (Merge Sort)");
    console.log("4. 퀵 정렬 (Quick Sort)");
    console.log("5. 종료 (Exit)");

    rl.question("번호 입력: ", (choice) => {
      if (choice.trim() === "5") {
        console.log("\n프로그램을 종료합니다.");
        rl.close();
        return;
      }

      if (!["1", "2", "3", "4"].includes(choice.trim())) {
        console.log("올바른 번호를 입력하세요 (1~5).");
        return showMenu();
      }

      rl.question("\n정렬할 숫자들을 입력하세요 (예: 3 1 2 -5 10): ", (input) => {
        let arr = input
          .split(/[\s,]+/)
          .map(Number)
          .filter((x) => !Number.isNaN(x));

        console.log("\n=== 정렬 결과 ===");

        switch (choice.trim()) {
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
        }

        showMenu();
      });
    });
  }

  console.log("=== 정렬 알고리즘 테스트 ===");
  showMenu();
}
