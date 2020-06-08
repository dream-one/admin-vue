export const base64ImgtoFile = function(dataurl, filename = 'file') {
  // let arr = dataurl.split(',')
  // let mime = arr[0].match(/:(.*?);/)[1]
  // let suffix = mime.split('/')[1]
  // console.log(mime,suffix)//image/png png
  let bstr = atob(arr[1])
  let n = bstr.length
  let u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], `${filename}.jpeg`, {
    type: 'image/jpeg'
  })
}

export const diff = function(obj1, obj2) {
  console.log(obj1,obj2)
 
  if (Object.keys(obj1).length !== Object.keys(obj2).length) {
    return false
  }
  for (var attr in obj1) {
    var t1 = obj1[attr] instanceof Object
    var t2 = obj2[attr] instanceof Object
    if (t1 && t2) {
      return diff(obj1[attr], obj2[attr])
    } else if (obj1[attr] !== obj2[attr]) {
      return false
    }
  }
  return true
}
