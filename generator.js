
let iframe = document.getElementById("preview");
const code = document.getElementById("code");
const genBtn = document.getElementById("gen");
const genQrBtn = document.getElementById("genQr");
const autoUpdateCb = document.getElementById("autoUpdate");
const execJSCb = document.getElementById("execJS");
const qrCodeCanvas = document.getElementById("qrCode");
const qrCodeWrap = document.getElementById("qrCodeWrap");
const qrCodeLink = document.getElementById("qrCodeLink");
const closeIcon = document.getElementById("closeIcon");
const genBtnText = genBtn.innerText;

function getCode() {
  const html = code.value;
  html.replace(/\s*/g, " ");
  html.replace(/> </g, "><");
  return html;
}

function getUrl() {
  let url = location.href.slice(0, location.href.lastIndexOf("/"))
  if(url.startsWith("file:")) url += "/index.html";
  url += "#" + encodeURIComponent(getCode());
  return url;
}

if(!code.value) {
  code.value = `<!DOCTYPE html>
<html>
\t<body>Hello World</body>
</html>
`;
}

let autoUpdate = autoUpdateCb.checked;
autoUpdateCb.addEventListener("change", () => autoUpdate = autoUpdateCb.checked);

function updateIframe() {
  iframe.contentWindow.document.open();
  iframe.contentWindow.document.write(getCode());
  iframe.contentWindow.document.close();
}
code.addEventListener("input", () => {
  if(autoUpdate) updateIframe();
});

code.addEventListener('keydown', function(e) {
  if(e.key === 'Tab') {
    e.preventDefault();
    const start = this.selectionStart;
    const end = this.selectionEnd;
    
    this.value = this.value.substring(0, start) + "\t" + this.value.substring(end);
    this.selectionStart = this.selectionEnd = start + 1;
  }
});

function updateSandbox() {
  const newIframe = iframe.cloneNode(true);
  if(execJSCb.checked) newIframe.setAttribute("sandbox", "allow-scripts allow-popups allow-same-origin");
  else newIframe.setAttribute("sandbox", "allow-same-origin");
  iframe.replaceWith(newIframe);
  iframe = newIframe;
  updateIframe();
}
execJSCb.addEventListener("change", updateSandbox);
updateSandbox();

genBtn.addEventListener("click", () => {
  const url = getUrl();
  
  console.log(url);
  
  navigator.clipboard.writeText(url).then(() => {
    genBtn.innerText = "*copied*";
  }).catch(() => {
    genBtn.innerText = "*check console*";
  }).finally(() => {
    setTimeout(() => {
      genBtn.innerText = genBtnText;
    }, 1000);
  })
})

genQrBtn.addEventListener("click", () => {
  qrCodeWrap.style.visibility = "visible";
  
  const url = getUrl();
  
  const qr = new QRious({
    element: qrCodeCanvas,
    value: url,
    size: Math.ceil(Math.sqrt(url.length)) * 16,
  });
  
  qrCodeLink.setAttribute("href", qr.canvas.toDataURL("image/png"));
});

closeIcon.addEventListener("click", () => {
  qrCodeWrap.style.visibility = "hidden";
})

qrCodeWrap.addEventListener("click", (ev) => {
  if(ev.target === qrCodeWrap) {
    qrCodeWrap.style.visibility = "hidden";
  }
})
