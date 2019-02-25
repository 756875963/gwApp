import { Component } from '@angular/core';
import { NavController ,AlertController ,LoadingController ,NavParams ,ToastController ,Events ,Platform} from 'ionic-angular';
import { ListPage } from '../list/list';
import { TicketNumberPage } from '../ticketNumber/ticketNumber';
import { lSe } from '../../public/localstorage';
import { vehicleStoragePage } from '../vehicleStorage/vehicleStorage';
import { VehicleListPage } from '../vehicleList/vehicleList';
import { PaymentPage } from '../payment/payment';
import { ServiceProvider } from '../../service/http';
import { returnReslut } from '../../entity/returnReslut';
import { pageBean } from '../../entity/pageBean';
import { Exception } from '../../service/exception';
import { ERROR } from '../../entity/error';
import { registerBack } from "../../service/registerBack";
import { validate } from '../../service/validate';
import { DataRollbackListPage } from '../dataRollbackList/dataRollbackList';
@Component({
  selector: 'page-woodMention',
  templateUrl: 'woodMention.html'
})
export class WoodMentionPage extends registerBack{
  page :pageBean={
    page: 1,//当前页
    pageSize : 10,//每页最大条数
    total : 1,//总页数
    records : 1,//总记录数
  };
  validate = validate;
  istrue:boolean=false;
  userName:string;//title 操作员
  PAGE:string="woodMention.ts";//当前页面
  bookid:string;//任务书id
  item:String;
  damagedFlag:Boolean = true;
  navflag:Boolean=true;
  ticketNumber;
  outboundorderNum:String = "123455";
  shipName:String = "铁打号";
  goodsName:String = "木材";
  number:number = 0;
  number1:String;//卷号
  number2:String = "A01,A01,A01,B04,B05,B06,B07"
  fixed:Boolean = true;
  fixed1:boolean = true;
  toppings:String = "苏E 123458";//车辆选择；
  toppingsnumber:String;//当前出库单号的编号yard_no
  licensePlate:Array<any>;//车辆列表
  oddnumbers:Array<any>;//出库单列表
  securityBook:String;
  landscape: boolean;//屏幕方向；
  scrollevents:object;//下拉events
  finishnumber:Number;//完成数据
  Surplus:Number;//剩余数量
  licensePlate1:Array<any>;//装载机数组
  licensePlate1Active:String;//装载机选中状态
  rolldata:Array<any>=[];//回退数据集合；
  yardSiteMgmts:Array<any> =[];//库场集合
  yardsitelist:Array<any> =[];//货位集合
  yardsitelistname:string;//货位选择值
  yardSiteMgmtsname:string;//库场选中值
  licensePlatename:string;//车辆选中值
  revertNum:number=0;//回退提交数量比较；
  rollbacklicensePlate1:Array<any>;//出库单list回滚
  rollbacklicensePlateActive1:string;//出库单选中
  htmlListLenghtFlag:boolean=this.rolldata.length>0?false:true;//回滚集合为空时标记
  revert_flag:string = "";//
  id:string = "";//后台用的id = kRationaleId；
  goodsDetailExtendId:string = "";// 后台用的goodsDetailExtendId = goodsDetailExtendId;
  goodsDetailId:string = ""; //后台用的 goodsDetailId = goodsDetailId
  constructor(public navCtrl:NavController,
              public alertC:AlertController,
              public loadingController:LoadingController,
              public service:ServiceProvider,
              public navParams:NavParams,
              public toastController:ToastController,
              public events:Events,
              public exception:Exception,
              public platform: Platform,
      
             ){
               super("/woodMention");
              let _that = this;
               if(screen.availWidth<screen.availHeight){
                //竖屏 
                this.landscape = false;
           }else{
                //横屏
               this.landscape = true;//div50%css布局
           }
           window.addEventListener("orientationchange",function(){
              if(window.orientation == 0 || window.orientation == 180){
                  //竖屏
                  
                  _that.landscape = false;//div100%css布局
              }else if(window.orientation == 90 || window.orientation == -90){
                 //横屏"
                 _that.landscape = true;//div50%css布局
              }
           });
      try{//结构json数据 异常处理
          this.navflag = false;
          this.item = this.navParams.get("item");
          this.securityBook = this.navParams.get("item").text;
          this.fixed = this.securityBook==""? false: true;
          this.userName = lSe.getItem("userData").record.username;
          this.bookid = this.item["m_id"];//赋值bookid
          if(this.securityBook==""){
              this.acceptData();
          }
      }catch(e){
      //返回 App json处理时发生出错时 处理逻辑；
      this.presentToast("app处理数据错误，已提交后台！");
      let obj:ERROR;
      obj ={err_reason:e.toString(),err_page:this.PAGE,err_data:JSON.stringify({"constructor":"jobdescriptionOut.ts--constructor数据初始化出错！"}),loginid:lSe.getItem("userData").record.loginid};//错误
      this.exception.errorhttp(obj);
      }
  }
  reset(){
    this.yardsitelistname = "0";
    this.yardSiteMgmtsname = "0";
    this.licensePlatename = "0";
    this.toppingsnumber = "0";
    this.number = 0;
  }
  sure(){
    this.service.safetyjop({loginid:this.item["loginid"],m_id:this.item["m_id"],update_read:1}).then((obj:pageBean) =>{
      }
    ).catch(obj=>{ 

    }
    );
    this.fixed = !this.fixed;
  }
  TicketNumber(){
    this.navCtrl.push(TicketNumberPage, {
      callback: this.myCallbackFunction,
      item:this.toppingsnumber
    });
  }
  cancel(){
    this.fixed1 = true;
  }
  rollback(){//数据回退
    this.navCtrl.push(DataRollbackListPage,{
      item: {oddnumbers : this.oddnumbers,
             callback : this,
             m_id : this.item["m_id"],
             html:"woodMention"
            }
    }); 
    // this.fixed1 = false;
    // this.rollbacklicensePlateActive1 = "0";
    // if(this.scrollevents!=undefined){
    //   this.scrollevents["enable"](true);
    //   this.rolldata = [];
    // }
  }
  // 用于pop 回调的 block
  myCallbackFunction(params:any){
    this.rollblackclick(params.item);
    return new Promise((resolve, reject) => {
     if(typeof(params)!='undefined'){
         resolve('ok');  
     }else{
         reject(Error('error'));
     }    
    });
  }

