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
               
                return 12;
            },5000);
        });
    }
    
    public async getList(params) {
        
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
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
        let options = new RequestOptions({headers: headers});
        let _Params = new URLSearchParams();
        let body = this.toQueryString(params);
        _Params.set("data",JSON.stringify(params));
        return await new Promise((resolve, reject) => {
           this.http.post(ActionType.URL+"/mobile/frontend/basic/login/"+ActionType.VERSION, body , options).map(
               res => res.json()).subscribe((data) =>{
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
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
        let options = new RequestOptions({headers: headers});
        let  _data ={page:1,rows:10};//work_time 0:夜班 ，1:白班
        _data = Object.assign(page,
            {sessionid:this.session.getSession()},
            {roleid:this.session.getRole()},
            {rolename:this.session.getRole()},
            {loginid:this.session.getLogin()},
            {menu_type:menu_type}
            );
        return  await new Promise((resolve, reject) => {
            this.http.post(ActionType.URL+"/mobile/frontend/dWorkAssignmentBook/data/"+ActionType.VERSION, this.toQueryString(_data), options)
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                    
                }, err => {
                    reject(err);
                })
        })
    }
    
    //3.根据任务作业编号查询作业人员列表
    public async addPersonnelByJobnumber(params) {
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
        let options = new RequestOptions({headers: headers});
        
        let _data = Object.assign(params,
            {sessionid:this.session.getSession()},
            {roleid:this.session.getRole()},
            {rolename:this.session.getRole()});
        
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
       
        let  _data = Object.assign(params,
            {session:this.session.getSession()},
            {roleid:this.session.getRole()},
            {rolename:this.session.getRole()},
            {loginid:this.session.getLogin()});
        
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
        
        _data = Object.assign(page,
            {sessionid:this.session.getSession()},
            {roleid:this.session.getRole()},
            {rolename:this.session.getRole()});
        
        return  await new Promise((resolve, reject) => {
            this.http.post(ActionType.URL+"/mobile/frontend/pYard/save/"+ActionType.VERSION, this.toQueryString(_data), options)
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                    
                }, err => {
                    reject(err);
                })
        })
    }

    //6.页面跳转接受作业安全规定
    public async safetyjop (params) {
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
        let options = new RequestOptions({headers: headers});
        
        let  _data = Object.assign(params,
            {session:this.session.getSession()},
            {roleid:this.session.getRole()},
            {rolename:this.session.getRole()});
        
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
        
        let  _data = Object.assign(params,
            {session:this.session.getSession()},
            {roleid:this.session.getRole()},
            {rolename:this.session.getRole()});
        
        return await new Promise((resolve, reject) => {
            this.http.post(ActionType.URL+"/mobile/frontend/work/data/"+ActionType.VERSION, this.toQueryString(_data),options)
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
        
        let  _data = Object.assign(params,
            {session:this.session.getSession()},
            {roleid:this.session.getRole()},
            {rolename:this.session.getRole()});
        
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
        
        let  _data = Object.assign(params,
            {session:this.session.getSession()},
            {roleid:this.session.getRole()},
            {rolename:this.session.getRole()});
        
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
        
        let  _data = Object.assign(params,
            {session:this.session.getSession()},
            {roleid:this.session.getRole()},
            {rolename:this.session.getRole()});
        
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
        
        let  _data = Object.assign(params,
            {session:this.session.getSession()},
            {roleid:this.session.getRole()},
            {rolename:this.session.getRole()});
        
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
        
        let  _data = Object.assign(params,
            {session:this.session.getSession()},
            {roleid:this.session.getRole()},
            {rolename:this.session.getRole()});
        
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
        
        let  _data = Object.assign(params,
            {session:this.session.getSession()},
            {roleid:this.session.getRole()},
            {rolename:this.session.getRole()});
        
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
        
        let  _data = Object.assign(params,
            {session:this.session.getSession()},
            {roleid:this.session.getRole()},
            {rolename:this.session.getRole()});
        
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
        
        let  _data = Object.assign(params,
            {session:this.session.getSession()},
            {roleid:this.session.getRole()},
            {rolename:this.session.getRole()});
        
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
    //16.1 装车 保存，单根木头
    public async saveVehicleStorage(params){
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
        let options = new RequestOptions({headers: headers});       
        let  _data = Object.assign(params,
            {session:this.session.getSession()},
            {roleid:this.session.getRole()},
            {rolename:this.session.getRole()},
            {loginid:this.session.getLogin()});
        
        return await new Promise((resolve, reject) => {
            this.http.post(ActionType.URL+"/mobile/frontend/pWoodYardBill/save/"+ActionType.VERSION, this.toQueryString(_data),options)
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                }, err => {
                    reject(err);
                })
        })
    }
     //16.2 获取当前层的数据arr
     public async getWoodCar(params){
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
        let options = new RequestOptions({headers: headers});
        
        let  _data = Object.assign(
            {formdata:JSON.stringify(params)},
            {session:this.session.getSession()},
            {roleid:this.session.getRole()},
            {rolename:this.session.getRole()},
            {loginid:this.session.getLogin()});
        return await new Promise((resolve, reject) => {
            this.http.post(ActionType.URL+"/mobile/frontend/pWoodYardBill/getWoodCar/"+ActionType.VERSION, this.toQueryString(_data),options)
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                }, err => {
                    reject(err);
                })
        })
    }
         //16.3 删除单根木头
         public async deleteWoodCar(params){
            let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
            let options = new RequestOptions({headers: headers});
            
            let  _data = Object.assign(params,
                {session:this.session.getSession()},
                {roleid:this.session.getRole()},
                {rolename:this.session.getRole()},
                {loginid:this.session.getLogin()});
            
            return await new Promise((resolve, reject) => {
                this.http.post(ActionType.URL+"/mobile/frontend/pWoodYardBill/save/"+ActionType.VERSION, this.toQueryString(_data),options)
                    .map(res => res.json())
                    .subscribe(data => {
                        resolve(data);
                    }, err => {
                        reject(err);
                    })
            })
        }
         //16.4  中间层保存，获取十层的text
         public async modelSaveWoodCar(params){
            let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
            let options = new RequestOptions({headers: headers});
            
            let  _data = Object.assign(
                {formdata:JSON.stringify(params)},
                {session:this.session.getSession()},
                {roleid:this.session.getRole()},
                {rolename:this.session.getRole()},
                {loginid:this.session.getLogin()});
            
            return await new Promise((resolve, reject) => {
                this.http.post(ActionType.URL+"/mobile/frontend/pWoodYardBill/modelSave/"+ActionType.VERSION, this.toQueryString(_data),options)
                    .map(res => res.json())
                    .subscribe(data => {
                        resolve(data);
                    }, err => {
                        reject(err);
                    })
            })
        }
          //16.5  是否清空原车数据
          public async toClear(params){
            let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
            let options = new RequestOptions({headers: headers});
            
            let  _data = Object.assign(
                {formdata:JSON.stringify(params)},
                {session:this.session.getSession()},
                {roleid:this.session.getRole()},
                {rolename:this.session.getRole()},
                {loginid:this.session.getLogin()});
            
            return await new Promise((resolve, reject) => {
                this.http.post(ActionType.URL+"/mobile/frontend/pWoodYardBill/deleteCar/"+ActionType.VERSION, this.toQueryString(_data),options)
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
        
        let  _data = Object.assign(params,
            {session:this.session.getSession()},
            {roleid:this.session.getRole()},
            {rolename:this.session.getRole()});
        
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
        
        let  _data = Object.assign(params,
            {session:this.session.getSession()},
            {roleid:this.session.getRole()},
            {rolename:this.session.getRole()});
        
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
        
        let  _data = Object.assign(params,
            {session:this.session.getSession()},
            {roleid:this.session.getRole()},
            {rolename:this.session.getRole()});
        
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
       
            let formdata = {
                formdata:JSON.stringify(params),
                session:this.session.getSession(),
                roleid:this.session.getRole(),
                rolename:this.session.getRole()
            }
        
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
        
        let  _data = Object.assign(params,
            {session:this.session.getSession()},
            {roleid:this.session.getRole()},
            {rolename:this.session.getRole()});
        
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
        
        let  _data = Object.assign(params,
            {session:this.session.getSession()},
            {roleid:this.session.getRole()},
            {rolename:this.session.getRole()});
        
        return await new Promise((resolve, reject) => {
            //this.http.post(ActionType.URL+"/mobile/frontend/work/getKcwoodlastSend/"+ActionType.VERSION, this.toQueryString(_data),options)
            this.http.post(ActionType.URL+"/mobile/frontend/pWoodYardBill/woodReverse/"+ActionType.VERSION, this.toQueryString(_data),options)
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
        
        let  _data = Object.assign(params,
            {session:this.session.getSession()},
            {roleid:this.session.getRole()},
            {rolename:this.session.getRole()});
        
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
    //28.水平司机提交数据；
    public async sendSpsend (params){
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
        let options = new RequestOptions({headers: headers});
        let _Params = new URLSearchParams();
        let form_data = {
            formdata:JSON.stringify(params),
            op_id:params.op_id,
            session:this.session.getSession(),
            roleid:this.session.getRole(),
            rolename:this.session.getRole(),
            loginid:this.session.getLogin()
        }
        return await new Promise((resolve, reject) => {
            this.http.post(ActionType.URL+"/mobile/frontend/work/spsend/"+ActionType.VERSION,this.toQueryString(form_data),options)
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                }, err => {
                    reject(err);
                })
        })
    }
    //29.水平司机回退getsplast
    public async getsplast(params){
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
        let options = new RequestOptions({headers: headers});
        let _Params = new URLSearchParams();
        let form_data = {
            book_id:params.book_id,
            session:this.session.getSession(),
            roleid:this.session.getRole(),
            rolename:this.session.getRole(),
            loginid:this.session.getLogin()
        }
        return await new Promise((resolve, reject) => {
            this.http.post(ActionType.URL+"/mobile/frontend/work/getsplast/"+ActionType.VERSION,this.toQueryString(form_data),options)
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                }, err => {
                    reject(err);
                })
        })
    }
    //30.装载机页面zzdata
    public async getZzdata(params){
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
        let options = new RequestOptions({headers: headers});
        let _Params = new URLSearchParams();
        let form_data = {
            book_id:params.book_id,
            session:this.session.getSession(),
            roleid:this.session.getRole(),
            rolename:this.session.getRole(),
            loginid:this.session.getLogin()
        }
        return await new Promise((resolve, reject) => {
            this.http.post(ActionType.URL+"/mobile/frontend/work/zzdata/"+ActionType.VERSION,this.toQueryString(form_data),options)
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                }, err => {
                    reject(err);
                })
        })
    }
    //31.装载机提交数据zzsend
    public async sendZsend (params){
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
        let options = new RequestOptions({headers: headers});
        let _Params = new URLSearchParams();
        let form_data = {
            formdata:JSON.stringify(params),
            session:this.session.getSession(),
            roleid:this.session.getRole(),
            rolename:this.session.getRole(),
            loginid:this.session.getLogin()
        }
        return await new Promise((resolve, reject) => {
            this.http.post(ActionType.URL+"/mobile/frontend/work/zzsend/"+ActionType.VERSION,this.toQueryString(form_data),options)
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                }, err => {
                    reject(err);
                })
        })
    }
    //32.装载机数据回退 getzzlast
    public async getzzlast(params){
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
        let options = new RequestOptions({headers: headers});
        let _Params = new URLSearchParams();
        let form_data = {
            book_id:params.book_id,
            session:this.session.getSession(),
            roleid:this.session.getRole(),
            rolename:this.session.getRole(),
            loginid:this.session.getLogin()
        }
        return await new Promise((resolve, reject) => {
            this.http.post(ActionType.URL+"/mobile/frontend/work/getzzlast/"+ActionType.VERSION,this.toQueryString(form_data),options)
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                }, err => {
                    reject(err);
                })
        })
    }
    //33.驳船提交数据 bargeInCommit
    public async bargeInCommit(params){
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
        let options = new RequestOptions({headers: headers});
        let _Params = new URLSearchParams();
        let form_data = {
            data:JSON.stringify(params),
            revert_flag:params.revert_flag,
            revert_id :params.revert_id,
            revert_operate_id :params.revert_operate_id,
            ticket_id:params.ticket_id,
            session:this.session.getSession(),
            roleid:this.session.getRole(),
            rolename:this.session.getRole(),
            loginid:this.session.getLogin()
        }
        return await new Promise((resolve, reject) => {
            this.http.post(ActionType.URL+"/mobile/frontend/work/bargeInCommit/"+ActionType.VERSION,this.toQueryString(form_data),options)
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                }, err => {
                    reject(err);
                })
        })
    }
    //34.驳船数据撤回 revertQiBo
    public async revertQiBo(params){
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
        let options = new RequestOptions({headers: headers});
        //let _Params = new URLSearchParams();
        let  _data = Object.assign(params,
            {session:this.session.getSession()},
            {roleid:this.session.getRole()},
            {rolename:this.session.getRole()},
            {loginid:this.session.getLogin()});
        return await new Promise((resolve, reject) => {
            this.http.post(ActionType.URL+"/mobile/frontend/work/revertQiBo/"+ActionType.VERSION,this.toQueryString(_data),options)
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                }, err => {
                    reject(err);
                })
        })
    }
   //35.起驳司机接收获取
   public async getQBDriverReceive (params) {
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    let options = new RequestOptions({headers: headers});
    
    let  _data = Object.assign(params,
        {session:this.session.getSession()},
        {roleid:this.session.getRole()},
        {rolename:this.session.getRole()});
   
    return await new Promise((resolve, reject) => {
        this.http.post(ActionType.URL+"/mobile/frontend/work/getQBDriverReceive/"+ActionType.VERSION, this.toQueryString(_data),options)
            .map(res => res.json())
            .subscribe(data => {
                resolve(data);
            }, err => {
                reject(err);
            })
    })
}
//36.起驳司机数据提交
public async qbDriverCommit (params) {
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    let options = new RequestOptions({headers: headers});
    let  _data = {submitresult:JSON.stringify(params),
        session:this.session.getSession(),
        roleid:this.session.getRole(),
        rolename:this.session.getRole(),
        loginid:this.session.getLogin(),
        ticket_id:params.ticket_id}
    return await new Promise((resolve, reject) => {
        this.http.post(ActionType.URL+"/mobile/frontend/work/qbDriverCommit/"+ActionType.VERSION, this.toQueryString(_data),options)
            .map(res => res.json())
            .subscribe(data => {
                resolve(data);
            }, err => {
                reject(err);
            })
    })
}
//37.起驳水平司机撤回指定id数据
public async revertQiBoDriver(params){
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    let options = new RequestOptions({headers: headers});
    //let _Params = new URLSearchParams();
    let  _data = Object.assign(params,
        {session:this.session.getSession()},
        {roleid:this.session.getRole()},
        {rolename:this.session.getRole()},
        {loginid:this.session.getLogin()});
    return await new Promise((resolve, reject) => {
        this.http.post(ActionType.URL+"/mobile/frontend/work/revertQiBoDriver/"+ActionType.VERSION,this.toQueryString(_data),options)
            .map(res => res.json())
            .subscribe(data => {
                resolve(data);
            }, err => {
                reject(err);
            })
    })
}
//38.起驳库场员撤回列表 revertQiBoList
public async revertQiBoList(params){
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    let options = new RequestOptions({headers: headers});
    //let _Params = new URLSearchParams();
    let  _data = Object.assign(params,
        {session:this.session.getSession()},
        {roleid:this.session.getRole()},
        {rolename:this.session.getRole()},
        {loginid:this.session.getLogin()});
    return await new Promise((resolve, reject) => {
        this.http.post(ActionType.URL+"/mobile/frontend/work/revertQiBoList/"+ActionType.VERSION,this.toQueryString(_data),options)
            .map(res => res.json())
            .subscribe(data => {
                resolve(data);
            }, err => {
                reject(err);
            })
    })
}
//38.起驳水平司机撤回列表 revertQiBoDriverList
public async revertQiBoDriverList(params){
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    let options = new RequestOptions({headers: headers});
    //let _Params = new URLSearchParams();
    let  _data = Object.assign(params,
        {session:this.session.getSession()},
        {roleid:this.session.getRole()},
        {rolename:this.session.getRole()},
        {loginid:this.session.getLogin()});
    return await new Promise((resolve, reject) => {
        this.http.post(ActionType.URL+"/mobile/frontend/work/revertQiBoDriverList/"+ActionType.VERSION,this.toQueryString(_data),options)
            .map(res => res.json())
            .subscribe(data => {
                resolve(data);
            }, err => {
                reject(err);
            })
    })
}
//39.起驳水平司机撤回库场，货位getQBDriverReceiveCondtions
public async getQBDriverReceiveCondtions(){
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    let options = new RequestOptions({headers: headers});
    //let _Params = new URLSearchParams();
    let  _data = Object.assign(
        {session:this.session.getSession()},
        {roleid:this.session.getRole()},
        {rolename:this.session.getRole()},
        {loginid:this.session.getLogin()});
    return await new Promise((resolve, reject) => {
        this.http.post(ActionType.URL+"/mobile/frontend/work/getQBDriverReceiveCondtions/"+ActionType.VERSION,this.toQueryString(_data),options)
            .map(res => res.json())
            .subscribe(data => {
                resolve(data);
            }, err => {
                reject(err);
            })
    })
}
//40. 件杂货落驳接收获取getLBData 
public async getLBData (params) {
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    let options = new RequestOptions({headers: headers});
   
    let  _data = Object.assign(params,
        {session:this.session.getSession()},
        {roleid:this.session.getRole()},
        {rolename:this.session.getRole()});
    
    return await new Promise((resolve, reject) => {
        this.http.post(ActionType.URL+"/mobile/frontend/work/getLBData/"+ActionType.VERSION, this.toQueryString(_data),options)
            .map(res => res.json())
            .subscribe(data => {
                resolve(data);
            }, err => {
                reject(err);
            })
    })
}
//41.件杂货提交 lbCommit
public async lbCommit (params) {
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    let options = new RequestOptions({headers: headers});
    let  _data = {submitresult:JSON.stringify(params),
        session:this.session.getSession(),
        roleid:this.session.getRole(),
        rolename:this.session.getRole(),
        loginid:this.session.getLogin(),
        ticket_id:params.ticket_id}
    return await new Promise((resolve, reject) => {
        this.http.post(ActionType.URL+"/mobile/frontend/work/lbCommit/"+ActionType.VERSION, this.toQueryString(_data),options)
            .map(res => res.json())
            .subscribe(data => {
                resolve(data);
            }, err => {
                reject(err);
            })
    })
}
//42.件杂货回退列表
public async revertLuoBoDriverList(params){
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    let options = new RequestOptions({headers: headers});
    //let _Params = new URLSearchParams();
    let  _data = Object.assign(params,
        {session:this.session.getSession()},
        {roleid:this.session.getRole()},
        {rolename:this.session.getRole()},
        {loginid:this.session.getLogin()});
    return await new Promise((resolve, reject) => {
        this.http.post(ActionType.URL+"/mobile/frontend/work/revertLuoBoDriverList/"+ActionType.VERSION,this.toQueryString(_data),options)
            .map(res => res.json())
            .subscribe(data => {
                resolve(data);
            }, err => {
                reject(err);
            })
    })
}
//43.件杂货出库单获取库场货位列表 getLBYardSiteData
public async getLBYardSiteData (params) {
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    let options = new RequestOptions({headers: headers});
    
    let  _data = Object.assign(params,
        {session:this.session.getSession()},
        {roleid:this.session.getRole()},
        {rolename:this.session.getRole()});
    
    return await new Promise((resolve, reject) => {
        this.http.post(ActionType.URL+"/mobile/frontend/work/getLBYardSiteData/"+ActionType.VERSION, this.toQueryString(_data),options)
            .map(res => res.json())
            .subscribe(data => {
                resolve(data);
            }, err => {
                reject(err);
            })
    })
}
//44.返回撤回数据json revertLuoBoDriver
public async revertLuoBoDriver (params) {
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    let options = new RequestOptions({headers: headers});
    let  _data = Object.assign(params,
        {session:this.session.getSession()},
        {roleid:this.session.getRole()},
        {loginid:this.session.getLogin()},
        {rolename:this.session.getRole()}
        );
        
    return await new Promise((resolve, reject) => {
        this.http.post(ActionType.URL+"/mobile/frontend/work/revertLuoBoDriver/"+ActionType.VERSION, this.toQueryString(_data),options)
            .map(res => res.json())
            .subscribe(data => {
                resolve(data);
            }, err => {
                reject(err);
            })
    })
}
//45.根据桩脚号和件号查询码单  /mobile/frontend/pWoodYardBill/mapping/v1.0.0
public async mapping (params) {
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    let options = new RequestOptions({headers: headers});
    let  _data = Object.assign(params,
        {session:this.session.getSession()},
        {roleid:this.session.getRole()},
        {loginid:this.session.getLogin()},
        {rolename:this.session.getRole()}
        );
        
    return await new Promise((resolve, reject) => {
        this.http.post(ActionType.URL+"/mobile/frontend/pWoodYardBill/mapping/"+ActionType.VERSION, this.toQueryString(_data),options)
            .map(res => res.json())
            .subscribe(data => {
                resolve(data);
            }, err => {
                reject(err);
            })
    })
}
//1-1.船舶预报列表
public async getShipAppList(params){
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    let options = new RequestOptions({headers: headers});
    //let _Params = new URLSearchParams();
    let  _data = Object.assign(params,
        {session:this.session.getSession()},
        {roleid:this.session.getRole()},
        {rolename:this.session.getRole()},
        {loginid:this.session.getLogin()});
    return await new Promise((resolve, reject) => {
        this.http.post(ActionType.URL+"/mobile/frontend/work/getShipAppList/"+ActionType.VERSION,this.toQueryString(_data),options)
            .map(res => res.json())
            .subscribe(data => {
                resolve(data);
            }, err => {
                reject(err);
            })
    })
}
//1-2. 新增船舶 addShipApp
public async addShipApp(params){
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    let options = new RequestOptions({headers: headers});
    //let _Params = new URLSearchParams();
    let  _data = Object.assign(params,
        {session:this.session.getSession()},
        {roleid:this.session.getRole()},
        {rolename:this.session.getRole()},
        {loginid:this.session.getLogin()});
    return await new Promise((resolve, reject) => {
        this.http.post(ActionType.URL+"/mobile/frontend/work/addShipApp/"+ActionType.VERSION,this.toQueryString(_data),options)
            .map(res => res.json())
            .subscribe(data => {
                resolve(data);
            }, err => {
                reject(err);
            })
    })
}

