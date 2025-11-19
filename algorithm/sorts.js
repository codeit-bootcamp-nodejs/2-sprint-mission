// 선택 정렬
export function selectionSort(array) {
    let currentIndex = 0;
    while (currentIndex < array.length - 1) {
        let minIndex = currentIndex;
        let searchIndex = currentIndex + 1;
        while (searchIndex < array.length) {
            if (array[searchIndex] < array[minIndex]) {
                minIndex = searchIndex;
            }
            searchIndex++;
        }
        [array[currentIndex], array[minIndex]] = [array[minIndex], array[currentIndex]];
        currentIndex++;
    }
    return array;
}

// 삽입 정렬
export function insertionSort(array) {
    let currentIndex = 1;
    while (currentIndex < array.length) {
        const currentValue = array[currentIndex];
        let sortedIndex = currentIndex - 1;
        while (sortedIndex >= 0 && array[sortedIndex] > currentValue) {
            array[sortedIndex + 1] = array[sortedIndex];
            sortedIndex--;
        }
        array[sortedIndex + 1] = currentValue;
        currentIndex++;
    }
    return array;
}

// 병합 정렬
export function mergeArrayList(leftHalf, rightHalf) {
    const mergedArray = [];
    let leftPointer = 0;
    let rightPointer = 0;
    while (leftPointer < leftHalf.length && rightPointer < rightHalf.length) {
        if (leftHalf[leftPointer] < rightHalf[rightPointer]) {
            mergedArray.push(leftHalf[leftPointer]);
            leftPointer++;
        } else {
            mergedArray.push(rightHalf[rightPointer]);
            rightPointer++;
        }
    }
    while (leftPointer < leftHalf.length) {
        mergedArray.push(leftHalf[leftPointer]);
        leftPointer++;
    }
    while (rightPointer < rightHalf.length) {
        mergedArray.push(rightHalf[rightPointer]);
        rightPointer++;
    }
    return mergedArray;
}

export function mergeSort(array) {
    if (array.length <= 1) {
        return array;
    }
    const middleIndex = Math.floor(array.length / 2);
    const leftHalf = mergeSort(array.slice(0, middleIndex));
    const rightHalf = mergeSort(array.slice(middleIndex));
    return mergeArrayList(leftHalf, rightHalf);
}

// 빠른 정렬
function partition(array, left, right, pivot) {
    while (true) {
        while (array[left] < pivot) {
            left++;
        }
        while (array[right] > pivot) {
            right--;
        }
        if (left >= right) {
            return right;
        }
        [array[left], array[right]] = [array[right], array[left]];
        left++;
        right--;
    }
}

export function quickSort(array, left = 0, right = array.length - 1) {
    while (left < right) {
        const pivot = array[Math.floor((left + right) / 2)];
        const index = partition(array, left, right, pivot);
        if (index > left) {
            quickSort(array, left, index);
        }
        if (index + 1 < right) {
            quickSort(array, index + 1, right);
        }
        break;
    }
    return array;
}

export const sorts = {
    selectionSort,
    insertionSort,
    mergeSort,
    quickSort
};
