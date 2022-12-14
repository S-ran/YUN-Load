export function formatDate(date, fmt) {
    //获取年份
    //
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
};

function padLeftZero (str) {
  return ('00' + str).substr(str.length);
};

export  function getArrDifference(arr1, arr2) {
  return arr1.concat(arr2).filter( (v, i, arr) =>{
    return arr.indexOf(v) === arr.lastIndexOf(v);
  });
};

export  function getArrCrux(arr , string) {
  return arr.filter( (v) =>{
      return v.indexOf(string) !== -1
  });
}