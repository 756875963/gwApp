interface CONST {
      readonly URL : String ;
      readonly IMGURL : String ;
      readonly VERSION : String ;
}

export const ActionType :CONST = {
       VERSION : "v1.0.0",//版本号
       URL : "http://192.168.31.204:10005" , // http://192.168.1.2:8084切记 http 请求url在打包时切换过来  测试时不需要填写http://192.168.31.204:10005
       IMGURL : "http://192.168.31.204:10005/static/assets/upload/mobile/"// 图片地址 http
}
