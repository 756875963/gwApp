import { Injectable } from '@angular/core';
import { Http ,RequestOptions ,Headers ,URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/map';
import { pageBean } from '../entity/pageBean';
import '../service/IBase';
import { ActionType} from './const';
import { Session } from '../service/session';
import { lSe } from '../public/localstorage';

@Injectable()
export class ServiceProvider implements IBase {
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
    
    public async getList(params) {
        console.log(params);
        return await new Promise((resolve, reject) => {
            this.http.get(ActionType.URL+"/springboot/getUserByGet", { search:params})
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                }, err => {
                    reject(err);
                })
        })
    }

    // 1.验证登录
    // return {"msg":"success|error","data":"ok|no"}
    public async VerificationLogin(params){
         console.log(params);
         let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
         let options = new RequestOptions({headers: headers});
         let _Params = new URLSearchParams();
         _Params.set("data",JSON.stringify(params));
         return await new Promise((resolve, reject) => {
             //http://10.80.4.119:8081/
            this.http.post(ActionType.URL+"/springboot/getUserByJson", _Params , options).map(
                res => res.json()).subscribe(data => resolve(data), err => reject(err))})


    }
     // 1.验证登录
    // return {"msg":"success|error","data":"ok|no"}
    public async VerificationLoginTwo(params){
        console.log(params);
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
        let options = new RequestOptions({headers: headers});
        let _Params = new URLSearchParams();
        let body = this.toQueryString(params);
        _Params.set("data",JSON.stringify(params));
        return await new Promise((resolve, reject) => {
           this.http.post(ActionType.URL+"/mobile/frontend/basic/login/"+ActionType.VERSION, body , options).map(
               res => res.json()).subscribe((data) =>{
                   console.log(data);
                   if(data.ok){
                    this.session.setSession(data.data.sessionid);
                    this.session.setRole(data.data.record.rolename);
                    this.session.setLogin(data.data.record.loginid);
                   }
                   resolve(data);
                }, err => reject(err))})


   }
    //2.任务列表
    //
    public  async Tasklist(page,menu_type){
        console.log(menu_type);
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
        let options = new RequestOptions({headers: headers});
        let  _data ={page:1,rows:10};//work_time 0:夜班 ，1:白班
        console.log(page);
        _data = Object.assign(page,
            {sessionid:this.session.getSession()},
            {roleid:this.session.getRole()},
            {rolename:this.session.getRole()},
            {loginid:this.session.getLogin()},
            {menu_type:menu_type}
            );
        console.log(_data);
        return  await new Promise((resolve, reject) => {
            this.http.post(ActionType.URL+"/mobile/frontend/dWorkAssignmentBook/data/"+ActionType.VERSION, this.toQueryString(_data), options)
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                    console.log(1,data);
                }, err => {
                    reject(err);
                })
        })
    }
    
    //3.根据任务作业编号查询作业人员列表
    public async addPersonnelByJobnumber(params) {
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
        let options = new RequestOptions({headers: headers});
        console.log(params);
        let _data = Object.assign(params,
            {sessionid:this.session.getSession()},
            {roleid:this.session.getRole()},
            {rolename:this.session.getRole()});
        console.log(_data);
        return await new Promise((resolve, reject) => {
            this.http.post(ActionType.URL+"/mobile/frontend/pYard/findById/"+ActionType.VERSION,this.toQueryString(_data),options)
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                }, err => {
                    reject(err);
                })
        })
    }

    //4.查询人员列表
    public async PersonnelList(params) {
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
        let options = new RequestOptions({headers: headers});
        console.log(11,params);
        let  _data = Object.assign(params,
            {session:this.session.getSession()},
            {roleid:this.session.getRole()},
            {rolename:this.session.getRole()});
        console.log(_data);
        return await new Promise((resolve, reject) => {
            this.http.post(ActionType.URL+"/mobile/frontend/pYard/data/"+ActionType.VERSION, this.toQueryString(_data),options)
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                }, err => {
                    reject(err);
                })
        })
    }


     //5.提交保存派工
    //
    public  async  submitDispatchedworkers(page){
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
        let options = new RequestOptions({headers: headers});
        let  _data ={page:1,rows:10};//work_time 0:夜班 ，1:白班
        console.log(page);
        _data = Object.assign(page,
            {sessionid:this.session.getSession()},
            {roleid:this.session.getRole()},
            {rolename:this.session.getRole()});
        console.log(_data);
        return  await new Promise((resolve, reject) => {
            this.http.post(ActionType.URL+"/mobile/frontend/pYard/save/"+ActionType.VERSION, this.toQueryString(_data), options)
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                    console.log(1,data);
                }, err => {
                    reject(err);
                })
        })
    }

    //6.页面跳转接受作业安全规定
    public async safetyjop (params) {
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
        let options = new RequestOptions({headers: headers});
        console.log(11,params);
        let  _data = Object.assign(params,
            {session:this.session.getSession()},
            {roleid:this.session.getRole()},
            {rolename:this.session.getRole()});
        console.log(_data);
        return await new Promise((resolve, reject) => {
            this.http.post(ActionType.URL+"/mobile/frontend/work/save_read/"+ActionType.VERSION, this.toQueryString(_data),options)
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                }, err => {
                    reject(err);
                })
        })
    }


    //7.外理理货页面数据
    public async externalRationale (params) {
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
        let options = new RequestOptions({headers: headers});
        console.log(11,params);
        let  _data = Object.assign(params,
            {session:this.session.getSession()},
            {roleid:this.session.getRole()},
            {rolename:this.session.getRole()});
        console.log(_data);
        return await new Promise((resolve, reject) => {
            this.http.post(ActionType.URL+"/mobile/frontend/assignmentworker/data/"+ActionType.VERSION, this.toQueryString(_data),options)
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                }, err => {
                    reject(err);
                })
        })
    }

    //8.外理理货页面提交数据
    public async startExternalRationale (params) {
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
        let options = new RequestOptions({headers: headers});
        console.log(11,params);
        let  _data = Object.assign(params,
            {session:this.session.getSession()},
            {roleid:this.session.getRole()},
            {rolename:this.session.getRole()});
        console.log(_data);
        return await new Promise((resolve, reject) => {
            this.http.post(ActionType.URL+"/mobile/frontend/work/send/"+ActionType.VERSION, this.toQueryString(_data),options)
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                }, err => {
                    reject(err);
                })
        })
    }
   
    //9.外理页面数据回滚最新一条
    public async rollblackExternalRationale (params) {
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
        let options = new RequestOptions({headers: headers});
        console.log(11,params);
        let  _data = Object.assign(params,
            {session:this.session.getSession()},
            {roleid:this.session.getRole()},
            {rolename:this.session.getRole()});
        console.log(_data);
        return await new Promise((resolve, reject) => {
            this.http.post(ActionType.URL+"/mobile/frontend/work/getlast/"+ActionType.VERSION, this.toQueryString(_data),options)
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                }, err => {
                    reject(err);
                })
        })
    }

    //10.库场员理货（入库）
    public async warehouse (params) {
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
        let options = new RequestOptions({headers: headers});
        console.log(11,params);
        let  _data = Object.assign(params,
            {session:this.session.getSession()},
            {roleid:this.session.getRole()},
            {rolename:this.session.getRole()});
        console.log(_data);
        return await new Promise((resolve, reject) => {
            this.http.post(ActionType.URL+"/mobile/frontend/work/kcdata/"+ActionType.VERSION, this.toQueryString(_data),options)
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                }, err => {
                    reject(err);
                })
        })
    }
    
    //11.库场员提交数据
    public async warehouse_submit (params) {
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
        let options = new RequestOptions({headers: headers});
        console.log(11,params);
        let  _data = Object.assign(params,
            {session:this.session.getSession()},
            {roleid:this.session.getRole()},
            {rolename:this.session.getRole()});
        console.log(_data);
        return await new Promise((resolve, reject) => {
            this.http.post(ActionType.URL+"/mobile/frontend/work/kcsend/"+ActionType.VERSION, this.toQueryString(_data),options)
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                }, err => {
                    reject(err);
                })
        })
    }

    //12.用户名登出
    public async logout (params) {
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
        let options = new RequestOptions({headers: headers});
        console.log(11,params);
        let  _data = Object.assign(params,
            {session:this.session.getSession()},
            {roleid:this.session.getRole()},
            {rolename:this.session.getRole()});
        console.log(_data);
        return await new Promise((resolve, reject) => {
            this.http.post(ActionType.URL+"/mobile/frontend/basic/logout/"+ActionType.VERSION, this.toQueryString(_data),options)
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                }, err => {
                    reject(err);
                })
        })
    }
 
    //13.库场员数据回滚方法
    public async rollbacktally (params) {
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
        let options = new RequestOptions({headers: headers});
        console.log(11,params);
        let  _data = Object.assign(params,
            {session:this.session.getSession()},
            {roleid:this.session.getRole()},
            {rolename:this.session.getRole()});
        console.log(_data);
        return await new Promise((resolve, reject) => {
            this.http.post(ActionType.URL+"/mobile/frontend/work/getkclast/"+ActionType.VERSION, this.toQueryString(_data),options)
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                }, err => {
                    reject(err);
                })
        })
    }

    //14.查询人员列表
    public async commons(params){
        console.log(params);
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
         let options = new RequestOptions({headers: headers});
         let _Params = new URLSearchParams();
         _Params.set("data",JSON.stringify(params));
         return await new Promise((resolve, reject) => {
            this.http.post(ActionType.URL+"mobile/frontend/minorwork/data/", _Params , options).map(
                res => res.json()).subscribe(data => resolve(data), err => reject(err))})
        
    }

    //15.零星作业app接口
    public async getPayTheFees(params){
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
        let options = new RequestOptions({headers: headers});
        console.log(11,params);
        let  _data = Object.assign(params,
            {session:this.session.getSession()},
            {roleid:this.session.getRole()},
            {rolename:this.session.getRole()});
        console.log(_data);
        return await new Promise((resolve, reject) => {
            this.http.post(ActionType.URL+"/mobile/frontend/minorwork/data/"+ActionType.VERSION, this.toQueryString(_data),options)
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                }, err => {
                    reject(err);
                })
        })
    }

    //16.码单列列表
    public async getWeightSheet(params){
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
        let options = new RequestOptions({headers: headers});
        console.log(11,params);
        let  _data = Object.assign(params,
            {session:this.session.getSession()},
            {roleid:this.session.getRole()},
            {rolename:this.session.getRole()});
        console.log(_data);
        return await new Promise((resolve, reject) => {
            this.http.post(ActionType.URL+"/mobile/frontend/pWoodYardBill/data/"+ActionType.VERSION, this.toQueryString(_data),options)
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                }, err => {
                    reject(err);
                })
        })
    }
    //17.车提页面数据
    public async getVehicle(params){
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
        let options = new RequestOptions({headers: headers});
        console.log(11,params);
        let  _data = Object.assign(params,
            {session:this.session.getSession()},
            {roleid:this.session.getRole()},
            {rolename:this.session.getRole()});
        console.log(_data);
        return await new Promise((resolve, reject) => {
            this.http.post(ActionType.URL+"/mobile/frontend/pWoodYardBill/data/"+ActionType.VERSION, this.toQueryString(_data),options)
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                }, err => {
                    reject(err);
                })
        })
    }
    //18.车提列表查询
    public async getdeLiveryList(params){
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
        let options = new RequestOptions({headers: headers});
        console.log(11,params);
        let  _data = Object.assign(params,
            {session:this.session.getSession()},
            {roleid:this.session.getRole()},
            {rolename:this.session.getRole()});
        console.log(_data);
        return await new Promise((resolve, reject) => {
            this.http.post(ActionType.URL+"/mobile/frontend/work/deliveryList/"+ActionType.VERSION, this.toQueryString(_data),options)
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                }, err => {
                    reject(err);
                })
        })
    }

   //19.车提页面 根据出库单号 拉起页面数据 deliveryDataByYardNo
   public async deliveryDataByYardNo (params){
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
        let options = new RequestOptions({headers: headers});
        console.log(11,params);
        let  _data = Object.assign(params,
            {session:this.session.getSession()},
            {roleid:this.session.getRole()},
            {rolename:this.session.getRole()});
        console.log(_data);
        return await new Promise((resolve, reject) => {
            this.http.post(ActionType.URL+"/mobile/frontend/work/workdata/"+ActionType.VERSION, this.toQueryString(_data),options)
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                }, err => {
                    reject(err);
                })
        })
    }
    //20.库场发货/mobile/frontend/work/kcwoodsend
    public async kcwoodsend (params){
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
        let options = new RequestOptions({headers: headers});
        console.log(11,params);
            let formdata = {
                formdata:JSON.stringify(params),
                session:this.session.getSession(),
                roleid:this.session.getRole(),
                rolename:this.session.getRole()
            }
        console.log(formdata);
        return await new Promise((resolve, reject) => {
            this.http.post(ActionType.URL+"/mobile/frontend/work/kcwoodsend/"+ActionType.VERSION, this.toQueryString(formdata),options)
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                }, err => {
                    reject(err);
                })
        })
    }
    //21.根据有效的出库单查询翻桩信息
    public async yarddelivery (params){
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
        let options = new RequestOptions({headers: headers});
        console.log(11,params);
        let  _data = Object.assign(params,
            {session:this.session.getSession()},
            {roleid:this.session.getRole()},
            {rolename:this.session.getRole()});
        console.log(_data);
        return await new Promise((resolve, reject) => {
            this.http.post(ActionType.URL+"/mobile/frontend/yarddelivery/data/"+ActionType.VERSION, this.toQueryString(_data),options)
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                }, err => {
                    reject(err);
                })
        })
    }
    //22.库场员出库数据回退
    public async getKcwoodlastSend (params){
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
        let options = new RequestOptions({headers: headers});
        console.log(11,params);
        let  _data = Object.assign(params,
            {session:this.session.getSession()},
            {roleid:this.session.getRole()},
            {rolename:this.session.getRole()});
        console.log(_data);
        return await new Promise((resolve, reject) => {
            this.http.post(ActionType.URL+"/mobile/frontend/work/getKcwoodlastSend/"+ActionType.VERSION, this.toQueryString(_data),options)
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                }, err => {
                    reject(err);
                })
        })
    }
    //23.天气预报
    public async getAppbasic(){
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
        let options = new RequestOptions({headers: headers});
        return await new Promise((resolve, reject) => {
            this.http.post(ActionType.URL+"/mobile/frontend/appbasic/data/"+ActionType.VERSION, null,options)
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                }, err => {
                    reject(err);
                })
        })
    }
    //24.修改密码；* @param loginid   登录人id
    // * @param old_pass  原密码
    // * @param new_pass  新密码
     //* @param comfirm_pass  确认新密码
    public async change(params){
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
        let options = new RequestOptions({headers: headers});
        let _Params = new URLSearchParams();
        _Params.set("loginid",params.loginid);
        _Params.set("old_pass",params.old_pass);
        _Params.set("new_pass",params.new_pass);
        _Params.set("comfirm_pass",params.comfirm_pass);
        return await new Promise((resolve, reject) => {
            this.http.post(ActionType.URL+"/mobile/frontend/basic/change/"+ActionType.VERSION, _Params,options)
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                }, err => {
                    reject(err);
                })
        })
    }
    //25.获取驳船列表/mobile/frontend/work/getQBBargeName
    public async getQBBargeName (params){
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
        let options = new RequestOptions({headers: headers});
        console.log(11,params);
        let  _data = Object.assign(params,
            {session:this.session.getSession()},
            {roleid:this.session.getRole()},
            {rolename:this.session.getRole()});
        console.log(_data);
        return await new Promise((resolve, reject) => {
            this.http.post(ActionType.URL+"/mobile/frontend/work/getQBBargeName/"+ActionType.VERSION, this.toQueryString(_data),options)
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                }, err => {
                    reject(err);
                })
        })
    }
    //26.根据船名查询数据 getOrderDetailById
    public async getOrderDetailById (params){
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
        let options = new RequestOptions({headers: headers});
        let _Params = new URLSearchParams();
        _Params.set("id",params.id);
        return await new Promise((resolve, reject) => {
            this.http.post(ActionType.URL+"/mobile/frontend/work/getOrderDetailById/"+ActionType.VERSION,_Params,options)
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                }, err => {
                    reject(err);
                })
        })
    }
    //27.水平司机页面数据拉取；
    public async getspdataById (params){
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
        let options = new RequestOptions({headers: headers});
        let _Params = new URLSearchParams();
        _Params.set("loginid",params.loginid);
        _Params.set("book_id",params.book_id);
        return await new Promise((resolve, reject) => {
            this.http.post(ActionType.URL+"/mobile/frontend/work/spdata/"+ActionType.VERSION,_Params,options)
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                }, err => {
                    reject(err);
                })
        })
    }
   //参数序列化  
     private toQueryString(obj){    
        let result = [];       
        for (let key in obj) { 
            key = encodeURIComponent(key);         
            let values = obj[key];       
            if (values && values.constructor == Array) {          
                let queryValues = [];          
                for (let i = 0, len = values.length, value; i < len; i++) {   
                    value = values[i];           
                     queryValues.push(this.toQueryPair(key, value));
                 }                
                result = result.concat(queryValues);           
             } else {   
                 result.push(this.toQueryPair(key, values));     
             }      
        }       
         return result.join('&');    
    }

    //参数序列化    
    private toQueryPair(key, value) {    
            if (typeof value == 'undefined') {      
                    return key;    
            }     
            return key + '=' + encodeURIComponent(value === null ? '' : String(value));
    }
}