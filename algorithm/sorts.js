// 선택 정렬 

function selectionSort(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[j] < arr[minIdx]) minIdx = j;
        }
        if (minIdx !== i) {
            // Swap
            const temp = arr[i];
            arr[i] = arr[minIdx];
            arr[minIdx] = temp;
        }
    }
}

//삽입 정렬 
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

//병합 정렬 
function mergeSort(arr) {
    if (arr.length <= 1) return arr;

    const mid = Math.floor(arr.length / 2);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);

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

    return merge(mergeSort(left), mergeSort(right));
}

//퀵 정렬 
function quickSort(arr, left = 0, right = arr.length - 1) {
    if (left >= right) return;

    const pivot = arr[right];
    let i = left - 1;
    for (let j = left; j < right; j++) {
        if (arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
    [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
    const pivotIdx = i + 1;

    quickSort(arr, left, pivotIdx - 1);
    quickSort(arr, pivotIdx + 1, right);
}

//테스트 

// 랜덤 배열 생성 함수 (보기 편하게 1~20 사이 숫자들)
function createRandomArray(length = 7, min = 1, max = 20) {
    const arr = [];
    for (let i = 0; i < length; i++) {
        const n = Math.floor(Math.random() * (max - min + 1)) + min;
        arr.push(n);
    }
    return arr;
}

function testSelectionSort() {
    console.log("======선택 정렬 테스트======");
    const arr = createRandomArray();
    console.log("선택 정렬 전 배열:", arr);
    selectionSort(arr);
    console.log("선택 정렬 후 배열:", arr);
    console.log();
}

function testInsertionSort() {
    console.log("======삽입 정렬 테스트======");
    const arr = createRandomArray();
    console.log("삽입 정렬 전 배열:", arr);
    insertionSort(arr);
    console.log("삽입 정렬 후 배열:", arr);
    console.log();
}

function testMergeSort() {
    console.log("======병합 정렬 테스트======");
    const arr = createRandomArray();
    const original = [...arr];
    console.log("병합 정렬 전 배열:", arr);
    const sorted = mergeSort(arr);
    console.log("병합 정렬 후 배열:", sorted);
    console.log("원본데이터 확인:", original);
    console.log();
}

function testQuickSort() {
    console.log("======퀵 정렬 테스트======");
    const arr = createRandomArray();
    console.log("퀵 정렬 전 배열:", arr);
    quickSort(arr);
    console.log("퀵 정렬 후 배열:", arr);
    console.log();
}

function runAllTests() {
    testSelectionSort();
    testInsertionSort();
    testMergeSort();
    testQuickSort();
}

runAllTests();
