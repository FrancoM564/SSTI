//Funciones a nivel de bits

function ROL(x, n) {
  return new Number((x << n) | (x >>> (32 - n)));
}

const exor = (x, y, z) => {
  return x ^ y ^ z;
};

const mux = (x, y, z) => {
  return (x & y) | (~x & z);
};

const opMinus1 = (x, y, z) => {
  return (x | ~y) ^ z;
};

const mux2 = (x, y, z) => {
  return (x & z) | (y & ~z);
};

function opMinus2(x, y, z) {
  return x ^ (y | ~z);
}

const indiceMensajeAElegir = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15,
  3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11,
  5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7,
  12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13,
];

const indiceMensajeAElegirPrima = [
  5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5,
  10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0,
  4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1,
  5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11,
];

const cantidadARotarIzquierda = [
  11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7,
  15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5,
  12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5,
  11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6,
];

const cantidadARotarIzquierdaPrima = [
  8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8,
  9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14,
  13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5,
  12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11,
];

function valoresInicialesAArreglo(arregloValoresIniciales) {
  arregloValoresIniciales[0] = 0x67452301;
  arregloValoresIniciales[1] = 0xefcdab89;
  arregloValoresIniciales[2] = 0x98badcfe;
  arregloValoresIniciales[3] = 0x10325476;
  arregloValoresIniciales[4] = 0xc3d2e1f0;
}

function numCerosPadding(arregloBytesMensaje) {
  var cantidadBytesMensaje = arregloBytesMensaje.length;

  var cantidadCeros;

  if (cantidadBytesMensaje % 64 < 56) {
    cantidadCeros = 56 - (cantidadBytesMensaje % 64);
  } else {
    cantidadCeros = 64 + 56 - (cantidadBytesMensaje % 64);
  }
  return cantidadCeros;
}

function anadirCerosBits(arregloBytesMensaje) {
  var tempArray = [];

  arregloBytesMensaje.forEach((element) => {
    tempArray.push(element);
  });

  tempArray.push(128);

  for (var i = 0; i < numCerosPadding(arregloBytesMensaje) - 1; i++) {
    tempArray.push(0);
  }

  return new Uint8Array(tempArray);
}

function anadirLongitudMensaje(arregloBytesMensaje, superBloqueTemporal) {
  var longitudDelMensajeNumeroDeBits = new Number(
    arregloBytesMensaje.length << 3
  );

  var buffer = new ArrayBuffer(8);
  var vistaDeDatos = new DataView(buffer);

  vistaDeDatos.setUint32(0, longitudDelMensajeNumeroDeBits, true);

  var bytesLongitudMensaje = new Uint8Array(buffer);

  var superBloque = new Uint8Array(
    superBloqueTemporal.length + bytesLongitudMensaje.length
  );

  superBloque.set(superBloqueTemporal, 0);

  superBloque.set(bytesLongitudMensaje, superBloqueTemporal.length);

  return superBloque;
}

function construirSuperBloque(mensajeEnBytes) {
  const arregloSinLongitud = anadirCerosBits(mensajeEnBytes);

  const superBloque = anadirLongitudMensaje(mensajeEnBytes, arregloSinLongitud);

  return superBloque;
}

function subdividirBloqueEn16Words(bloqueDelMensaje) {
  var result = new Uint32Array(16);

  result = to32Bit(bloqueDelMensaje);

  return result;
}

function obtenerHash(mensajeString) {
  const utf8EncodeText = new TextEncoder();

  const mensajeBytes = utf8EncodeText.encode(mensajeString);

  var superBloque = construirSuperBloque(mensajeBytes);

  var buffers = new Uint32Array(5);

  valoresInicialesAArreglo(buffers);

  for (var i = 0; i < superBloque.length / 64; i++) {
    const indiceInicialBloque = i * 64;

    var bloque = new Uint8Array(
      superBloque.slice(indiceInicialBloque, indiceInicialBloque + 64)
    );

    var words16 = subdividirBloqueEn16Words(bloque);

    buffers = compresion(words16, buffers);
  }

  return convertirBuffersABytes(buffers);
}

function constantesAAgregar(j) {
  if (j <= 15) {
    return 0x00000000;
  } else if (j <= 31) {
    return 0x5a827999;
  } else if (j <= 47) {
    return 0x6ed9eba1;
  } else if (j <= 63) {
    return 0x8f1bbcdc;
  } else {
    return 0xa953fd4e;
  }
}

function constantesAAgregarPrima(j) {
  if (j <= 15) {
    return 0x50a28be6;
  } else if (j <= 31) {
    return 0x5c4dd124;
  } else if (j <= 47) {
    return 0x6d703ef3;
  } else if (j <= 63) {
    return 0x7a6d76e9;
  } else {
    return 0x00000000;
  }
}

function to32Bit(array8Bit) {
  const array32Bit = [];
  for (let i = 0; i < array8Bit.length; i += 4) {
    const int32Bit =
      array8Bit[i] |
      (array8Bit[i + 1] << 8) |
      (array8Bit[i + 2] << 16) |
      (array8Bit[i + 3] << 24);
    array32Bit.push(int32Bit);
  }
  return array32Bit;
}

