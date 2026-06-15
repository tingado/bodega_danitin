// Módulo QR — generación y escaneo
// Dependencias (CDN en index.html):
//   qrcode.js   → window.QRCode
//   html5-qrcode → window.Html5Qrcode

const QRModule = (() => {

  // ── Generar QR ────────────────────────────────────────────────────────────

  function generarQR(containerId, itemId, opciones = {}) {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = '';

    const opts = {
      text:          itemId,
      width:         opciones.width  || 200,
      height:        opciones.height || 200,
      colorDark:     '#000000',
      colorLight:    '#ffffff',
      correctLevel:  QRCode.CorrectLevel.M
    };

    new QRCode(el, opts);
  }

  function descargarQR(containerId, nombreArchivo) {
    const canvas = document.querySelector(`#${containerId} canvas`);
    if (!canvas) { alert('Primero generá el QR'); return; }
    const link = document.createElement('a');
    link.download = `${nombreArchivo || 'qr'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  // ── Escanear QR ───────────────────────────────────────────────────────────

  let scannerInstance = null;

  function iniciarEscaner(videoElementId, onSuccess, onError) {
    if (scannerInstance) detenerEscaner();

    scannerInstance = new Html5Qrcode(videoElementId);

    Html5Qrcode.getCameras()
      .then(cameras => {
        if (!cameras.length) throw new Error('No se encontró cámara');
        const camId = cameras[cameras.length - 1].id; // preferir cámara trasera

        return scannerInstance.start(
          camId,
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            onSuccess(decodedText);
          },
          () => {} // ignorar errores de frame individuales
        );
      })
      .catch(err => {
        scannerInstance = null;
        if (onError) onError(err.message || 'Error al iniciar la cámara');
      });
  }

  function detenerEscaner() {
    if (scannerInstance) {
      scannerInstance.stop().catch(() => {});
      scannerInstance = null;
    }
  }

  return { generarQR, descargarQR, iniciarEscaner, detenerEscaner };
})();
