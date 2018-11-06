export const lSe ={
    getItem :function getItem(key){
         if(localStorage.getItem(key)&&JSON.stringify(JSON.parse(localStorage.getItem(key)))!="{}"){
           return JSON.parse(localStorage.getItem(key));
         }else{
           return null;
         }
     },
     setItem :function setItem(key:string,obj:object){
         localStorage.setItem(key,JSON.stringify(obj));
        //  if(JSON.stringify(obj) != "{}"){
        //     localStorage.setItem(key,JSON.stringify(obj));
        //  }else{
        //     return null;
        //  }
     },
     popAll :function(){
        localStorage.setItem("pop","true");
     }
}
//{user:{username:'xxx',password:'xxx',state:true}} 三个字段 state当前登陆状态
//{memory:{username:'xxx',password:'xxx'}}          记住账号