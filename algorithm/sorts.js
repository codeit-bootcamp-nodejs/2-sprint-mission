/**
 * 선택 정렬(Selection Sort)
 ** 배열에서 작은 값을 앞쪽으로 옮기는 과정을 반복
 * @param {number[]} arr - 정렬할 숫자 배열.
 * @returns {number[]} - 오름차순으로 정렬된 배열 (원본 배열을 수정함).
 */
function selectionSort(arr) {
    
    const n = arr.length

    for (let i = 0; i < n; i++) {
        let minIndex = i;

        for (let j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }

        [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
    return arr 
};
    
/**
 * 삽입 정렬(Insertion Sort)
 ** 선택된 key를 배열의 알맞은 위치에 삽입
 * @param {number[]} arr - 정렬할 숫자 배열 (원본 배열이 수정됨).
 * @returns {number[]} - 오름차순으로 정렬된 배열.
 */
function insertionSort(arr) { 
    const n = arr.length
     
    for (let i = 1; i < n; i ++) {
        let key = arr[i];
        let j = i - 1;

        while (j >= 0 && key < arr[j]) {
            arr[j + 1] = arr[j]
            j -= 1
        }
        arr[j + 1] = key
    }
    return arr
}

/**
 * 병합 함수 - 두 배열을 비교하여 더 작은 수부터 새로운 배열에 추가 
 * @param {number[]} arr1 - 첫 번째 정렬된 배열.
 * @param {number[]} arr2 - 두 번째 정렬된 배열.
 * @returns {number[]} - 병합된 새로운 정렬된 배열.
 */
function merge(arr1, arr2) {
    
    let mergedList = [];
    let i = 0;
    let j = 0;
    const n = arr1.length;
    const m = arr2.length;

    while (i < n && j < m) {
        if (arr1[i] > arr2[j]) {
            mergedList.push(arr2[j]);
            j++;
        } else {
            mergedList.push(arr1[i]);
            i++;
        }
    }
    
    if (i == n) {
        mergedList.push(...arr2.slice(j));
    } else if (j == m) {
        mergedList.push(...arr1.slice(i));
    }

    return mergedList
}

/**
 * 병합 정렬(Merge Sort) 
 ** 배열을 재귀적으로 반으로 나누고(Divide), 정렬 후 merge 함수로 합침(Conquer)
 * @param {number[]} arr - 정렬할 숫자 배열.
 * @returns {number[]} - 오름차순으로 정렬된 새로운 배열을 반환
 */
function mergeSort(arr) {
    const n = arr.length
    if (n < 2) {
        return arr
    }
    
    const mid = Math.floor(n / 2)
    const left = arr.slice(0, mid)
    const right = arr.slice(mid, n)
    
    return merge(mergeSort(left), mergeSort(right))
}


/**
 * 분할 함수 - 배열을 피벗을 기준으로 두 부분(작은 값, 큰 값)으로 나눔
 * @param {number[]} arr - 배열
 * @param {number} start - 현재 부분 배열의 시작 인덱스
 * @param {number} end - 현재 부분 배열의 끝 인덱스 (피벗으로 사용됨)
 * @returns {number} - 피벗의 최종 인덱스
 */
function partition(arr, start, end) { 
    const pivot = arr[end];

    let i = start - 1; 

    for (let j = start; j < end; j++) {
        if (arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
    [arr[i + 1], arr[end]] = [arr[end], arr[i + 1]];

    return i + 1;
}


/**
 * 퀵 정렬(Quick Sort)
 ** 배열을 분할하고 재귀적으로 두 부분 배열을 정렬하는 분할 정복 
 * @param {number[]} arr - 정렬할 배열 (원본 배열이 수정됨).
 * @param {number} [start=0] - 정렬을 시작할 인덱스.
 * @param {number} [end=arr.length - 1] - 정렬을 끝낼 인덱스.
 * @returns {number[]} - 정렬된 배열 (원본 배열).
 */
function quickSort(arr, start = 0, end = undefined) {
    if (end === undefined) {
        end = arr.length - 1;
    }

    if (start < end) {
        const pivotIndex = partition(arr, start, end);

        // 피벗 왼쪽 부분 정렬
        quickSort(arr, start, pivotIndex - 1);

        // 피벗 오른쪽 부분 정렬
        quickSort(arr, pivotIndex + 1, end);
    }

    return arr;
}


// --- 테스트 코드 --- 
 
console.log("======선택 정렬 테스트======")

const selectionData = [3, 1, 7, 5, 13, 17, 11];

console.log("선택 정렬 전 배열:", selectionData);

selectionSort(selectionData);

console.log("선택 정렬 후 배열:", selectionData);



console.log("======삽입 정렬 테스트======")

const insertionData = [4, 1, 5, 2, 10, 7, 13];

console.log("삽입 정렬 전 배열:", insertionData);

insertionSort(insertionData);

console.log("삽입 정렬 후 배열:", insertionData);


console.log("======병합 정렬 테스트======");

const mergeData = [1, 5, 3, 9, 2, 3, 10, 1, 4];

console.log("병합 정렬 전 배열:", mergeData);

const newData = mergeSort(mergeData);

console.log("병합 정렬 후 배열:", newData);

console.log("원본데이터 확인:", mergeData);


console.log("======퀵 정렬 테스트======");

const quickData = [13, 2, 7, 9, 3, 20, 11, 5];

console.log("퀵 정렬 전 배열:", quickData);

quickSort(quickData);

console.log("퀵 정렬 후 배열:", quickData)
