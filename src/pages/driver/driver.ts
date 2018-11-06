import { Component } from '@angular/core';
import { NavController ,Events ,NavParams ,LoadingController ,ToastController} from 'ionic-angular';
import { ListPage } from '../list/list';
import { LoginPage } from '../login/login';
import { TicketNumberQueryPage} from '../../pages/ticketNumberQuery/ticketNumberQuery';
import { ServiceProvider } from '../../service/http';
import { pageBean } from '../../entity/pageBean';
import { Exception } from '../../service/exception';
import { ERROR } from '../../entity/error';
import { lSe } from '../../public/localstorage';
@Component({
  selector: 'page-driver',
  templateUrl: 'driver.html'
})

export class DriverPage {
  PAGE:string="driver.ts";//当前页面
  _machine_id :String;
  _ext_id :String;
  work_no :String;
  item :Object =null;//前一个页面数据
  InputflagButton: Boolean = false;// 浮动按钮显示标记
  damagedFlag: Boolean = true;// 残损录入模态框显示标记
  shipName: string;
  goodsName: string;
  number : String = "";
  fixed : Boolean = true;
  toppings:String;
  savetopping:String;
  licensePlate: Array<any> =[];
  securityBook :String = "";
  loadingText :string ="处理中";
  constructor(public navCtrl: NavController,
              public events: Events,
              public service: ServiceProvider,
              public navParams: NavParams,
              public loadingController: LoadingController,
              public toastController: ToastController,
              public exception :Exception){
                this.item = this.navParams.get("item");
                console.log(this.item);
                this.securityBook = this.navParams.get("item").text;
                this.fixed = this.securityBook==""? false: true;
                try{//结构json数据 异常处理  
                if(this.securityBook==""){
                    this.http().then(data=>{
                      this.shipName = data["data"].ship_n_text;
                      this.goodsName = data["data"].cargo_n_text;
                      this.licensePlate = data["data"].tractor_list;
                      this.toppings = data["data"].tractor_list[0].mac_id;
                      this.savetopping = data["data"].tractor_list[0].mac_id;  
                      this.work_no = data["data"].work_no;
                      console.log( this.toppings);
                    })
                }   
              }catch(e){
                //返回 App json处理时发生出错时 处理逻辑；
                this.presentToast("app处理数据错误，已提交后台！");
                let obj:ERROR;
                obj ={err_reason:e.toString(),err_page:this.PAGE,err_data:JSON.stringify({"constructor":"jobdescription.ts--constructor数据初始化出错！"}),loginid:lSe.getItem("userData").record.loginid};//错误
                this.exception.errorhttp(obj);
                }           
  }
  openPage(){
    console.log("11");
    //this.navCtrl.push(ListPage, { item12: "丁伟" });
    this.events.subscribe('bevents', (params) => {
      // 接收B页面发布的数据
      console.log('接收数据为: '+ params);
      
      // 取消订阅
      this.events.unsubscribe('bevents'); 
     })
    // this.navCtrl.push(ListPage);
    
  }

