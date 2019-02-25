import { Component } from '@angular/core';
import { NavController ,NavParams ,ToastController ,ModalController} from 'ionic-angular';
import { validate } from '../../service/validate';
import { ServiceProvider } from '../../service/http';
import { returnReslut } from '../../entity/returnReslut';
import { ShipperSearchPage } from '../shipperSearch/shipperSearch';
@Component({
  selector: 'page-addShipper',
  templateUrl: 'addShipper.html'
})
export class AddShipperPage{
  validate = validate;
  title:string="";//title
  prediction:any={
    name:"",//公司名称
    phone:"",//联系电话
    person:"",//姓名
    host_id:""//id
  }
  shipperId="";//货主id
  callback:any;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public toastC: ToastController,
              public service: ServiceProvider,
              public modalC: ModalController) {
             this.callback =  this.navParams.get("item");
             this.title =  this.callback.htemltype;
             if(this.title =="编辑货主"){
               this.shipperId = this.callback.data.id;
               this.prediction.name = this.callback.data.name;
               this.prediction.phone = this.callback.data.phone;
               this.prediction.host_id = this.callback.data.id;
               this.prediction.person = this.callback.data.com_legal_person;
             }

  }
  openPage(){
 
  }
  presentToast(message) {
    let toast = this.toastC.create({
      message: message,
      duration: 1000,
      position: 'middle',
      cssClass: "margin25"
    });
    toast.onDidDismiss(() => {
    });
    toast.present();
  }
  submit(){
    //验证提交数据是否符合提交要求
    let _valdate:returnReslut = 
    validate.forVlidate(
     [
      {name:"姓名",node:this.prediction.person,type:"String",condition:true},
      {name:"公司名称",node:this.prediction.name,type:"String",condition:true},
      {name:"联系电话",node:this.prediction.phone,type:"Telephone",condition:true}]
  );
    if(_valdate.flag){
      this.service.addGoodsHost({submitresult:JSON.stringify(this.prediction)}).then(data=>{
        if(data["ok"]&&data["msg"]=="保存成功！"){
           this.shipperId = data["data"].pCompanyManager.id;
           this.presentToast("货主新增成功！");
        }else{
           this.presentToast("货主新增失败！");
        }
        
    }).catch(data=>{
      this.presentToast("系统出错了！");
    })
    }else{
      this.presentToast(_valdate.Msg+"，输入有误！");
    }
  }
   hrefShipper(){// 跳转收货地址
     let modal = this.modalC.create(ShipperSearchPage,{item:{htmltype:"地址管理",callback:this,id:this.shipperId,flag:1}});
     modal.present();
   }  
   goback(){
     this.navCtrl.pop();
   }
}