  ionViewDidLeave(){
    this.navflag =true;
  }

   saveSure(){
      //验证提交数据是否符合提交要求
      let _valdate:returnReslut = 
      validate.forVlidate(
          [{name:"数量",node:this.number,type:"Number",min:0,max:10000,toFixed:true},
          {name:"库场",node:this.yardSiteMgmtsname,type:"String",condition:true},
          {name:"货位",node:this.yardsitelistname,type:"String",condition:true},
          {name:"车号",node:this.licensePlatename,type:"String",condition:true}]
      );
      //判断是够通过验证
      if(_valdate.flag){//true
          let mac_id_text,driver_n,driver_n_loginid,driver_n_text;
      for(let i=0;i<this.licensePlate.length;i++){
         if(this.licensePlate[i].id==this.licensePlatename){
          mac_id_text = this.licensePlate[i].mac_id_text;
          driver_n = this.licensePlate[i].driver_n;
          driver_n_loginid = this.licensePlate[i].driver_n_loginid;
          driver_n_text = this.licensePlate[i].driver_n_text;
         }
      }
      let _that = this;
      let submitresult = {
        revertNum:(function(){
           let number = _that.revertNum;
           _that.revertNum = 0;
           return number;
        })(),
        licensePlatename:this.licensePlatename,
        yardSiteMgmtsname:this.yardSiteMgmtsname,
        yardsitelistname:this.yardsitelistname,
        toppingsnumber:this.toppingsnumber,
        number:(function(){ 
             let number = _that.number;
              _that.number = 0;
             return number;})(),
        yardSiteMgmts:this.yardSiteMgmts,
        yardsitelist:this.yardsitelist,
        oddnumbers:this.oddnumbers,
        ship_name:this.shipName,
        goods_name:this.goodsName,
        mac_id_text:mac_id_text,
        driver_n:driver_n,
        driver_n_loginid:driver_n_loginid,
        driver_n_text:driver_n_text,
        licensePlate:this.licensePlate,
        revert_flag:this.revert_flag,
        Surplus:this.Surplus,
        number1:this.number1,
        goodsDetailId:this.goodsDetailId,
        goodsDetailExtendId:this.goodsDetailExtendId,
        kRationaleId:this.id
      }
     
      this.http4(submitresult).then(data=>{
          this.presentToast(data["msg"]);
          this.revert_flag = "";
      }).catch(data=>{
      });
      }else{
        this.presentToast(_valdate.Msg+"输入有误！");
      }  
  }
   //提示数据
   showAlert(obj){ 
    let alert = this.alertC.create({
      title: obj.title,
      message: obj.describe,
      buttons: [
        {
          text: obj.buttonLeftText,
          handler: data => {
            obj.buttonLeftEvent(data);
          }
        },
        {
          text: obj.buttonRightText,
          handler: data => {
            obj.buttonRightEvent(data);
          }
        }
      ]
    });
    alert.present();
  }

