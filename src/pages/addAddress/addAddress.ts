import { Component } from '@angular/core';
import { NavController ,NavParams ,ToastController} from 'ionic-angular';
import { CityDataProvider } from "../../providers/city-data/city-data";
import { ServiceProvider } from "../../service/http";//
import { returnReslut } from '../../entity/returnReslut';
import { validate } from '../../service/validate';
import { ERROR } from '../../entity/error';
import { registerBack } from "../../service/registerBack";
import { Exception } from '../../service/exception';
import { lSe } from '../../public/localstorage';
@Component({
  selector: 'page-addAddress',
  templateUrl: 'addAddress.html'
})
export class AddAddressPage extends registerBack{
    validate = validate;
    PAGE:string="jobdescriptionOut.ts";//当前页面
    addressType:string = "新增";// 编辑 / 新增
    item:any;//前一个页面对象
    public session: any;
    public params: any;
    public cityColumns: any[];
    public citydefault: any;
    // obj:any={
    //   id:"",//主健
    //   name:"丁伟",//收货人姓名
    //   phone:"13585313515",//收货人电话
    //   address:"北京市 市辖区 朝阳区",//收货人地址
    //   address_id:"110000 110100 110105",//收货地址id
    //   detail_address:"江苏港口大夏集团什么路",//详细地址
    //   is_default:"",//是否默认地址标记
    //   goodshost_id:""//货主id
    // }
    obj:any={
      id:"",//主健
      name:"",//收货人姓名
      phone:"",//收货人电话
      address:"",//收货人地址
      address_id:"",//收货地址id
      detail_address:"",//详细地址
      is_default:"",//是否默认地址标记
      goodshost_id:""//货主id
    }
    addressId:string="";// 主键id
    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public cityDataProvider: CityDataProvider,
                public service: ServiceProvider,
                public toastC: ToastController,
                public exception:Exception){
          super("/addAddress");
          try{
            this.obj.goodshost_id =  this.navParams.get("item").id;
            this.item =  this.navParams.get("item");
            this.addressType = this.item.htmltype;
            this.cityColumns = this.cityDataProvider.cities;
            if(this.item.htmltype=="编辑地址"){
                this.addressId = this.item.data.goodshost_id;
                this.obj = this.item.data;
                this.obj.is_default = this.obj.is_default==0?false:true;
            }else{
                this.obj.is_default = false;
            }  
          }catch(e){
            //返回 App json处理时发生出错时 处理逻辑；
            this.presentToast("app处理数据错误，已提交后台！");
            let obj:ERROR;
            obj ={err_reason:e.toString(),err_page:this.PAGE,err_data:JSON.stringify({"constructor":"jobdescriptionOut.ts--constructor数据初始化出错！"}),loginid:lSe.getItem("userData").record.loginid};//错误
            this.exception.errorhttp(obj);           
          }
          
    }
    submit(){
      let _valdate:returnReslut = 
          validate.forVlidate(
          [
            {name:"收货人姓名",node:this.obj.name,type:"String",condition:true},
            {name:"详细地址",node:this.obj.detail_address,type:"String",condition:true},
            {name:"收货地址",node:this.obj.address_id,type:"String",condition:true},
            {name:"收货人电话",node:this.obj.phone,type:"Telephone",condition:true}
          ])
      if(_valdate.flag){
          this.obj.address = document.getElementsByClassName("multi-picker-text")[0]["innerText"];
          this.obj.is_default = this.obj.is_default!=""||this.obj.is_default ? 1:0;
          this.service.addReceiveAddress({submitresult:JSON.stringify(this.obj)}).then(data=>{
              if(data["ok"]&&data["msg"]=="保存成功！"){
                this.obj.id = this.addressId = data["data"].pReceiverApp.id;
                this.goback();
              }
              this.presentToast(data["msg"]);
          }).catch(data=>{

          })
        }else{
          this.presentToast(_valdate.Msg+"，输入有误！");
        }
    }
    goback(){
      this.item.callback.onInput();
      this.navCtrl.pop();
    }
    presentToast(message) {
      let toast = this.toastC.create({
        message: message,
        duration: 1000,
        position: 'bottom',
        cssClass: "margin25"
      });
      toast.onDidDismiss(() => {
        
      });
      toast.present();
    }
}
