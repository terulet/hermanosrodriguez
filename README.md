# Construcciones Hermanos Rodríguez — Web

Web de una sola página (landing) en **HTML + CSS + JavaScript puro**. Sin frameworks ni build. Lista para subir a **GitHub Pages** o cualquier hosting estático.

## Estructura de archivos
```
/index.html        → web principal
/style.css         → estilos de la web
/script.js         → navbar, menú móvil, contadores, slider, formulario, WhatsApp
/legal.css         → estilos de las páginas legales
/aviso-legal.html  → aviso legal (PENDIENTE de completar)
/privacidad.html   → política de privacidad (PENDIENTE de completar)
/cookies.html      → política de cookies
/images/           → imágenes (ver más abajo)
```

## ⚠️ Antes de publicar — checklist

### 1. Carpeta de imágenes
- Debe existir una carpeta **`/images`** junto al `index.html`.
- Sube **todas** las imágenes dentro de ella con estos nombres exactos:
  ```
  /images/hero.jpg
  /images/history.jpg
  /images/cta.jpg
  /images/before.jpg
  /images/after.jpg
  /images/project-1.jpg … /images/project-9.jpg
  ```
- Las imágenes incluidas ahora son **genéricas/representativas**. Sustitúyelas por fotos reales cuando las tengas (manteniendo los mismos nombres). Hasta entonces, los textos `alt` y la galería **no afirman** que sean obras de la empresa.

### 2. Dominio (SEO)
Cuando tengas el dominio confirmado, cambia la URL en estos puntos de `index.html` (están marcados con comentarios `DOMINIO PENDIENTE`):
- `<link rel="canonical" ...>`
- `<meta property="og:url" ...>`
- el campo `"url"` dentro del bloque JSON-LD

### 3. Datos de contacto (ya configurados — confirma que son correctos)
- Carlos · **687 242 997**
- Manolo · **615 959 391**
- Email · **construccionesrodriguez2020@gmail.com**
- WhatsApp principal · **34687242997** (Carlos), en `script.js` (`WHATSAPP_NUMERO`).
  Para usar el de Manolo como principal, cámbialo por `34615959391`.

### 4. 🚨 Páginas legales — NO PUBLICAR SIN COMPLETAR
**`aviso-legal.html` y `privacidad.html` contienen datos pendientes entre `[corchetes]`** (titular/razón social, NIF/CIF, domicilio fiscal), señalados con comentarios `PENDIENTE COMPLETAR ANTES DE PUBLICAR`.

- **No deben publicarse tal cual.** Rellena esos datos con la información fiscal y jurídica real.
- Te recomendamos que un gestor o asesor revise los textos antes de ponerlos online.
- No se han inventado datos fiscales a propósito.
- `cookies.html` está redactada para esta web tal cual (sin analítica, no instala cookies de seguimiento). Si más adelante añades Google Analytics, Meta Pixel o mapas embebidos, **actualiza esa página y añade un banner de consentimiento**.

## Formulario de presupuesto

- Es un formulario **multi-step** (4 pasos) con barra de progreso y validación.
- Incluye un **checkbox obligatorio** de aceptación de la política de privacidad: el formulario no se envía si no está marcado.
- **Actualmente el formulario envía por WhatsApp**, no por email. Al completarlo, muestra "Solicitud preparada" y abre WhatsApp con el resumen del proyecto (tipo, municipio, plazo, nombre, teléfono, email y mensaje).
- **No** muestra ninguna confirmación falsa de "enviado por email".

### Conectar Web3Forms (opcional — pendiente)
Si quieres **recibir las solicitudes por email** además de por WhatsApp:
1. Crea una cuenta gratuita en https://web3forms.com y copia tu **Access Key**.
2. En `script.js` (arriba del todo):
   - pon tu clave en `WEB3FORMS_KEY`
   - cambia `WEB3FORMS_ACTIVO` a `true`
3. A partir de ahí, al enviar el formulario se hará un envío real por email mediante Web3Forms. Mientras `WEB3FORMS_ACTIVO` sea `false`, solo funciona la vía de WhatsApp.

## Publicar en GitHub Pages
1. Sube todos los archivos (incluida la carpeta `/images`) a un repositorio.
2. Settings → Pages → Branch `main` / carpeta raíz → Save.
3. La web quedará en `https://usuario.github.io/repositorio/`.

## Detalles de marca
- Logo **H.R** con tejado, fiel a la furgoneta. Naranja corporativo + negro + blanco roto.
- Bilingüe puntual: "Construccions · Reformes" en el navbar y "Construccions · Reformes · Rehabilitació" en el footer, sin convertir toda la web al catalán.
