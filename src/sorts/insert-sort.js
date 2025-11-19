// 삽입 정렬 (Insertion sort)
export const insertionSort = (array) => {
  const arr = [...array];
  const n = array.length;

  for (let i = 1; i < n; i++) {
    let current = arr[i];
    let j = i - 1;

    // current 값보다 큰 값들을 한 칸씩 뒤로 이동
    while (j >= 0 && arr[j] > current) {
      arr[j + 1] = arr[j];
      j--;
    }

    // current 값을 올바른 위치에 삽입
    arr[j + 1] = current;
  }

  return arr;
};
