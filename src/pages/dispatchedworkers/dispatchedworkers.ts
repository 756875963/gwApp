import { Component ,ViewChild } from '@angular/core';
import { NavController ,Navbar ,NavParams ,ToastController } from 'ionic-angular';
import { ListPage } from '../list/list';
import { LoginPage } from '../login/login';
import { StaffListPage } from '../staffList/staffList';
import { lSe } from '../../public/localstorage';
import { ServiceProvider } from '../../service/http';
import { registerBack } from "../../service/registerBack";

@Component({
  selector: 'page-dispatchedworkers',
  templateUrl: 'dispatchedworkers.html'
})
export class DispatchedworkersPage extends registerBack{
  @ViewChild(Navbar) navBar: Navbar;
  submitFlag :Boolean = false; 
  callback;
  work_no:String;//作业编号
  book_id:String;//作业书编号
  ticket_id:String;//作业id
  dataObj:any ={
     list:[],
     total:4,
     daState:true
  }
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl:ToastController,
    public service:ServiceProvider){
      super("/dispatchedworkers");
     this.callback = this.navParams.get("callback");
     this.work_no = this.navParams.get("item").work_no;//任务列表跳转过来带的参数
     let id = this.navParams.get("item").id;
     this.book_id = this.navParams.get("item").book_id;
     this.ticket_id = id
     this.http({id:id}).then(
       (obj)=>{
         let _array = [];
         for(var i=0;i<obj["data"].data.length;i++){
           _array.push({
             user_id:obj["data"].data[i].user_id,
             id:obj["data"].data[i].id,
             name:obj["data"].data[i].name,
             doFlag:false
           });
          obj["data"].data[i].doFlag = false;
         }
         this.dataObj.list = _array;
         console.log(obj);
       }
     ).catch(
       (obj)=>{

       }
     );
  }
  openPage(){
    this.navCtrl.push(ListPage, { item12: "0" });
  }
  hrefpush(event){
    //console.log("跳转");
    let _data = this.dataObj.list;
    for(var i=0;i<_data.length;i++){
    let _data = this.dataObj.list;
     delete _data[i]["doFlag"]
   }
   //console.log(_data);
   this.navCtrl.push(StaffListPage,{callback:this.myCallbackFunction,data:_data});
  }
  delete(event,data){
    var _that1 = this;
    var _i ;
    let _dataList = this.dataObj.list;
    if(this.dataObj.daState){
      this.dataObj.daState = false;
      for(var i =0;i<_dataList.length;i++){
        if(data==_dataList[i].id){
           this.dataObj.list[i]["doFlag"]=true;
           _i =i
           setTimeout((i)=>{
             //延时模拟请求
           _that1.dataObj.list[_i]["doFlag"]=false;
           _that1.dataObj.daState = true;
           _that1.dataObj.list.splice(_i,1);
           //lSe.popAll();
           //_that1.navCtrl.popToRoot(); 
           },100)
        }
      }
    }
  }
  // 用于pop 回调的 block
  myCallbackFunction  =(params) => {
    console.log(this);
    //console.log(lSe.getItem("userlist"));
    var _arraylist = lSe.getItem("userlist");
    //console.log(1,_arraylist);
    var _that = this;
    var add = function(){
      //console.log(lSe.getItem("userlist"));
      for(var i=0;i<_arraylist.length;i++){
        _arraylist[i].doFlag = false;
      }
      _that.dataObj = {
        list:_arraylist,
        total:_arraylist.length,
        daState:true};
    }
    return new Promise((resolve, reject) => {
     if(params){
         resolve('ok');
         add();
     }else{
         reject(Error('error'))
     }    
    });
  }
  
  submit(){
    var _that = this;
    if(this.dataObj.list.length>0){
      if(!this.submitFlag){
        this.submitFlag =true;
        this.service.submitDispatchedworkers({ticket_id:this.ticket_id,loginid:lSe.getItem("userData").record.loginid,book_id:this.book_id,r:JSON.stringify({data:this.dataObj.list})}).then(
          (obj:any) =>{
               let _obj ={}; 
               if(obj.ok==true){
                _obj = {Refresh:true};
                let toast = this.toastCtrl.create({
                  message: "派工成功",
                  duration: 1000,
                  position: 'middle',
                  cssClass:"margin25"
                });
                toast.onDidDismiss(() => {
                  _that.navCtrl.pop();
                });
                toast.present();
               }else{
                _obj = {Refresh:false};
                let toast = this.toastCtrl.create({
                  message: "插入数据有误",
                  duration: 2000,
                  position: 'middle',
                  cssClass:"margin25"
                });
                toast.onDidDismiss(() => {
                  //console.log('Dismissed toast');
                });
                toast.present();
               }  
               _that.callback(_obj).then((e :UIEvent)=>{
                _that.submitFlag =false;
              }).catch((e:UIEvent)=>{
                //console.log(e);
            });
          }
        ).catch(
          obj=>{
            //console.log(obj);
          }
        );
        
        // setTimeout(() => {
        //   _that.callback(param).then((e :UIEvent)=>{
        //    console.log("111");
        //    _that.submitFlag =false;
        //    _that.navCtrl.popToRoot();
        //   }).catch((e:UIEvent)=>{
        //     console.log(e);
        //   });
        // },500);
       }
    }else{
      let toast = this.toastCtrl.create({
        message: "未选中人员，无法保存！",
        duration: 2000,
        position: 'middle',
        cssClass:"margin25"
      });
      toast.onDidDismiss(() => {
        //console.log('Dismissed toast');
      });
      toast.present();
    }
  }

  //下面是拨离出来的http的请求；低耦合 为了实现连续的逻辑调用 不直接放在业务逻辑中；
  async http(obj :any){//任务列表请求
    return  await new Promise((resolve, reject) => {
       this.service.addPersonnelByJobnumber(obj).then(
         (obj:any) =>{
             resolve(obj);
         }
       ).catch(
         obj=>{
           //console.log(obj);
         }
       );
     })
  }
  ionViewDidEnter(){
    super.BackButtonCustomHandler();
  }
  ionViewWillLeave() {
    // Unregister the custom back button action for this page
    super.ionViewWillLeave && super.ionViewWillLeave();
  }
}
