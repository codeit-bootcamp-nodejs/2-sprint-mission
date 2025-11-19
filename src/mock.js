import readline from "readline";

// 사용자 입력 받는 함수
export const inputArray = async () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question("숫자 배열을 입력하세요 >> ", (num) => {
      const list = num
        // 숫자, 공백, '-' 제외한 모든 문자 → 공백으로 치환
        .replace(/[^\d\s]+/g, " ")
        // 연속된 공백도 잘 나누기
        .trim()
        .split(/\s+/)
        // 숫자로 변환
        .map(Number)
        // 혹시 NaN 남아있으면 제거
        .filter((n) => !isNaN(n));

      rl.close();
      resolve(list);
    });
  });
};

// 랜덤 배열 생성
export const randomArray = () => {
  const maxCount = Math.floor(Math.random() * 6) + 5; // 5~10 길이
  const randomArr = [];
  for (let i = 0; i < maxCount; i++) {
    randomArr.push(Math.floor(Math.random() * 99) + 1); // 1~99 랜덤 숫자
  }
  return randomArr;
};
