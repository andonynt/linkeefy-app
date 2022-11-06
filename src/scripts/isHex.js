export default function isHex(color) {
  let regex = /^#([A-F0-9]{3,4}|[A-F0-9]{6}|[A-F0-9]{8})$/i;
  // console.log(regex.exec(color));
  return regex.exec(color);
}