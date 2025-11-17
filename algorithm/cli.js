/**
 * 실행:
 *   node cli.js
 *   node --expose-gc cli.js
 */

const { selectionSort, insertionSort, mergeSort, quickSort } = require('./sorts');
const { parseNumbers, measureRun, measureStableWithPeak } = require('./utils');
const readline = require('readline');

const NAME_KO = {
  Selection: '선택 정렬',
  Insertion: '삽입 정렬',
  Merge:     '병합 정렬',
  Quick:     '퀵 정렬',
};

/* ---------- 단일 실행/벤치마크 ---------- */

function runSingle(algorithmName, src) {
  console.log('\n=== 단일 실행 ===');
  console.log('입력 배열:', src.slice());

  let m;
  switch (algorithmName) {
    case 'selection': {
      const a = src.slice();
      m = measureRun({ name: 'Selection', run: () => { selectionSort(a); return a; } });
      break;
    }
    case 'insertion': {
      const a = src.slice();
      m = measureRun({ name: 'Insertion', run: () => { insertionSort(a); return a; } });
      break;
    }
    case 'merge': {
      m = measureRun({ name: 'Merge', run: () => mergeSort(src) });
      break;
    }
    case 'quick': {
      const a = src.slice();
      m = measureRun({ name: 'Quick', run: () => { quickSort(a); return a; } });
      break;
    }
    default:
      console.log('알 수 없는 알고리즘입니다.');
      return;
  }

  const ko = NAME_KO[m.name] ?? m.name;
  console.log(`${ko} 결과:`, m.result);
  console.log(`⏱ 시간: ${m.ms} ms   🧠 메모리 변화: ${m.memDelta}`);
}

function runBenchmarkAll(src) {
  console.log('\n=== 전체 벤치마크 (평균 시간 + 피크 메모리) ===');
  console.log('입력 배열:', src.slice());

  const rows = [
    measureStableWithPeak({ name: 'Selection', run: () => { const a = src.slice(); selectionSort(a); return a; } }),
    measureStableWithPeak({ name: 'Insertion', run: () => { const a = src.slice(); insertionSort(a); return a; } }),
    measureStableWithPeak({ name: 'Merge',     run: () => mergeSort(src) }),
    measureStableWithPeak({ name: 'Quick',     run: () => { const a = src.slice(); quickSort(a); return a; } }),
  ];

  // 한글 표로 출력
  console.table(rows.map(r => ({
    '알고리즘':           NAME_KO[r.name] ?? r.name,
    '평균 시간(ms)':      r.avgMs,
    '총 시간(ms)':        r.totalMs,
    '반복 수':            r.iters,
    '메모리 변화(Δ)':     r.memDelta,
    '피크 메모리(대략)':  r.memPeak,
  })));

  console.log('Tip) 더 정확한 메모리는: node --expose-gc cli.js');
}

/* ---------- CLI ---------- */

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function askInputArray(cb) {
  rl.question('\n정렬할 숫자들을 입력하세요 (예: 3 1 12 -11 10 0 또는 3,1,12,-11,10,0): ', line => {
    const arr = parseNumbers(line);
    if (!arr.length) { console.log('입력된 숫자가 없습니다. 다시 입력해주세요.'); return askInputArray(cb); }
    cb(arr);
  });
}

function showMenu() {
  console.log('\n===== 정렬 알고리즘 CLI =====');
  console.log('1. 선택 정렬 (Selection)');
  console.log('2. 삽입 정렬 (Insertion)');
  console.log('3. 병합 정렬 (Merge)');
  console.log('4. 퀵 정렬 (Quick)');
  console.log('5. 전체 벤치마크 (모든 정렬 비교)');
  console.log('6. 종료 (Exit)');

  rl.question('번호를 입력하세요: ', pick => {
    const c = pick.trim();
    if (c === '6') { console.log('\n프로그램을 종료합니다.'); rl.close(); return; }
    if (!['1','2','3','4','5'].includes(c)) { console.log('올바른 번호(1~6)를 입력하세요.'); return showMenu(); }

    askInputArray(arr => {
      if (c === '1') runSingle('selection', arr);
      if (c === '2') runSingle('insertion', arr);
      if (c === '3') runSingle('merge', arr);
      if (c === '4') runSingle('quick', arr);
      if (c === '5') runBenchmarkAll(arr);
      showMenu();
    });
  });
}

console.log('=== 정렬 알고리즘 학습 CLI ===');
showMenu();

process.on('SIGINT', () => { console.log('\n프로그램을 종료합니다.'); rl.close(); process.exit(0); });
