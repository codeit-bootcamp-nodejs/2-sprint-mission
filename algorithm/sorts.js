/** 
 * 1️⃣ 선택 정렬 :최솟값을 찾아서 앞의 값과 바꿈
 */ 

function selectionSort(array) {
  // 작은 요소를 맨 밑에 깔아준다.
  let indexMin, temp;
  for (let i = 0; i < array.length - 1; i++) {
    // 변경의 대상이 되는 기준 원소의 인덱스
    indexMin = i;
    for (let j = i + 1; j < array.length; j++) {
      if (array[j] < array[indexMin]) {
        indexMin = j;
      }
    }
    temp = array[indexMin];
    array[indexMin] = array[i];
    array[i] = temp;
  }
  return array;
}

// console.log(selectionSort([8, 5, 6, 2, 4]));

/**
 * 2️⃣ 삽입 정렬 : 평균과 최악 모두 수행 시간 복잡도는 O(n^2)
 * 만약 이미 정렬이 되어 있는 상태라면 24번째에 작성된 맨 위에 있는 for문의 루프만 타게 될 것이고, 그러면 복잡도는 O(n)가 된다.
 * 최악의 상황 > 복잡도
 * 최선의 상황 > 이미 다 정렬된 상태, 정렬이 많이 된 상태
 */
function insertSort(array) {
  for (let i = 1; i < array.length; i++) {
    let currentValue = array[i];

    let j;
    for (j = i - 1; j >= 0 && array[j] > currentValue; j--) {
      array[j + 1] = array[j];
    }
    array[j + 1] = currentValue;
  }
  return array;
}

// console.log(insertSort([8, 5, 6, 2, 4]));

/**
 * 3️⃣ 병합 정렬
 * 1단계 - 분할: 최소 단위까지 문제를 분할한다.
 * 2단계 - 정복 : 작아진 각각의 문제를 정복한다.
 * 3단계 - 결합 : 원래의 문제에 대한 결과로 조합한다.
 */

/**
정렬하는 함수, 길이가 1보다 짧은 거 하나만 남거나 없으면 더 이상 나누지 않는 수준의 단계
 */
function mergeSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }

  const mid = Math.floor(arr.length / 2); // 중간 인덱스 찾기
  const left = arr.slice(0, mid); // 중간 원소보다 작은 값이 모인 배열
  const right = arr.slice(mid); // 중간 원소보다 큰 값이 모인 배열
  const sortedLeft = mergeSort(left);
  const sortedRight = mergeSort(right);
  return merge(sortedLeft, sortedRight); // 이 함수를 통해서 합침
}

function merge(left, right) {
  let merged = [];
  let leftIndex = 0;
  let rightIndex = 0;

  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] < right[rightIndex]) {
      // left쪽이 큰지 right쪽이 큰지를 비교해서, 작은 쪽을 merged 병합정렬 안에 넣음
      merged.push(left[leftIndex]);
      leftIndex++;
    } else {
      merged.push(right[rightIndex]);
      rightIndex++;
    }
  }

  while (leftIndex < left.length) {
    merged.push(left[leftIndex]);
    leftIndex++;
  }

  while (rightIndex < right.length) {
    merged.push(right[rightIndex]);
    rightIndex++;
  }

  return merged;
}

// const array = [8, 5, 6, 2, 4];
// console.log((sortedArray = mergeSort(array)));

/**
 * 서로를 비교하면서 인덱스에서 하나씩 줄이다보니까 복잡도에서 강점이 생김 = O(n long n)
 * 일반적으로 성능이 좋다.
 * 단점은 함수 안에 또 다시 함수가 선언된다는 점이다.
 * 위의 코드에서 먼저 선언한 mergeSort가 메모리에 잡힐 텐데, 그 아래에도 새로운 mergeSort라고 하는 게 메모리에 잡힐 것이다(재할당도 안됨,그냥 한 번 선언하는 것)
 * 그러면 이게 연산이 끝날 때까지 메모리에 잡혀있다 보니까 공간 복잡도가 상대적으로 높아지는 문제가 생김. 공간 복잡도(=메모리 총 사용량)
 * 비교해보면, 비교/선택/삽입정렬은 공간 복잡도가 없다고 봐도 무방함 > 0(1), 왜? 기존의 값을 재할당 하는 것이기 때문(=값이 덮어쓰기가 됨)
 * 반면에 병합 정렬은 공간 복잡도가 O(n)임. 대신 시간복잡도가 좋음
 *
 * 그래서 버블, 선택, 삽입 > (최악) 시간복잡도 : O(n^2) 과 비교해봤을 때, 합병 > O(n log n)의 시간 복잡도가 우위에 있음
 */

