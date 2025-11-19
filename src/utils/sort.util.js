// 선택 정렬
export function selectionSort(array) {
    let current = 0;
    while (current < array.length - 1) {
        let min = current;
        let i = current + 1;
        while (i < array.length) {
            if (array[i] < array[min]) {
                min = i;
            }
            i++;
        }
        [array[current], array[min]] = [array[min], array[current]];
        current++;
    }
    return array;
}

// 삽입 정렬
export function insertionSort(array) {
    let i = 1;
    while (i < array.length) {
        const value = array[i];
        let j = i - 1;
        while (j >= 0 && array[j] > value) {
            array[j + 1] = array[j];
            j--;
        }
        array[j + 1] = value;
        i++;
    }
    return array;
}

// 병합 정렬
function merge(left, right) {
    const result = [];
    let l = 0;
    let r = 0;
    while (l < left.length && r < right.length) {
        if (left[l] < right[r]) {
            result.push(left[l]);
            l++;
        } else {
            result.push(right[r]);
            r++;
        }
    }
    while (l < left.length) {
        result.push(left[l]);
        l++;
    }
    while (r < right.length) {
        result.push(right[r]);
        r++;
    }
    return result;
}

export function mergeSort(array) {
    if (array.length <= 1) {
        return array;
    }
    const mid = Math.floor(array.length / 2);
    const left = mergeSort(array.slice(0, mid));
    const right = mergeSort(array.slice(mid));
    return merge(left, right);
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
    selection: selectionSort,
    insertion: insertionSort,
    merge: mergeSort,
    quick: quickSort
};