//1-3.新增预报返回页面生成主键 createPrediction
public async createPrediction(params){
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    let options = new RequestOptions({headers: headers});
    //let _Params = new URLSearchParams();
    let  _data = Object.assign(params,
        {session:this.session.getSession()},
        {roleid:this.session.getRole()},
        {rolename:this.session.getRole()},
        {loginid:this.session.getLogin()});
    return await new Promise((resolve, reject) => {
        this.http.post(ActionType.URL+"/mobile/frontend/work/createPrediction/"+ActionType.VERSION,this.toQueryString(_data),options)
            .map(res => res.json())
            .subscribe(data => {
                resolve(data);
            }, err => {
                reject(err);
            })
    })
}
//1-4.绑定船舶和预报的关系 confirmNum
public async confirmNum(params){
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    let options = new RequestOptions({headers: headers});
    //let _Params = new URLSearchParams();
    let  _data = Object.assign(params,
        {session:this.session.getSession()},
        {roleid:this.session.getRole()},
        {rolename:this.session.getRole()},
        {loginid:this.session.getLogin()});
    return await new Promise((resolve, reject) => {
        this.http.post(ActionType.URL+"/mobile/frontend/work/confirmNum/"+ActionType.VERSION,this.toQueryString(_data),options)
            .map(res => res.json())
            .subscribe(data => {
                resolve(data);
            }, err => {
                reject(err);
            })
    })
}
//1-5.船舶预报新增货主 addGoodsHost
public async addGoodsHost(params){
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    let options = new RequestOptions({headers: headers});
    //let _Params = new URLSearchParams();
    let  _data = Object.assign(params,
        {session:this.session.getSession()},
        {roleid:this.session.getRole()},
        {rolename:this.session.getRole()},
        {loginid:this.session.getLogin()});
    return await new Promise((resolve, reject) => {
        this.http.post(ActionType.URL+"/mobile/frontend/work/addGoodsHost/"+ActionType.VERSION,this.toQueryString(_data),options)
            .map(res => res.json())
            .subscribe(data => {
                resolve(data);
            }, err => {
                reject(err);
            })
    })
}
//1-6.新增我的收货地址 addReceiveAddress
public async addReceiveAddress(params){
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    let options = new RequestOptions({headers: headers});
    //let _Params = new URLSearchParams();
    let  _data = Object.assign(params,
        {session:this.session.getSession()},
        {roleid:this.session.getRole()},
        {rolename:this.session.getRole()},
        {loginid:this.session.getLogin()});
    return await new Promise((resolve, reject) => {
        this.http.post(ActionType.URL+"/mobile/frontend/work/addReceiveAddress/"+ActionType.VERSION,this.toQueryString(_data),options)
            .map(res => res.json())
            .subscribe(data => {
                resolve(data);
            }, err => {
                reject(err);
            })
    })
}
//1-7.我的收货地址列表 getReceiveAddressList
public async getReceiveAddressList(params){
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    let options = new RequestOptions({headers: headers});
    //let _Params = new URLSearchParams();
    let  _data = Object.assign(params,
        {session:this.session.getSession()},
        {roleid:this.session.getRole()},
        {rolename:this.session.getRole()},
        {loginid:this.session.getLogin()});
    return await new Promise((resolve, reject) => {
        this.http.post(ActionType.URL+"/mobile/frontend/work/getReceiveAddressList/"+ActionType.VERSION,this.toQueryString(_data),options)
            .map(res => res.json())
            .subscribe(data => {
                resolve(data);
            }, err => {
                reject(err);
            })
    })
}
//1-8.我的货主列表 getMyGoodsHostList
public async getMyGoodsHostList(params){
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    let options = new RequestOptions({headers: headers});
    //let _Params = new URLSearchParams();
    let  _data = Object.assign(params,
        {session:this.session.getSession()},
        {roleid:this.session.getRole()},
        {rolename:this.session.getRole()},
        {loginid:this.session.getLogin()});
    return await new Promise((resolve, reject) => {
        this.http.post(ActionType.URL+"/mobile/frontend/work/getMyGoodsHostList/"+ActionType.VERSION,this.toQueryString(_data),options)
            .map(res => res.json())
            .subscribe(data => {
                resolve(data);
            }, err => {
                reject(err);
            })
    })
 }
 //1-9.船舶预报货类货名联动  cargoTypeCargoNames
 public async cargoTypeCargoNames(params){
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    let options = new RequestOptions({headers: headers});
    //let _Params = new URLSearchParams();
    let  _data = Object.assign(params,
        {session:this.session.getSession()},
        {roleid:this.session.getRole()},
        {rolename:this.session.getRole()},
        {loginid:this.session.getLogin()});
    return await new Promise((resolve, reject) => {
        this.http.post(ActionType.URL+"/mobile/frontend/work/cargoTypeCargoNames/"+ActionType.VERSION,this.toQueryString(_data),options)
            .map(res => res.json())
            .subscribe(data => {
                resolve(data);
            }, err => {
                reject(err);
            })
    })
 }
