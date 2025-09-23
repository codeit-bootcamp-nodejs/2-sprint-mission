const esbuild = require('esbuild');
const fs = require('fs');

const isProd = process.argv.includes('--prod');

esbuild
  .build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    minify: isProd,
    write: false,
    platform: 'browser',
  })
  .then((result) => {
    const jsCode = result.outputFiles[0].text;
    const cssCode = fs.readFileSync('public/styles.css', 'utf8');

    const html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>SAMPLE GAME${isProd ? '' : '(DEV)'}</title>
  <style>
${cssCode}
  </style>
</head>
<body>
  <!-- 로고 텍스트 -->
  <h1 class="logo">Messagoom</h1>

  <!-- 로그인 폼 -->
  <div class="login-form">
    <input type="text" id="username" placeholder="username" />
    <input type="password" id="password" placeholder="password" />
    <button id="signin">Sign In</button>
  </div>

  <!-- 메인 레이아웃 -->
  <div class="main-container">
    <div class="game-container">
      <canvas id="gameCanvas"></canvas>
    </div>

    <div class="user-list-container">
      <h3>접속자 목록</h3>
      <ul id="user-list"></ul>
    </div>

    <div class="chat-container">
      <h3>채팅</h3>

      <div class="chat-section">
        <h4>전체</h4>
        <div id="chat-box-global" class="chat-box"></div>
      </div>

      <div class="chat-section">
        <h4>지역</h4>
        <div id="chat-box-local" class="chat-box"></div>
      </div>

      <div class="chat-input-row">
        <select id="chat-scope">
          <option value="global">전체</option>
          <option value="local">지역</option>
        </select>
        <input type="text" id="chat-input" placeholder="메시지를 입력하세요" />
        <button id="chat-send">보내기</button>
      </div>
    </div>
  </div>

  <script>
${jsCode}
  </script>
</body>
</html>`;

    const outFile = isProd ? '../www/index.html' : '../www/index.html';
    fs.writeFileSync(outFile, html, 'utf8');
    console.log(`Built to ${outFile}`);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
