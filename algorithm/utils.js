// 문자열 → 숫자 배열(공백/콤마 구분, NaN 제거)
function parseNumbers(input) {
  return input.trim().split(/[,\s]+/).map(Number).filter(n => !Number.isNaN(n));
}

// 바이트 수 보기 좋게
function fmtBytes(b) {
  const units = ['B','KB','MB','GB'];
  let x = Math.abs(b), i = 0;
  while (x >= 1024 && i < units.length - 1) { x /= 1024; i++; }
  const sign = b >= 0 ? '+' : '-';
  return `${sign}${x.toFixed(2)} ${units[i]}`;
}

// 필요 시 GC 호출(정확한 메모리: node --expose-gc 로 실행)
let warnedNoGc = false;
function maybeGc() {
  if (global.gc) global.gc();
  else if (!warnedNoGc) {
    console.log('⚠️  더 정확한 메모리는 "node --expose-gc"로 실행하세요.');
    warnedNoGc = true;
  }
}

// 단일 실행 측정(시간 + Net 메모리Δ)
function measureRun({ name, run }) {
  maybeGc();
  const memBefore = process.memoryUsage().heapUsed;
  const t0 = process.hrtime.bigint();
  const result = run();
  const t1 = process.hrtime.bigint();
  maybeGc();
  const memAfter = process.memoryUsage().heapUsed;

  const ms = Number(t1 - t0) / 1e6;
  const memDelta = memAfter - memBefore;
  return { name, ms: +ms.toFixed(3), memDelta, memPretty: fmtBytes(memDelta), result };
}

// 평균 시간 + 관측 피크 메모리(루프 중 최대치)
function measureStableWithPeak({ name, run, targetMs = 400, warmup = 5, maxIters = 2e4 }) {
  for (let i = 0; i < warmup; i++) run();

  const probe = measureRun({ name, run });
  let iters = Math.min(maxIters, Math.max(5, Math.ceil(targetMs / Math.max(0.001, probe.ms))));

  maybeGc();
  const base = process.memoryUsage().heapUsed;
  let peak = base;

  const t0 = process.hrtime.bigint();
  for (let i = 0; i < iters; i++) {
    run();
    const h = process.memoryUsage().heapUsed;
    if (h > peak) peak = h;
  }
  const t1 = process.hrtime.bigint();
  maybeGc();
  const after = process.memoryUsage().heapUsed;

  const totalMs = Number(t1 - t0) / 1e6;
  const avgMs = totalMs / iters;

  return {
    name,
    iters,
    avgMs: +avgMs.toFixed(4),
    totalMs: +totalMs.toFixed(2),
    memDelta: fmtBytes(after - base),
    memPeak: fmtBytes(peak - base),
  };
}

module.exports = { parseNumbers, fmtBytes, maybeGc, measureRun, measureStableWithPeak };
