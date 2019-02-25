import { Component } from '@angular/core';
import { NavController ,ModalController ,ToastController ,NavParams} from 'ionic-angular';
import { PersonSearchPage } from '../../pages/personSearch/personSearch';
import { ServiceProvider} from '../../service/http'; 
import { MyaShipPage } from '../../pages/myaShip/myaShip';//我的船舶
import { validate } from '../../service/validate';
import { returnReslut } from '../../entity/returnReslut';
@Component({
  selector: 'page-addmyAShip',
  templateUrl: 'addmyAShip.html'
})
export class AddmyAShipPage {
  validate = validate;
  //新增预报对象
  prediction:any={
    ship_id:"",//船id
    ship_name:"",//船名
    call_no:"",//呼号
    contacts_person:"",//联系人
    phone:"",//联系电话
    order_no:"",//排序号
    ship_length:"",//船长
  }
  callback:any;
  constructor(public navCtrl: NavController,
              public modalC :ModalController,
              public service: ServiceProvider,
              public toastC: ToastController,
              public navParams: NavParams) {
                this.callback = this.navParams.get("callback");

  }
  
  shipperhref(){//货主跳转
    this.navCtrl.push(PersonSearchPage,{ item:{type:"货主",callback:this}});
  }
  goback(){
    this.navCtrl.pop();
  }
  myAShip(){//跳转我的船舶
     let modal = this.modalC.create(MyaShipPage,{item: "1",callback:this});
     modal.present();
  }
  presentToast(message) {
    let toast = this.toastC.create({
      message: message,
      duration: 1000,
      position: 'bottom',
      cssClass: "margin25"
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    toast.present();
  }
  submit(){//提交添加船信息
    //验证提交数据是否符合提交要求
    let _valdate:returnReslut = 
    validate.forVlidate(
     [
      {name:"排序号",node:this.prediction.order_no,type:"Number",min:0,toFixed:true},
      {name:"船名",node:this.prediction.ship_name,type:"String",condition:true},
      {name:"呼号",node:this.prediction.call_no,type:"String",condition:true},
      {name:"联系人",node:this.prediction.contacts_person,type:"String",condition:true},
      {name:"联系电话",node:this.prediction.phone,type:"Telephone",condition:true},
      {name:"船长",node:this.prediction.ship_length,type:"Number",min:0,toFixed:true},
     ]
 );
 console.log(_valdate);
    
      if(_valdate.flag){
        
        this.service.addShipApp({submitresult:JSON.stringify(this.prediction)}).then(data=>{
          console.log(data);
          if(data["ok"]&&data["msg"]=="保存成功！"){
            this.callback.http({page:1,pageSize:10,total:0,records:0},
              {barge_id:this.callback.predictionId,ship_name:"",order:"order"}).then(
              (data)=>{
                this.navCtrl.pop();
                if(data["data"].pager.rows.length>0){
                  this.callback.datalist = data["data"].pager.rows;
                  delete data["data"].pager.rows;
                  data["data"].pager.pageSize  = 10;
                  this.callback.page = data["data"].pager;
                  this.callback.pageEvent.enable(true); 
                }else{
                  this.callback.pageEvent.complete();
                   this.callback.presentToast("没有更多数据！");
                  this.callback.pageEvent.enable(false);  
                }
              
            
          
       }).catch(data=>{

       })
      }
    }).catch(data=>{

    })
  }else{
    this.presentToast(_valdate.Msg+"，输入有误！");
 }
  
}
}