import { Component } from '@angular/core';
import { NavController ,AlertController ,LoadingController ,NavParams ,ToastController ,Events} from 'ionic-angular';
import { ListPage } from '../list/list';
import { TicketNumberPage } from '../ticketNumber/ticketNumber';
import { lSe } from '../../public/localstorage';
import { vehicleStoragePage } from '../vehicleStorage/vehicleStorage';
import { VehicleListPage } from '../vehicleList/vehicleList';
import { PaymentPage } from '../payment/payment';
import { ServiceProvider } from '../../service/http';
import { pageBean } from '../../entity/pageBean';
import { Exception } from '../../service/exception';
import { ERROR } from '../../entity/error';
@Component({
  selector: 'page-jobdescriptionInstall',
  templateUrl: 'jobdescriptionInstall.html'
})
export class JobdescriptionInstallPage {
  userName:string;//title 操作员
  PAGE:string="jobdescriptionOut.ts";//当前页面
  bookid:string;//任务书id
  task:any;//定时器任务
  capsize:object={
      saw_amount:0,//锯断刀数
      out_turn_no:0,//外翻根数
      out_turn_vol:0,//外翻体积
      in_turn_no:0,//内翻根数
      in_turn_vol:0,//内翻体积
      pile_turn_no:0,//归根根数
      pile_turn_vol:0,//归根体积
      cut_num:0//锯刀数
  };//翻桩对象
  measure_average:number;//平均方单位；
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
  fixed2:Boolean = true;
  toppings:String = "苏E 123458";//车辆选择；
  toppingsnumber:String;//当前出库单号的编号yard_no
  licensePlate:Array<any>;
  oddnumbers:Array<any>;
  securityBook:String;
  params1;
  ispay:String;//缴费状态
  opennumber:Number;//开单数量
  finishnumber:Number;//完成数据
  Surplus:Number;//剩余数量
  licensePlate1:Array<any>;//装载机数组
  licensePlate1Active:String;//装载机选中状态
  constructor(public navCtrl:NavController,
              public alertC:AlertController,
              public loadingController:LoadingController,
              public service:ServiceProvider,
              public navParams:NavParams,
              public toastController:ToastController,
              public events:Events,
              public exception:Exception
             ){
      try{//结构json数据 异常处理
          this.navflag = false;
          this.item = this.navParams.get("item");
          this.securityBook = this.navParams.get("item").text;
          this.fixed = this.securityBook==""? false: true;
          this.userName = lSe.getItem("userData").record.username;
          console.log( this.securityBook);
          this.bookid = this.item["m_id"];//赋值bookid
          if(this.securityBook==""){
              console.log("请求数据");
              this.http2({book_id:this.item["m_id"],loginid:this.item["loginid"]}).then(data=>{
                    console.log(data);
                    if(data["data"].msg !="没有数据！"){
                      // console.log(data["data"].deliveryList);
                      // this.oddnumbers = data["data"].deliveryList;
                      // this.toppingsnumber =  data["data"].deliveryList[0].yard_no;
                      // console.log(this.toppingsnumber);
                      // this.http3({book_id:this.item["m_id"],
                      //           loginid:this.item["loginid"],
                      //           yard_no:data["data"].deliveryList[0].yard_no}).then(data=>{
                      //             console.log(data);
                      //             //车辆赋值
                      //           this.licensePlate = data["data"].carlist;
                      //           this.toppings = data["data"].carlist[0].cid;
                      //           this.measure_average =  data["data"].delivery.measure_average;//平均方单位；
                      //           this.shipName =  data["data"].delivery.ship_name;
                      //           this.goodsName = data["data"].delivery.goods_name;
                      //           this.ispay = data["data"].ispay;//缴费
                      //           this.opennumber = data["data"].delivery.units//开单
                      //           this.Surplus =  data["data"].delivery.units - data["data"].delivery.finish_units//剩余数量
                      //           this.licensePlate1 = data["data"].maclist;//装载机数组赋值；
                      //           this.licensePlate1Active = data["data"].maclist[0].mac_id;
                      //           console.log(this.licensePlate);
                      // }).catch(data=>{

                      // });
                    }else{
                      this.presentToast(data["data"].msg);
                    }
                
            }).catch(data=>{
                
            });
          }
      }catch(e){
      //返回 App json处理时发生出错时 处理逻辑；
      this.presentToast("app处理数据错误，已提交后台！");
      let obj:ERROR;
      obj ={err_reason:e.toString(),err_page:this.PAGE,err_data:JSON.stringify({"constructor":"jobdescriptionOut.ts--constructor数据初始化出错！"}),loginid:lSe.getItem("userData").record.loginid};//错误
      this.exception.errorhttp(obj);
      }
  }
  openPage(){
    console.log("11");
    this.navCtrl.push(ListPage, { item12: "丁伟" });
  }
  sure(){//阅读安全书确认方法
    console.log(this.fixed);console.log(this.fixed);
    this.service.safetyjop({loginid:this.item["loginid"],m_id:this.item["m_id"],update_read:1}).then(
      (obj:pageBean) =>{
        console.log(obj);
        if(obj["data"].is_read=="1"){
             console.log("请求数据");
        }
      }
    ).catch(
      obj=>{
        console.log(obj);
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
  // 用于pop 回调的 block
  myCallbackFunction(params:Array<any>){
   // this.ticketNumber =params;
    return new Promise((resolve, reject) => {
     if(typeof(params)!='undefined'){
         resolve('ok');
         console.log(this);
     }else{
         reject(Error('error'))
     }    
    });
  }
  ionViewDidEnter(){
    // if(lSe.getItem("ticketNumber")){
    //    if(lSe.getItem("ticketNumber").length>0){
    //       var str = this.number2 = '';
    //       for(var i=0;i<lSe.getItem("ticketNumber").length;i++){
    //         if(lSe.getItem("ticketNumber").length-1==i){
    //           str=str+lSe.getItem("ticketNumber")[i].name2
    //         }else{
    //           str=str+lSe.getItem("ticketNumber")[i].name2+','
    //         } 
    //       }
    //       this.number2 =str;
    //       lSe.setItem("ticketNumber",null);//设置为空
    //    }
    // }
    // if(this.navflag){
    //   this.httpC();
    // }
    // if(lSe.getItem("vehicledata")!=null&&lSe.getItem("vehicledata")["read"]){
    //   //判断是否记载本地存储的卷号
    //    lSe.setItem("vehicledata",{read:false});
    //    console.log(lSe.getItem("vehicleStorage"));
    //    this.sorting_data(lSe.getItem("vehicleStorage"));
    // }
    // console.log(lSe.getItem("vehicledata"));
  }
  ionViewDidLeave(){
    console.log("离开");
    this.navflag =true;
  }
  httpC(){//统一请求
    console.log("请求");
  }
  backOff(){//数据回退
     console.log("数据回退");
  }
  start(){//发车
     console.log("发车");
     //翻转信息capsize ，车辆木头推放集合 vehicleStorage，当前出库单号toppingsnumber
     this.http4({capsize:this.capsize,//翻转信息capsize
                 vehicleStorage:lSe.getItem("vehicleStorage"),//车辆木头推放集合
                 yard_no:this.toppingsnumber,//当前出库单号
                 cargonum:this.number,// 发车件数
                 foot_sn:this.number1,//桩脚号str
                 mac_id:this.licensePlate1Active,//机械号id
                 book_id:this.bookid,//任务书id
                 loginid:lSe.getItem("userData").record.loginid,//登陆loginid
                 car_no:this.toppings,//车牌号吗
                 wood_id:""//回退数据的数据id
      }).then(data=>{
          try{//结构json数据 异常处理
            console.log(data);
              if(true){//判断数据是否提交更新成功
                    lSe.setItem("vehicleStorage",null);//本地存储设置空；
                    this.http3({book_id:this.item["m_id"],
                          loginid:this.item["loginid"],
                          yard_no:this.toppingsnumber}).then(data=>{
                            console.log(data);
                            //车辆赋值
                          this.licensePlate = data["data"].carlist;
                          this.toppings = data["data"].carlist[0].cid;
                          this.measure_average =  data["data"].delivery.measure_average;//平均方单位；
                          this.shipName =  data["data"].delivery.ship_name;
                          this.goodsName = data["data"].delivery.goods_name;
                          this.ispay = data["data"].ispay;//缴费
                          this.opennumber = data["data"].delivery.units//开单
                          this.Surplus =  data["data"].delivery.units - data["data"].delivery.finish_units//剩余数量
                          this.licensePlate1 = data["data"].maclist;//装载机数组赋值；
                          this.licensePlate1Active = data["data"].maclist[0].mac_id;
                          console.log(this.licensePlate);
                    }).catch(data=>{

                    });
              }else{

              }
          }catch(e){
              //返回 App json处理时发生出错时 处理逻辑；
              this.presentToast("app处理数据错误，已提交后台！");
              let obj:ERROR;
              obj ={err_reason:e.toString(),err_page:this.PAGE,err_data:JSON.stringify(data),loginid:lSe.getItem("userData").record.loginid};//错误
              this.exception.errorhttp(obj);
          }    
     }).catch(data=>{

     });
  }

  Outboundorder(obj){
    console.log("出库");
    if(Boolean(obj)){
      this.fixed2 = false;
    }else{
      this.fixed2 = true;
    }
    
  }
  Outboundorderchecked(obj){
   console.log(obj);
   this.fixed2 = true;
   this.outboundorderNum = obj;
  }
  vehicleStoragePage(){//车辆堆放页面
    let _that= this;
    this.events.subscribe('_TOTALCALCULATE', (params) => {//触发页面vehiceStorsge.ts
      // 接收B页面发布的数据
      console.log('接收数据为: ' + JSON.parse(params).numL);
      try{//结构json数据 异常处理
          ///_that.number =  JSON.parse(params).numL; 
      }catch(e){
         //返回 App json处理时发生出错时 处理逻辑；
         console.log(e.toString());
         let obj:ERROR;
         obj ={err_reason:e.toString(),err_page:this.PAGE,err_data:JSON.stringify(JSON.parse(params)),loginid:lSe.getItem("userData").record.loginid};//错误
         this.exception.errorhttp(obj);
      }
      
      // 取消订阅
      this.events.unsubscribe('_TOTALCALCULATE');
    })
    let _number:string;
    for(let i=0;this.licensePlate.length;i++){
      if(this.licensePlate[i].cid==this.toppings){
        _number = this.licensePlate[i].carno;
        break;
      }
    }

    this.navCtrl.push(vehicleStoragePage, {
      item:{toppingsnumber:this.toppingsnumber,
            measure_average:this.measure_average,
            toppings:_number}});
  }
  sorting_data(Array){
    let _Array = [],_str="";
    for(let i=0,k=0;Array.length>i;i++){
      console.log(i);
      for(let j=0;Array[i].length>j;j++){
         if(j==0&&Array[i][j]["text"]=="")break;
         if(Array[i][j]["text"]!=""){
            _Array[k++]=Array[i][j];
            _str+=Array[i][j]["text"]+',';
         }
      }
    }
    _str=_str.substring(0,_str.length-1);
    this.number1 = _str;
     console.log(_Array,_str);
    this.number = _Array.length;
  }
  goto_vehiclelist(){//车辆汇总
    this.navCtrl.push(VehicleListPage,{item:1});

  }
   saveSure(){
     //提交数据确认
     let _that = this;
     let alert = this.alertC.create({
      title: "提交确认",
      message: "是否确定提交数据！",
      buttons: [
        {
          text:"取消",
          handler: data => {
            //console.log('Cancel clicked');
          }
        },
        {
          text: "确认",
          handler: data => {
            //console.log(data);
            _that.start();
          }
        }
      ]
    });
    alert.present();
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
            console.log('Cancel clicked');
            obj.buttonLeftEvent(data);
          }
        },
        {
          text: obj.buttonRightText,
          handler: data => {
            console.log(data);
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
           // console.log('Cancel clicked');
            obj.buttonLeftEvent(data);
          }
        },
        {
          text: "保存",
          handler: data => {
            //console.log(data);
            obj.buttonRightEvent(data);
          }
        }
      ]
    });
    alert.present();
  }

  query_Piling(){//翻桩查看
    //this.presentLoadingDefault();//加载loading；
    //根据出库单来查询 翻桩信息
    if(this.toppingsnumber!=""&&this.toppingsnumber!=null){
         this.http5({yard_no:this.toppingsnumber}).then(data=>{
            console.log(data);
            try{//结构json数据 异常处理
                let _text =""; 
                _text = data["data"].plan.pile_require!=""&&data["data"].plan.pile_require!=null? data["data"].plan.pile_require:"无相关翻桩信息";
                this.showAlert({
                  title:"翻桩信息",//title
                  describe:_text,//描述信息
                  buttonLeftText:"关闭",//左边按钮文字
                  buttonRightText:"确定",//右边按钮文字
                  buttonLeftEvent:function(data){
                    console.log("取消事件");
                  },
                  buttonRightEvent:function(data){
                    console.log("确定事件");
                  }
                });
            }catch(e){
                //返回 App json处理时发生出错时 处理逻辑；
                this.presentToast("app处理数据错误，已提交后台！");
                let obj:ERROR;
                obj ={err_reason:e.toString(),err_page:this.PAGE,err_data:JSON.stringify(data),loginid:lSe.getItem("userData").record.loginid};//错误
                this.exception.errorhttp(obj);
            }
         }).catch(data=>{

         })
    }else{
       //未选择有效的出库单提示；
       this.presentToast("未选择有效的出库");
    }
    
  }
  add_Piling(){//翻桩录入
    this.damagedFlag = false;
  }
  goto_payment(){//去缴费页面
    if(this.toppingsnumber!=""&&this.toppingsnumber!=null)
        this.service.getPayTheFees({yard_no:this.toppingsnumber}).then(data=>{
          if(data["msg"]!="没有数据！"){
              this.navCtrl.push(PaymentPage,{item:data});
          }else{
            this.presentToast("未选择有效的出库单");
          }
          console.log(data["data"].list);
          
        }).catch(data=>{

        });
    else{
      this.presentToast("未选择有效的出库单");
    }
   
  }
  presentLoadingDefault() {
    let loading = this.loadingController.create({
      content: '数据处理中...'
    });
  
    loading.present();
  return loading
    // setTimeout(() => {
    //   loading.dismiss();
    // }, 5000);
  }
  damaged_state(flag){
    this.presentLoadingDefault().dismiss();
    this.damagedFlag = flag;
    // if(flag){
    //   console.log(flag);
    // }else{
    //   console.log(false);
    // }
  }
  focusInput(){
    //翻桩计算capsize:object={
    //saw_amount:0,//锯断刀数
    //out_turn_no:0,//外翻根数
    //out_turn_vol:0,//外翻体积
    //in_turn_no:0,//内翻根数
    // in_turn_vol:0,//内翻体积
    // pile_turn_no:0,//归根根数
    //pile_turn_vol:0,//归根体积
    //cut_num:0//锯刀数
    //};//翻桩对象
    //
    var thst = this;
    this.task = setInterval(data=>{
      let that = this;
      that.capsize ={
        out_turn_no:that.capsize["out_turn_no"],
        out_turn_vol:(that.capsize["out_turn_no"] * that.measure_average).toFixed(3),
        in_turn_no:that.capsize["in_turn_no"],
        in_turn_vol:(that.capsize["in_turn_no"] * that.measure_average).toFixed(3),
        pile_turn_no:that.capsize["out_turn_no"] + that.capsize["in_turn_no"],
        pile_turn_vol:(parseFloat(that.capsize["out_turn_vol"]) + parseFloat(that.capsize["in_turn_vol"])).toFixed(3),
        cut_num:that.capsize["cut_num"]
      }    
    },200); 
    //this.task = setInterval(_this.calculateFunction(_this),1000); 

  }
  blurInput(){
     console.log("失去焦点事件");
     clearInterval(this.task);
  }
  calculateFunction(that){
    console.log("计算");
    //计算方法
    that.capsize ={
      out_turn_no:that.capsize["out_turn_no"],
      out_turn_vol:(that.capsize["out_turn_no"] * that.measure_average).toFixed(3),
      in_turn_no:that.capsize["in_turn_no"],
      in_turn_vol:(that.capsize["in_turn_no"] * that.measure_average).toFixed(3),
      pile_turn_no:that.capsize["out_turn_no"] + that.capsize["in_turn_no"],
      pile_turn_vol:parseFloat(that.capsize["out_turn_vol"]) + parseFloat(that.capsize["in_turn_vol"]),
      cut_num:that.capsize["cut_num"]
    }
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
            this.capsize = JSON.parse(data["data"].bean.formdata).capsize//翻桩信息赋值
            this.ispay = data["data"].ispay;//缴费
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
      console.log('Dismissed toast');
    });
    toast.present();
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
           console.log(obj);
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
           console.log(obj);
         }
       );
     })
  }
  async http3(obj){//车提页面 根据出库单号 拉起页面数据 
    return  await new Promise((resolve, reject) => {
       this.service.deliveryDataByYardNo(obj).then(
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
  async http4(obj){//车提页面 发车
    return  await new Promise((resolve, reject) => {
       this.service.kcwoodsend(obj).then(
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
  async http5(obj){//根据出库单查询 翻桩信息
    return  await new Promise((resolve, reject) => {
       this.service.yarddelivery(obj).then(
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
  async http6(obj){//数据回退
    return  await new Promise((resolve, reject) => {
      this.service.getKcwoodlastSend(obj).then(
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