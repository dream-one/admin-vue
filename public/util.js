export const base64ImgtoFile = function (dataurl, filename = 'file') {
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

//判断对象是否相等
//ob1:对象1 form对象
//obj2：对象2 选择的对象
//返回值：ture-相等  false-不相等
export const diff = function (obj1, obj2) {
  
  for (var attr in obj1) {//遍历obj1的对象
    var t1 = obj1[attr] instanceof Object
    var t2 = obj2[attr] instanceof Object

    if (attr == 'imageContent') {//要比较的属性名不一样 只好出此下策 - - 
      if (obj1[attr] !== obj2['Image'].split(',')[1]) {
        return false
      }
    }

    if(attr=='gradeValue'){
      if (obj1[attr] !== obj2['GradeName']) {
        return false
      }
    }

    if(attr=='classValue'){
      if (obj1[attr] !== obj2['ClassName']) {
        return false
      }
    }

    if (obj1[attr] == null || obj2[attr] == null) {
      continue
    }

    if (t1 && t2) {
      return diff(obj1[attr], obj2[attr])
    } else if (obj1[attr] !== obj2[attr]) {
      return false
    }
  }
  return true
}
