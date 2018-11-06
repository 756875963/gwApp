
import { Injectable } from '@angular/core';
import { Http ,RequestOptions ,Headers ,URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/map';
import '../service/IBase';
import { ActionType} from './const';
import { Session } from '../service/session';
import { ERROR } from '../entity/error';

@Injectable()
export class Exception implements IBase{
    constructor(public http: Http ,public session:Session) {
        
    }
    async do(){
        let data;
       return await new Promise((resolve,reject)=>{
           setTimeout(()=>{
               resolve(12);
               console.log("顺序1");
               return 12;
           },5000);
       });
   }
  
    //app出错统一异常处理http提交记录  
    //处理类型：是为了返回数据不完整，但是java后台未处理 导致app处理解构json出错 提交数据库记录
    public async errorhttp(params:ERROR){
        console.log(params);
         let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
         let options = new RequestOptions({headers: headers});
         let _Params = new URLSearchParams();
         _Params.set("err_page",params.err_page);
         _Params.set("err_data",params.err_data);
         _Params.set("err_reason",params.err_reason);
         _Params.set("loginid",params.loginid);
         return await new Promise((resolve, reject) => {
             //http://10.80.4.119:8081/
            this.http.post(ActionType.URL+"/mobile/frontend/work/errorCollection/"+ActionType.VERSION, _Params , options).map(
                res => res.json()).subscribe(data => resolve(data), err => reject(err))})
    }

}