/**
 * 4️⃣ 퀵 정렬
 * 1단계 - 배열 중 원소를 선택 (선택된 원소를 pivot이라고 함)
 * 2단계 - 피벗 앞에는 피벗보다 작은 값의 원소를 두고, 피벗 뒤에는 값이 큰 원소들이 오도록 배열을 분할한다. 분할 후 피벗의 위치는 변경되지 않는다.
 * 3단계 - 피벗을 중심으로 분할된 2개의 작은 배열에 대해 1,2단계를 반복한다.
 */

function quickSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }

  const pivot = arr[0]; // 1. 피벗으로 첫번째 원소를 선택
  const left = [];
  const right = [];

  // 피벗을 0번으로 정했기 때문에 1부터 시작
  for (let i = 1; i < arr.length; i++) {

    // 현재 선택된 원소가 피벗보다 작은 경우에 왼쪽 배열에 담음, 크다면 오른쪽에 담음
    arr[i] < pivot ? left.push(arr[i]) : right.push(arr[i]); 
  }
  // 하나의 배열로 합침
  return [...quickSort(left), pivot, ...quickSort(right)]; // 2. 재귀적으로 연산이 끝날 때까지 반복
}

// const arr = [8, 5, 6, 2, 4];
// console.log(quickSort(arr));

/**
 * 5️⃣ 힙 정렬
 * 최댓값, 최솟값을 찾는데 특화된 정렬 방법, 완전 이진트리를 기본으로 한 자료구조
 * 모든 경우에 O(n log n)의 시간 복잡도를 가진다. 
 * 공간 복잡도는 2가지 패턴이 나타날 수 있다. 
 * (1). In-place 힙 정렬: 추가적인 공간을 사용하지 않고 입력 배열 내에서 정렬을 수행하는 방식. 이 경우 힙 정렬의 공간복잡도는 O(1)이다.
 * (2). Out-place 힙 정렬: 추가적인 입력 배열을 생성하여 정렬을 만들고 수행한다. 이 경우 추가 생성 배열의 크기는 입력 배열 크기에 비례한다.
 * 
 * 구현 시 알아야 할 공식
 * 부모 노드 인덱스 = (자식 인덱스 - 1)
 * 왼쪽 자식 인덱스 = (부모 인덱스 * 2) + 1
 * 오른쪽 자식 인덱스 = (부모 인덱스 * 2) +2
 */

function heapSort(arr) {
  const n = arr.length

  // 1. 초기 힙 만들기
  // 배열의 길이를 반으로 나눠서 버림한 값에서 1을 뺀 값을 인덱스로 지정. i는 0이상이고 계속해서 감소
  // (non-leaf) 노드부터 시작해서 최대 힙 구성. n/2-1 부터 싲가하는 이유 : 리프 노드는 자식이 없어서 heapify가 필요없음
  for (let i = Math.floor(n / 2 - 1); i >= 0; i--) {
    // 조건을 만족할 때까지 힙을 생성
    heapify(arr, n, i)
  }
  // 2. 정렬하기
  for (let i = n - 1; i > 0; i--) {
    // 최댓값(루트)을 맨 뒤로 보내기
    // 인덱스를 배열길이-1로 설정하고, 인덱스가 0보다 크며 인덱스가 순회 시마다 감소
    [arr[0], arr[i] = arr[i], arr[0]]
    // 힙 다시 만들기
    heapify(arr, i, 0)
  }
  return arr
}

function heapify(arr, n, i) {
  let largest = i
  let left = 2 * i + 1
  let right = 2 * i + 2
  
  // 왼쪽 자식이 더 크면
  if (left < n && arr[left] > arr[largest]) {
    largest = left
  }

  // 오른쪽 자식이 더 크면
  if (right < n && arr[right] > arr[largest]) {
    largest = right
  }

  // 교환이 필요하면
  if (largest !== i) {
    [arr[i], arr[largest] = [arr[largest], arr[i]]]
    heapify(arr, n, largest)
  }
}

const arr = [8, 5, 6, 2, 4];
console.log(heapSort(arr));