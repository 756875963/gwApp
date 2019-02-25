import { lSe } from '../public/localstorage';
export const direction ={
    getWnindirection:function(obj){
          let _screenDirection:string;
          //判断当前屏幕的方向和高端，宽度
          _screenDirection = screen.availWidth<screen.availHeight ? "竖屏" : "横屏";
          let _this  = obj;
          window.addEventListener("orientationchange",function(){
                if(window.orientation=='0'){
                    //竖屏
                    _screenDirection = "竖屏"
                    _this.fcn.screen({appWidth:screen.availWidth,appHeight:screen.availHeight,screenDirection:_screenDirection,that:_this});
                }else if(window.orientation=='90'){
                    //横屏"
                    _screenDirection = "横屏"  
                    _this.fcn.screen({appWidth:screen.availWidth,appHeight:screen.availHeight,screenDirection:_screenDirection,that:_this});

                }
           });
         return {appWidth:screen.availWidth,appHeight:screen.availHeight,screenDirection:_screenDirection};
    }
}