  sure(){//阅读确认事件
    console.log(this.fixed);
    
    this.service.safetyjop({loginid:this.item["loginid"],m_id:this.item["m_id"],update_read:1}).then(
      (obj:pageBean) =>{
        try{//结构json数据 异常处理
          // console.log("listjs",obj["data"].data.page);
          //this.page2={page:obj["data"].data.page,rows:10}
          console.log(obj);
          if(obj["data"].is_read=="1"){
              this.http().then((data)=>{
                  this.shipName = data["data"].ship_n_text;
                  this.goodsName = data["data"].cargo_n_text;
                  this.licensePlate = data["data"].tractor_list;
                  this.toppings = data["data"].tractor_list[0].mac_id;
                  this.work_no = data["data"].work_no;
              },(data)=>{

              });
          }
        }catch(e){
          //返回 App json处理时发生出错时 处理逻辑；
          this.presentToast("app处理数据错误，已提交后台！");
          let obj:ERROR;
          obj ={err_reason:e.toString(),err_page:this.PAGE,err_data:JSON.stringify(obj),loginid:lSe.getItem("userData").record.loginid};//错误
          this.exception.errorhttp(obj);
        }    
      }
    ).catch(
      obj=>{
        console.log(obj);
      }
    );
    // this.navCtrl.pop().then(() => {
    //   this.events.publish('custom-user-events', '我是来自push2页面的值');
    // });
    //this.navCtrl.push(LoginPage,{item:0});
    //this.navCtrl.popToRoot();
    this.fixed = !this.fixed;
  }
  damaged_state(flag:boolean){//残损录入打开/关闭事件
    this.damagedFlag = flag;
  }
  goto_ticketNumberQuery(){
    this.navCtrl.push(TicketNumberQueryPage,{item:1});
  }
  Inputflag(flag:boolean){
       this.InputflagButton = flag;
  }
  submit(){
    let loginid  = this.item["loginid"];
    let book_id  = this.item["m_id"];
    let cargo_num  = this.number;
    let machine_id = this.toppings;
    let ext_id = this._ext_id;
    if(cargo_num!=""){
      let dsloading = this.presentLoadingDefault("发车中...");
      this.http2({loginid:loginid,book_id:book_id,cargo_num,machine_id,ext_id:ext_id}).then((obj)=>{
          try{//结构json数据 异常处理
              if(true){
                dsloading.dismiss();
                this.number="";
                this.toppings =this.savetopping;
              }else{
                //错误信息提示
              }
          }catch(e){
            //返回 App json处理时发生出错时 处理逻辑；
            this.presentToast("app处理数据错误，已提交后台！");
            let obj:ERROR;
            obj ={err_reason:e.toString(),err_page:this.PAGE,err_data:JSON.stringify(obj),loginid:lSe.getItem("userData").record.loginid};//错误
            this.exception.errorhttp(obj);
          }    
      },(obj)=>{
        console.log(obj);
      })
    }else{
      this.presentToast("输入件数不能为空！");
    }
  }
  callBack(){
    let dsloading = this.presentLoadingDefault("数据回退中...");
    let loginid  = this.item["loginid"];
    let book_id  = this.item["m_id"];
    let cargo_num  = this.number;
    let machine_id = this.toppings;
    this.http3({loginid:loginid,book_id:book_id,cargo_num:cargo_num}).then((obj)=>{
      dsloading.dismiss();
      try{//结构json数据 异常处理
         //let dsloading1 = this.presentLoadingDefault("回退成功");
         let loginid  = this.item["loginid"];
         if(obj["msg"]!="没有数据！"){
            //setTimeout(()=>{dsloading1.dismiss()},1000);
            this.toppings = obj["data"]["bean"]["machine_id"];
            this.number = obj["data"]["bean"]["cargo_num"];
            this._ext_id = obj["data"]["bean"]["id"];
            this._machine_id = obj["data"]["bean"]["machine_id"];
          }else{
            //错误信息提示
            this.presentToast(obj["msg"]);
          }
      }catch(e){
          //返回 App json处理时发生出错时 处理逻辑；
          this.presentToast("app处理数据错误，已提交后台！");
          let obj:ERROR;
          obj ={err_reason:e.toString(),err_page:this.PAGE,err_data:JSON.stringify(obj),loginid:lSe.getItem("userData").record.loginid};//错误
          this.exception.errorhttp(obj);
    }   
    });
  }

  presentLoadingDefault(text){
    this. loadingText = text;
    let loading = this.loadingController.create({
      content: this.loadingText
    });
    loading.present();
    return loading;
  }

  presentToast(message) {
    let toast = this.toastController.create({
      message: message,
      duration: 2000,
      position: 'middle',
      cssClass:"margin25"
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    toast.present();
  }

  //下面是拨离出来的http的请求；低耦合 为了实现连续的逻辑调用 不直接放在业务逻辑中;
  async http(){//页面数据请求
    return  await new Promise((resolve, reject) => {
       this.service.externalRationale({loginid:this.item["loginid"],m_id:this.item["m_id"]}).then(
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
  //提交发车数据请求
  async http2(obj){
    return  await new Promise((resolve, reject) => {
       this.service.startExternalRationale(obj).then(
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
  //页面数据回滚
  async http3(obj){
    return  await new Promise((resolve, reject) => {
       this.service.rollblackExternalRationale(obj).then(
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