   //提示数据1
   showAlert1(obj){ 
    let alert = this.alertC.create({
      title: "翻桩录入",
      message: obj.describe,
      buttons: [
        {
          text: "关闭",
          handler: data => {
            obj.buttonLeftEvent(data);
          }
        },
        {
          text: "保存",
          handler: data => {
            obj.buttonRightEvent(data);
          }
        }
      ]
    });
    alert.present();
  }

  
  presentLoadingDefault(msg="数据加载中，请稍等！") { //统一加载处理css 效果组件；

    let loading = this.loadingController.create({
      content:msg
    });
   loading.present();
  return ()=>{loading.dismiss()};
   
  }
  
  
  data_Rollback(){//数据回退
    this.http6({book_id:this.bookid,loginid:lSe.getItem("userData").record.loginid}).then(data=>{
      try{//结构json数据 异常处理
        if(data["msg"]!="没有数据！"){
            this.oddnumbers = [{yard_no:data["data"].bean.yard_no}];//出库单号；
            this.toppingsnumber = data["data"].bean.yard_no;
            this.licensePlate1 = data["data"].maclist;//装机机数据回退；
            this.licensePlate1Active = data["data"].bean.machine_id;
            this.licensePlate = data["data"].carlist;//车辆数据回填；
            this.toppings = data["data"].bean.car_id;
            this.shipName = data["data"].bean.ship_name;
            this.goodsName = data["data"].bean.cargo_name;
            this.number = data["data"].bean.cargo_num;//件数
            this.number1 = data["data"].bean.foot_sn;//卷号回填；
            lSe.setItem("vehicleStorage",JSON.parse(data["data"].bean.formdata).vehicleStorage);//二维数组回填本地存储中；
           // this.capsize = JSON.parse(data["data"].bean.formdata).capsize//翻桩信息赋值
           // this.ispay = data["data"].ispay;//缴费
        }else{
            this.presentToast("没有回退数据！");
        }
      }catch(e){
        //返回 App json处理时发生出错时 处理逻辑；
        this.presentToast("app处理数据错误，已提交后台！");
        let obj:ERROR;
        obj ={err_reason:e.toString(),err_page:this.PAGE,err_data:JSON.stringify(data),loginid:lSe.getItem("userData").record.loginid};//错误
        this.exception.errorhttp(obj);
      } 
    }).catch(data=>{
    })
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
  acceptData(){//接受数据
     this.reset();
     let loading = this.presentLoadingDefault();
     this.http3({ticket_id:this.item["m_id"]}).then((data)=>{
        loading();
        if(data["msg"]=="没有数据！"){
            this.presentToast("没有数据！");
        }else{
          this.licensePlate = data["data"].maclist;//车辆集合赋值
          this.oddnumbers = data["data"].yardDeliverys;//出库单集合赋值
          this.rollbacklicensePlate1 = data["data"].yardDeliverys;
          this.toppingsnumber = data["data"].yardDeliverys[0].id;
          this.shipName = data["data"].yardDeliverys[0].ship_name;
          this.goodsName = data["data"].yardDeliverys[0].goods_name;
          this.Surplus = data["data"].yardDeliverys[0].units;//总件数
          this.number1 = data["data"].yardDeliverys[0].out_num;//出库数量
          this.yardSiteMgmts =  data["data"].yardSiteMgmts;//库场集合；
          this.yardsitelist = this.yardSiteMgmts[0].yardsitelist;//货位集合；
        }
     }).catch(data=>{
     });
  }

  getOrderDetailById1(){//2018-12-17改为http 请求库场和货位
    for(let i=0;this.oddnumbers.length>i;i++){
        if(this.oddnumbers[i].id==this.toppingsnumber){
          this.shipName = this.oddnumbers[i].ship_name;
          this.goodsName = this.oddnumbers[i].goods_name;
          this.Surplus = this.oddnumbers[i].units;//总件数
          this.number1 = this.oddnumbers[i].out_num;//出库数量
        }
    }
    if(this.revert_flag!="")return;
    if(this.toppingsnumber=="0")return;
    this.http7({out_yard_no:this.toppingsnumber}).then(data=>{
       try{
          if(data["msg"]!="没有数据！"){
              let _data = data['data'].yardSiteMgmts;
              this.yardSiteMgmts = _data;
              this.yardsitelist = _data[0].yardsitelist;
              this.yardSiteMgmtsname = "0";
              this.yardsitelistname = "0";
          }else{
            this.presentToast(data["msg"]);
          }
       }catch(e){
           //返回 App json处理时发生出错时 处理逻辑；
           this.presentToast("app处理数据错误，已提交后台！");
           let obj:ERROR;
           obj ={err_reason:e.toString(),err_page:this.PAGE,err_data:JSON.stringify({"constructor":"出库单选择事件出错！"}),loginid:lSe.getItem("userData").record.loginid};//错误
           this.exception.errorhttp(obj);
       }
    }).catch(data=>{
    })
  }
  getOrderDetailById2(){
    for(let i=0;this.yardSiteMgmts.length>i;i++){
       if(this.yardSiteMgmtsname==this.yardSiteMgmts[i].id){
         this.yardsitelist = this.yardSiteMgmts[i].yardsitelist;
       }
    }
    
  }

  getOrderDetailById3(){
  //货位选择事件
  }

  getOrderDetailById4(){
    //车号选择事件
  }

  rollbackfunction(){
    if(this.scrollevents!=undefined){
      this.scrollevents["enable"](true);
      this.rolldata = [];
    }
    this.page.page = 1;
    this.http5({
      ticket_id:this.item["m_id"],
      yard_no:this.rollbacklicensePlateActive1,
      pageBean:JSON.stringify(this.page)
    }).then(data=>{
        let _data = data["data"].pager.rows;//集合赋值；
        this.rolldata = _data;
        if(this.rolldata.length>0){
          this.htmlListLenghtFlag = false;
        }else{
          this.htmlListLenghtFlag = true;
        }
    }).catch(data=>{
    })
  }

  doInfinite(event){
     if(this.scrollevents==undefined){
      this.scrollevents = event;
    }
     this.page.page++;
     this.http5({
      ticket_id:this.item["m_id"],
      yard_no:this.rollbacklicensePlateActive1,
      pageBean:JSON.stringify(this.page)
    }).then(data=>{
      if(data["ok"]){
        let _data:pageBean = data["data"].pager;
         this.rolldata = this.rolldata.concat(_data.rows);
         if(_data.total>_data.page){
            event.complete();
         }else{
           this.presentToast("没有更多数据！");
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
  }
  rollblackclick(item){
    this.http8({kRationale_id:item.id}).then(data=>{
        this.fixed1 = true;
        if(data['ok']){
          let _jsondata = JSON.parse(data["data"].kRationale.formdata);

          //选中指定一个出库单号；
          for(let item of _jsondata.oddnumbers){
            if(item.id == _jsondata.toppingsnumber){
              this.oddnumbers = [item];
              this.toppingsnumber = _jsondata.toppingsnumber;
              break;
            }
          }

          for(let item of _jsondata.yardSiteMgmts){ //库场指定一个库场
             if(item.id == _jsondata.yardSiteMgmtsname){
                for(let _item of _jsondata.yardsitelist){ //货位指定一个货位
                  if(_item.id == _jsondata.yardsitelistname){
                    this.yardsitelist = item.yardsitelist = [_item]
                    this.yardsitelistname = _jsondata.yardsitelistname;
                    break;
                  }
                }
                this.yardSiteMgmts = [item];
                this.yardSiteMgmtsname = _jsondata.yardSiteMgmtsname;
               break;
             }
          }

         //车号赋值
         this.licensePlate = _jsondata.licensePlate;
         this.licensePlatename = _jsondata.licensePlatename;
         this.number = _jsondata.number;
         this.number1 =  _jsondata.number1;
         this.Surplus = _jsondata.Surplus;
         this.goodsName = _jsondata.goods_name;
         this.shipName = _jsondata.ship_name;
         this.goodsDetailId = _jsondata.goodsDetailId,
         this.goodsDetailExtendId = _jsondata.goodsDetailExtendId,
         this.id =  data["data"].kRationale.id;
         this.revert_flag = "1";
        }
    }).catch(data=>{

    })
  }
  //下面是拨离出来的http的请求；低耦合 为了实现连续的逻辑调用 不直接放在业务逻辑中；
  async http(obj){
    return  await new Promise((resolve, reject) => {
       this.service.safetyjop(obj).then(
         (obj:pageBean) =>{
           resolve(obj);
         }
       ).catch(
         obj=>{
         }
       );
     })
  }
  async http2(obj){//车提出库单号list
    return  await new Promise((resolve, reject) => {
       this.service.getdeLiveryList(obj).then(
         (obj:pageBean) =>{
           resolve(obj);
         }
       ).catch(
         obj=>{
         }
       );
     })
  }
  async http3(obj){//车提页面 根据出库单号 拉起页面数据 
    return  await new Promise((resolve, reject) => {
       this.service.getLBData(obj).then(
         (obj:pageBean) =>{
           resolve(obj);
         }
       ).catch(
         obj=>{
         }
       );
     })
  }
  async http4(obj){//车提页面 发车
    return  await new Promise((resolve, reject) => {
       this.service.lbCommit(obj).then(
         (obj:pageBean) =>{
           resolve(obj);
         }
       ).catch(
         obj=>{
         }
       );
     })
  }
  
  async http5(obj){//件杂货回退list
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
  async http6(obj){//数据回退
    return  await new Promise((resolve, reject) => {
      this.service.getKcwoodlastSend(obj).then(
        (obj:pageBean) =>{
          resolve(obj);
        }
      ).catch(
        obj=>{
        }
      );
    })
  }
  //件杂货出库单获取库场货位列表 getLBYardSiteData
  async http7(obj){//数据回退
    return  await new Promise((resolve, reject) => {
      this.service.getLBYardSiteData(obj).then(
        (obj:pageBean) =>{
          resolve(obj);
        }
      ).catch(
        obj=>{
        }
      );
    })
  }
  //返回撤回数据json revertLuoBoDriver
  async http8(obj){//数据回退
    return  await new Promise((resolve, reject) => {
      this.service.revertLuoBoDriver(obj).then(
        (obj:pageBean) =>{
          resolve(obj);
        }
      ).catch(
        obj=>{
        }
      );
    })
  }
  ionViewDidEnter(){
    super.BackButtonCustomHandler(); 
  }

  ionViewWillLeave() {
    super.ionViewWillLeave && super.ionViewWillLeave();
  }
}