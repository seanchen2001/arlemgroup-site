/**
 * Kura Matcha · Ceremonia del té — receptor del formulario de cata.html
 *
 * CÓMO INSTALARLO
 * 1. Creá un Google Sheet nuevo (ej. "Reservas · Ceremonia del té").
 * 2. En el Sheet: Extensiones → Apps Script.
 * 3. Borrá lo que haya y pegá TODO este archivo. Guardá.
 * 4. Implementar → Nueva implementación → tipo "Aplicación web".
 *      - Ejecutar como:        Yo (tu cuenta)
 *      - Quién tiene acceso:   Cualquier usuario   ← importante
 * 5. Autorizá los permisos que pide (es tu propio script).
 * 6. Copiá la URL que termina en /exec y pasásela a Claude para cablear el form.
 *
 * Si después editás este script, tenés que hacer
 * Implementar → Gestionar implementaciones → editar → "Nueva versión",
 * o los cambios no se aplican.
 */

// ── Configuración ──────────────────────────────────────────────
var HOJA        = 'Reservas';               // nombre de la pestaña
var AVISAR_MAIL = true;                     // false = solo planilla, sin mail
var MAIL_A      = 'seanc@kuramatcha.com';   // a quién avisar
var ENCABEZADOS = ['Recibido', 'Nombre', 'WhatsApp', 'Fecha preferida', 'Origen'];
// ───────────────────────────────────────────────────────────────

function doPost(e) {
  // Un lock evita que dos envíos simultáneos pisen la misma fila.
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    var libro = SpreadsheetApp.getActiveSpreadsheet();
    var hoja  = libro.getSheetByName(HOJA);

    if (!hoja) {
      hoja = libro.insertSheet(HOJA);
    }
    if (hoja.getLastRow() === 0) {
      hoja.appendRow(ENCABEZADOS);
      hoja.getRange(1, 1, 1, ENCABEZADOS.length).setFontWeight('bold');
      hoja.setFrozenRows(1);
    }

    var p = (e && e.parameter) ? e.parameter : {};
    var nombre   = (p.nombre   || '').toString().trim();
    var whatsapp = (p.whatsapp || '').toString().trim();
    var fecha    = (p.fecha    || '').toString().trim();
    var origen   = (p.origen   || 'cata.html').toString().trim();

    // Honeypot anti-spam: si viene relleno, respondemos OK pero no guardamos.
    if ((p._honey || '').toString().trim() !== '') {
      return json({ result: 'ok' });
    }
    if (!nombre && !whatsapp) {
      return json({ result: 'error', message: 'Faltan datos' });
    }

    hoja.appendRow([new Date(), nombre, whatsapp, fecha, origen]);

    if (AVISAR_MAIL) {
      try {
        MailApp.sendEmail({
          to: MAIL_A,
          subject: 'Nueva reserva · Ceremonia del té — ' + (nombre || 'sin nombre'),
          body: [
            'Nueva reserva para la Ceremonia del té:',
            '',
            'Nombre:          ' + nombre,
            'WhatsApp:        ' + whatsapp,
            'Fecha preferida: ' + fecha,
            '',
            'Planilla: ' + libro.getUrl()
          ].join('\n')
        });
      } catch (err) {
        // Si falla el mail (p. ej. cuota diaria), la fila ya quedó guardada.
      }
    }

    return json({ result: 'ok' });

  } catch (err) {
    return json({ result: 'error', message: err.toString() });
  } finally {
    lock.releaseLock();
  }
}

// Permite abrir la URL en el navegador para comprobar que está viva.
function doGet() {
  return json({ result: 'ok', message: 'Endpoint activo · Ceremonia del té' });
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
