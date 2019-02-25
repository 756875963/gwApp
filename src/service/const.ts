import { flatten } from "@angular/compiler";

interface CONST {
      readonly URL : String;
      readonly IMGURL : String;
      readonly VERSION : String;
      readonly UPDATEURL : String;
      readonly ENVIONMENT :boolean;//测试环境 true 模拟器  false 浏览器
}
 //let _url = "http://192.168.1.76:10005";
//  let _url = "http://10.201.0.49:10005/JWeb";
  let _url = "http://192.168.1.11:10005";
 //let _url = "http://192.168.1.69:10005";
 //let _url = "http://zy.capsui.com";
 //let _url = "http://58.211.227.39:11005/JWeb";
export const ActionType :CONST = {
       ENVIONMENT : false,
       //ENVIONMENT : false,
       VERSION : "v1.0.0",//版本号
       URL : _url ,// http://192.168.1.2:8084切记 http 请求url在打包时切换过来  测试时不需要填写http://192.168.31.204:10005
       IMGURL : _url, // 图片地址 http
       UPDATEURL : "http://192.168.1.39:8085"       // app更新地址
}
