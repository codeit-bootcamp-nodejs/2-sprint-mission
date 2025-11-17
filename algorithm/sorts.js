
//선택 정렬
function selectionSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
  }
  return arr;
}

//삽입 정렬
function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}

//병합 정렬
function mergeSort(arr) {
  const a = arr.slice();

  function merge(left, right) {
    const res = [];
    let i = 0, j = 0;
    while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) res.push(left[i++]);
      else res.push(right[j++]);
    }
    while (i < left.length) res.push(left[i++]);
    while (j < right.length) res.push(right[j++]);
    return res;
  }

  function divide(list) {
    if (list.length <= 1) return list;
    const mid = Math.floor(list.length / 2);
    const left = divide(list.slice(0, mid));
    const right = divide(list.slice(mid));
    return merge(left, right);
  }

  return divide(a);
}

// 퀵 정렬
function quickSort(arr, left = 0, right = arr.length - 1) {
  function partition(a, l, r) {
    const pivot = a[r];
    let i = l;
    for (let j = l; j < r; j++) {
      if (a[j] < pivot) {
        [a[i], a[j]] = [a[j], a[i]];
        i++;
      }
    }
    [a[i], a[r]] = [a[r], a[i]];
    return i;
  }

  if (left < right) {
    const p = partition(arr, left, right);
    quickSort(arr, left, p - 1);
    quickSort(arr, p + 1, right);
  }
  return arr;
}

module.exports = { selectionSort, insertionSort, mergeSort, quickSort };
