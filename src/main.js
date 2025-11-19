import readline from "readline";
import { inputArray, randomArray } from "./mock.js";
import { insertionSort } from "./sorts/insert-sort.js";
import { mergeSort } from "./sorts/merge-sort.js";
import { quickSort } from "./sorts/quick-sort.js";
import { selectionSort } from "./sorts/select-sort.js";

// 메인 함수
const main = async () => {
  const array = await selectInputMethod(); // 사용자 입력 또는 랜덤 배열 선택
  console.log("입력된 배열:", array);

  const selectSorted = selectionSort(array);
  console.log("선택 정렬:", selectSorted);

  const insertSorted = insertionSort(array);
  console.log("삽입 정렬:", insertSorted);

  const mergeSorted = mergeSort(array);
  console.log("병합 정렬:", mergeSorted);

  const quickSorted = quickSort(array);
  console.log("퀵 정렬:", quickSorted);
};

// 사용자 입력 또는 랜덤 배열 선택 함수
const selectInputMethod = () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    let array = [];
    rl.question(
      "원하는 입력 방법을 선택하세요 \n\n1. 사용자 입력\n2. 랜덤 배열 생성\n\n >> ",
      async (num) => {
        if (num === "1") {
          array = await inputArray(); // 사용자 입력
        } else {
          array = randomArray(); // 랜덤으로 테스트 가능
        }

        rl.close();
        resolve(array);
      }
    );
  });
};

// 프로그램 실행
main();
