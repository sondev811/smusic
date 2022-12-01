import { devices } from "../constants/player";

export const decodeHtmlEntity = function(str) {
  return str.replace(/&#(\d+);/g, function(match, dec) {
    return String.fromCharCode(dec);
  });
};

export const removeAccents = (str) => {
  return str.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

export const rgbToHex = (arg) => '#' + arg.map(x => {
  const hex = x.toString(16)
  return hex.length === 1 ? '0' + hex : hex
}).join('');

export const rgb = (arg) => `rgb(${arg[0]},${arg[1]},${arg[2]})`;

export const rgba = (arg, opacity) => `rgb(${arg[0]},${arg[1]},${arg[2]}, ${opacity})`;

export const detectDevice = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  let result = devices.unknown;
  if (userAgent.match(/android/i)) {
    result = devices.android;
  } else if (userAgent.match(/(Mac|iPhone|iPod|iPad)/i)) {
    result = devices.apple;
  }
  return result;
}