//2.1 编辑船舶预报 editShipPrediction
public async editShipPrediction(params){
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    let options = new RequestOptions({headers: headers});
    //let _Params = new URLSearchParams();
    let  _data = Object.assign(params,
        {session:this.session.getSession()},
        {roleid:this.session.getRole()},
        {rolename:this.session.getRole()},
        {loginid:this.session.getLogin()});
    return await new Promise((resolve, reject) => {
        this.http.post(ActionType.URL+"/mobile/frontend/work/editShipPrediction/"+ActionType.VERSION,this.toQueryString(_data),options)
            .map(res => res.json())
            .subscribe(data => {
                resolve(data);
            }, err => {
                reject(err);
            })
    })
 }
 // 2.2我的船舶预报列表 getShipRecordList
 public async getShipRecordList(params){
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    let options = new RequestOptions({headers: headers});
    //let _Params = new URLSearchParams();
    let  _data = Object.assign(params,
        {session:this.session.getSession()},
        {roleid:this.session.getRole()},
        {rolename:this.session.getRole()},
        {loginid:this.session.getLogin()});
    return await new Promise((resolve, reject) => {
        this.http.post(ActionType.URL+"/mobile/frontend/work/getShipRecordList/"+ActionType.VERSION,this.toQueryString(_data),options)
            .map(res => res.json())
            .subscribe(data => {
                resolve(data);
            }, err => {
                reject(err);
            })
    })
 }
 // 2.3 发布预报 publish
 public async publish(params){
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    let options = new RequestOptions({headers: headers});
    //let _Params = new URLSearchParams();
    let  _data = Object.assign(params,
        {session:this.session.getSession()},
        {roleid:this.session.getRole()},
        {rolename:this.session.getRole()},
        {loginid:this.session.getLogin()});
    return await new Promise((resolve, reject) => {
        this.http.post(ActionType.URL+"/mobile/frontend/work/publish/"+ActionType.VERSION,this.toQueryString(_data),options)
            .map(res => res.json())
            .subscribe(data => {
                resolve(data);
            }, err => {
                reject(err);
            })
    })
 }
 //2.4 提交确认 submitConfirmation
 public async submitConfirmation(params){
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    let options = new RequestOptions({headers: headers});
    //let _Params = new URLSearchParams();
    let  _data = Object.assign(params,
        {session:this.session.getSession()},
        {roleid:this.session.getRole()},
        {rolename:this.session.getRole()},
        {loginid:this.session.getLogin()});
    return await new Promise((resolve, reject) => {
        this.http.post(ActionType.URL+"/mobile/frontend/work/submitConfirmation/"+ActionType.VERSION,this.toQueryString(_data),options)
            .map(res => res.json())
            .subscribe(data => {
                resolve(data);
            }, err => {
                reject(err);
            })
    })
 }
 //2.5 作废 finish1
 public async finish1(params){
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    let options = new RequestOptions({headers: headers});
    //let _Params = new URLSearchParams();
    let  _data = Object.assign(params,
        {session:this.session.getSession()},
        {roleid:this.session.getRole()},
        {rolename:this.session.getRole()},
        {loginid:this.session.getLogin()});
    return await new Promise((resolve, reject) => {
        this.http.post(ActionType.URL+"/mobile/frontend/work/finish1/"+ActionType.VERSION,this.toQueryString(_data),options)
            .map(res => res.json())
            .subscribe(data => {
                resolve(data);
            }, err => {
                reject(err);
            })
    })
 }
 //2.6  complete
 public async complete(params){
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    let options = new RequestOptions({headers: headers});
    //let _Params = new URLSearchParams();
    let  _data = Object.assign(params,
        {session:this.session.getSession()},
        {roleid:this.session.getRole()},
        {rolename:this.session.getRole()},
        {loginid:this.session.getLogin()});
    return await new Promise((resolve, reject) => {
        this.http.post(ActionType.URL+"/mobile/frontend/work/complete/"+ActionType.VERSION,this.toQueryString(_data),options)
            .map(res => res.json())
            .subscribe(data => {
                resolve(data);
            }, err => {
                reject(err);
            })
    })
 }
 //2.7 删除预报 deleteBargeInfo
 public async deleteBargeInfo(params){
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    let options = new RequestOptions({headers: headers});
    //let _Params = new URLSearchParams();
    let  _data = Object.assign(params,
        {session:this.session.getSession()},
        {roleid:this.session.getRole()},
        {rolename:this.session.getRole()},
        {loginid:this.session.getLogin()});
    return await new Promise((resolve, reject) => {
        this.http.post(ActionType.URL+"/mobile/frontend/work/deleteBargeInfo/"+ActionType.VERSION,this.toQueryString(_data),options)
            .map(res => res.json())
            .subscribe(data => {
                resolve(data);
            }, err => {
                reject(err);
            })
    })
 }
 //2.8 编辑预计到港时间 editRepTi
 public async editRepTi(params){
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    let options = new RequestOptions({headers: headers});
    //let _Params = new URLSearchParams();
    let  _data = Object.assign(params,
        {session:this.session.getSession()},
        {roleid:this.session.getRole()},
        {rolename:this.session.getRole()},
        {loginid:this.session.getLogin()});
    return await new Promise((resolve, reject) => {
        this.http.post(ActionType.URL+"/mobile/frontend/work/editRepTi/"+ActionType.VERSION,this.toQueryString(_data),options)
            .map(res => res.json())
            .subscribe(data => {
                resolve(data);
            }, err => {
                reject(err);
            })
    })
 }
 //2.9  排队查询 bargeQueue
 public async bargeQueue(params){
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    let options = new RequestOptions({headers: headers});
    //let _Params = new URLSearchParams();
    let  _data = Object.assign(params,
        {session:this.session.getSession()},
        {roleid:this.session.getRole()},
        {rolename:this.session.getRole()},
        {loginid:this.session.getLogin()});
    return await new Promise((resolve, reject) => {
        this.http.post(ActionType.URL+"/mobile/frontend/work/bargeQueue/"+ActionType.VERSION,this.toQueryString(_data),options)
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