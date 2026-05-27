/**
 * 上传附件转base64
 *
 * @param {File} file 文件流
 */
export const fileByBase64 = (file: any): any => {
  return new Promise((resolve, reject) => {
    var reader = new FileReader();
    // 传入一个参数对象即可得到基于该参数对象的文本内容
    reader.readAsDataURL(file);
    reader.onload = function (e: any) {
      // target.result 该属性表示目标对象的DataURL
      resolve(e.target.result.replace(/^data:image\/\w+;base64,/, ''));
    };
  });
};