function compresion(bloque16words, buffers) {
  console.log("Buffer inicial: ", buffers);
  console.log("16wrds: ", bloque16words);

  var h0 = buffers[0];
  var h1 = buffers[1];
  var h2 = buffers[2];
  var h3 = buffers[3];
  var h4 = buffers[4];

  var a = h0;
  var b = h1;
  var c = h2;
  var d = h3;
  var e = h4;

  var aPrima = h0;
  var bPrima = h1;
  var cPrima = h2;
  var dPrima = h3;
  var ePrima = h4;

  var wTemp, wTempPrima;

  for (let i = 0; i < 80; i++) {
    var indicePalabra = indiceMensajeAElegir[i];
    var indicePalabraPrima = indiceMensajeAElegirPrima[i];
    var cantidadRotar = cantidadARotarIzquierda[i];
    var cantidadRotarPrima = cantidadARotarIzquierdaPrima[i];

    if (i <= 15) {
      //Primera ronda
      wTemp =
        ROL(
          a +
            exor(b, c, d) +
            bloque16words[indicePalabra] +
            constantesAAgregar(i),
          cantidadRotar
        ) + e;

      a = e;
      e = d;
      d = ROL(c, 10);
      c = b;
      b = wTemp;

      //Prima
      wTempPrima =
        ROL(
          aPrima +
            opMinus2(bPrima, cPrima, dPrima) +
            bloque16words[indicePalabraPrima] +
            constantesAAgregarPrima(i),
          cantidadRotarPrima
        ) + ePrima;

      aPrima = ePrima;
      ePrima = dPrima;
      dPrima = ROL(cPrima, 10);
      cPrima = bPrima;
      bPrima = wTempPrima;
    } else if (i <= 31) {
      //Segunda ronda
      wTemp =
        ROL(
          a +
            mux(b, c, d) +
            bloque16words[indicePalabra] +
            constantesAAgregar(i),
          cantidadRotar
        ) + e;

      a = e;
      e = d;
      d = ROL(c, 10);
      c = b;
      b = wTemp;

      //Prima
      wTempPrima =
        ROL(
          aPrima +
            mux2(bPrima, cPrima, dPrima) +
            bloque16words[indicePalabraPrima] +
            constantesAAgregarPrima(i),
          cantidadRotarPrima
        ) + ePrima;

      aPrima = ePrima;
      ePrima = dPrima;
      dPrima = ROL(cPrima, 10);
      cPrima = bPrima;
      bPrima = wTempPrima;
    } else if (i <= 47) {
      //Tercera ronda

      wTemp =
        ROL(
          a +
            opMinus1(b, c, d) +
            bloque16words[indicePalabra] +
            constantesAAgregar(i),
          cantidadRotar
        ) + e;

      a = e;
      e = d;
      d = ROL(c, 10);
      c = b;
      b = wTemp;

      //Prima
      wTempPrima =
        ROL(
          aPrima +
            opMinus1(bPrima, cPrima, dPrima) +
            bloque16words[indicePalabraPrima] +
            constantesAAgregarPrima(i),
          cantidadRotarPrima
        ) + ePrima;

      aPrima = ePrima;
      ePrima = dPrima;
      dPrima = ROL(cPrima, 10);
      cPrima = bPrima;
      bPrima = wTempPrima;
    } else if (i <= 63) {
      //Cuarta Ronda

      wTemp =
        ROL(
          a +
            mux2(b, c, d) +
            bloque16words[indicePalabra] +
            constantesAAgregar(i),
          cantidadRotar
        ) + e;

      a = e;
      e = d;
      d = ROL(c, 10);
      c = b;
      b = wTemp;

      //Prima
      wTempPrima =
        ROL(
          aPrima +
            mux(bPrima, cPrima, dPrima) +
            bloque16words[indicePalabraPrima] +
            constantesAAgregarPrima(i),
          cantidadRotarPrima
        ) + ePrima;

      aPrima = ePrima;
      ePrima = dPrima;
      dPrima = ROL(cPrima, 10);
      cPrima = bPrima;
      bPrima = wTempPrima;
    } else {
      //ultima ronda

      wTemp =
        ROL(
          a +
            opMinus2(b, c, d) +
            bloque16words[indicePalabra] +
            constantesAAgregar(i),
          cantidadRotar
        ) + e;

      wTemp &= 0xffffffff;

      a = e;
      e = d;
      d = ROL(c, 10);
      c = b;
      b = wTemp;

      //Prima
      wTempPrima =
        ROL(
          aPrima +
            exor(bPrima, cPrima, dPrima) +
            bloque16words[indicePalabraPrima] +
            constantesAAgregarPrima(i),
          cantidadRotarPrima
        ) + ePrima;

      wTempPrima &= 0xffffffff;

      aPrima = ePrima;
      ePrima = dPrima;
      dPrima = ROL(cPrima, 10);
      cPrima = bPrima;
      bPrima = wTempPrima;
    }
  }

  console.log(a, b, c, d, e);

  console.log(aPrima, bPrima, cPrima, dPrima, ePrima);

  var tempBuffer = buffers[1] + c + dPrima;
  buffers[1] = buffers[2] + d + ePrima;
  buffers[2] = buffers[3] + e + aPrima;
  buffers[3] = buffers[4] + a + bPrima;
  buffers[4] = buffers[0] + b + cPrima;
  buffers[0] = tempBuffer;

  return buffers;
}

function convertirBuffersABytes(buffers) {
  var resultado = new Uint8Array(buffers.buffer);

  console.log(resultado);

  return resultado;
}

function ripemd160String(mensaje) {
  return convertirBytesAString(obtenerHash(mensaje));
}

function decimalToHex(decimal) {
    return decimal.toString(16).padStart(2, '0');
  }

function convertirBytesAString(Bytes) {

    const hexArray = Array.from(Bytes, decimalToHex);

    const hexString = hexArray.join('');

    return hexString


}

function test() {
  console.log(
    ripemd160String(
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    )
  );
}

test();
