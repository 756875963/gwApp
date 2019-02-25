import { Component } from '@angular/core';
import { NavController ,NavParams ,ToastController ,LoadingController} from 'ionic-angular';
import {ListPage} from '../list/list';
import { pageBean } from '../../entity/pageBean';
import { ServiceProvider } from '../../service/http';

@Component({
  selector: 'page-dataRollbackList',
  templateUrl: 'dataRollbackList.html'
})
export class DataRollbackListPage {
  page :pageBean={
    page: 1,//当前页
    pageSize : 10,//每页最大条数
    total : 1,//总页数
    records : 1,//总记录数
  };
  item:Object;
  rollbacklicensePlateActive1_1:string;
  rollbacklicensePlateActive1_2:string;
  rollbacklicensePlate1_2:Array<any>;
  rollbacklicensePlate1_3:Array<any>;
  rollbacklicensePlate1: Array<any>;
  rollbacklicensePlateActive1: string;
  rolldata:Array<any>=[];//回退数据集合；
  scrollevents:any;
  htmlListLenghtFlag:boolean=this.rolldata.length>0?false:true;//回滚集合为空时标记
  constructor(public navCtrl: NavController,
              public navParams :NavParams,
              public service:ServiceProvider,
              public toastController:ToastController,
              public loadingController: LoadingController,) {
    this.item = this.navParams.get("item");
    if(this.item["html"]=="woodMention"){
       this.rollbacklicensePlate1 = this.item["oddnumbers"];
    }else if(this.item["html"]=="RefutationPage"){
     
       this.rollbacklicensePlate1_2 = this.item["data"].rollbacklicensePlate1_2;
       this.rollbacklicensePlate1_3 = this.item["data"].rollbacklicensePlate1_2[0].contractlist;
    }else{

    }
   
    
  }
  rollbackfunction(){
    if(this.scrollevents!=undefined){
      this.scrollevents["enable"](true);
      this.rolldata = [];
    }
    this.page.page = 1;
    let loading = this.presentLoadingDefault();
    this.http1({
      ticket_id:this.item["m_id"],
      yard_no:this.rollbacklicensePlateActive1,
      pageBean:JSON.stringify(this.page)
     }).then(data=>{
         loading();
         if(data["ok"]){
            let _data = data["data"].pager.rows;//集合赋值；
            this.rolldata = _data;
         }else{
            this.presentToast("数据错误，无法解析！");
         }
        
        if(this.rolldata.length>0){
          this.htmlListLenghtFlag = false;
        }else{
          this.htmlListLenghtFlag = true;
        }
    }).catch(data=>{
    })
  }
  rollbackfunction1_1(){
    for(let item of this.rollbacklicensePlate1_2){
       if(this.rollbacklicensePlateActive1_1 == item.barge_order_id){
           this.rollbacklicensePlate1_3 = item.contractlist;
       }
    }
  }
  rollbackfunction1_2(){
    if(this.scrollevents!=undefined){
      this.scrollevents["enable"](true);
      this.rolldata = [];
    }
    this.page.page = 1;
    let loading = this.presentLoadingDefault();
      this.http2({ticket_id:this.item["m_id"],
      ship_id:this.rollbacklicensePlateActive1_1,
      contract_no:this.rollbacklicensePlateActive1_2,
      pageBean: JSON.stringify(this.page)}).then(data=>{
        loading();
        if(data["ok"]){
          let _data = data["data"].pager.rows;//集合赋值；
          this.rolldata = _data;
       }else{
          this.presentToast("数据错误，无法解析！");
       }
        
        if(this.rolldata.length>0){
          this.htmlListLenghtFlag = false;
        }else{
          this.htmlListLenghtFlag = true;
        }
    }).catch(data=>{
    })
  }
  doInfinite(event){
    let loading = this.presentLoadingDefault();
    if(this.scrollevents==undefined){
      this.scrollevents = event;
    }
    this.page.page++;
    if(this.item["html"]=="woodMention"){
      this.http1({
        ticket_id:this.item["m_id"],
        yard_no:this.rollbacklicensePlateActive1,
        pageBean:JSON.stringify(this.page)
      }).then(data=>{
        if(data["ok"]){
          loading();
          let _data:pageBean = data["data"].pager;
           this.rolldata = this.rolldata.concat(_data.rows);
           if(_data.total>_data.page){
              event.complete();
           }else{
            // this.presentToast("没有更多数据！");
              event.enable(false); 
           }   
           if(this.rolldata.length>0){
             this.htmlListLenghtFlag = false;
           }else{
             this.htmlListLenghtFlag = true;
           }
       }else{
         this.presentToast("数据有误！");
       }
      }).catch(data=>{
   
      })
    }else if(this.item["html"]=="RefutationPage"){
      this.http2({ticket_id:this.item["m_id"],
      ship_id:this.rollbacklicensePlateActive1_1,
      contract_no:this.rollbacklicensePlateActive1_2,
      pageBean: JSON.stringify(this.page)}).then(data=>{
        if(data["ok"]){
          loading();
           let _data:pageBean = data["data"].pager;
            this.rolldata = this.rolldata.concat(_data.rows);
            if(_data.total>_data.page){
               event.complete();
            }else{
              //this.presentToast("没有更多数据！");
               event.enable(false); 
            }   
        }else{
          this.presentToast("没数据有误！");
        }
      }).catch(data=>{});
    }else{

    }
    
 }
 presentToast(message) {
  let toast = this.toastController.create({
    message: message,
    duration: 2000,
    position: 'middle',
    cssClass:"margin25"
  });
  toast.onDidDismiss(() => {
    
  });
  toast.present();
}
presentLoadingDefault(msg="数据加载中，请稍等！") { //统一加载处理css 效果组件；

  let loading = this.loadingController.create({
    content:msg
  });
 loading.present();
return ()=>{loading.dismiss()};
 
}
rollblackclick(item){
  this.item["callback"].myCallbackFunction({item:item}).then(data=>{
     this.navCtrl.pop();
  }).catch(data=>{

  })
}
  async http1(obj){//件杂货回退list
    return  await new Promise((resolve, reject) => {
       this.service.revertLuoBoDriverList(obj).then(
         (obj:pageBean) =>{
           resolve(obj);
         }
       ).catch(
         obj=>{
         }
       );
     })
  }
  async http2(obj){ //驳船数据回退
    return  await new Promise((resolve, reject) => {
      this.service.revertQiBoList(obj).then(
        (obj:pageBean) =>{
          resolve(obj);
        }
      ).catch(
        obj=>{
          console.log(obj);
        }
      );
    })
  }
}
