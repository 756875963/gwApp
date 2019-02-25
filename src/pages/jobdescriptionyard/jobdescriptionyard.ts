import { Component } from '@angular/core';
import { NavController ,NavParams ,ToastController} from 'ionic-angular';
import { ListPage } from '../list/list';
import { TicketNumberPage } from '../ticketNumber/ticketNumber';
import { lSe } from '../../public/localstorage';
import { ServiceProvider } from '../../service/http';
import { pageBean } from '../../entity/pageBean';
import { Exception } from '../../service/exception';
import { ERROR } from '../../entity/error';
import { registerBack } from "../../service/registerBack";
import { validate } from "../../service/validate";
import { returnReslut } from '../../entity/returnReslut';

@Component({
  selector: 'page-jobdescriptionyard',
  templateUrl: 'jobdescriptionyard.html'
})

export class JobdescriptionyardPage extends registerBack{
  validate = validate;
  PAGE:string="jobdescriptionyard.ts";//当前页面
  item :Object =null;//前一个页面数据
  jobNumber:String;//当前作业工号
  navflag:Boolean=true;
  ticketNumber;
  rat_id:String;//单号id
  shipName: String;
  goodsName: String;
  number : number ;
  number1 : String ;
  number2 : String ;
  number3 :String ;
  fixed : Boolean = true;
  toppings:String = "苏E 123458";
  licensePlate: Array<any> =[
    {id:1,number:"苏E 123451"},
    {id:2,number:"苏E 123452"},
    {id:3,number:"苏E 123453"},
    {id:4,number:"苏E 123454"},
    {id:5,number:"苏E 123455"},
    {id:6,number:"苏E 123456"},
    {id:7,number:"苏E 123457"},
    {id:8,number:"苏E 123458"},
    {id:9,number:"苏E 123459"},
    {id:10,number:"苏E 123460"},
  ];
  TicketNumberdata :Array<any>; //跳转下一个页面组装的数组；
  securityBook :String ="";
  params1;
  constructor(public navCtrl : NavController,
              public navParams : NavParams,
              public service : ServiceProvider,
              public toastController : ToastController,
              public exception :Exception) {
                super("/jobdescriptionyard");
     this.navflag = false;
     this.item = this.navParams.get("item");
     this.securityBook = this.navParams.get("item").text;
     this.fixed = this.securityBook==""? false: true;
    
       // console.log("listjs",obj["data"].data.page);
        //this.page2={page:obj["data"].data.page,rows:10}
      
         try{//结构json数据 异常处理  
              if( this.securityBook==""){
                //请求库场员页面数据
                console.log("ok");
                  // this.http().then((data)=>{
                  //   if(data["msg"]!="没有数据！"){
                  //       this.jobNumber = lSe.getItem("user").username
                  //       this.shipName = data["data"]["kRationale"].ship_name;
                  //       this.goodsName =  data["data"]["kRationale"].cargo_name;
                  //       this.number1 = data["data"]["kRationale"].cargo_sn;
                  //       this.number = data["data"]["kRationale"].cargo_num;
                  //       this.number3 = data["data"]["kRationale"].mac_num;
                  //       this.rat_id = data["data"]["kRationale"].id;
                  //       this.number2 = data["data"]["kRationale"].separate_sn;
                  //       //处理卷号String 最后一个
                  //       let reel_number = this.number1;
                  //       reel_number.replace(/[,，]$/,"").split(",");
                  //       this.TicketNumberdata = reel_number.replace(/[,，]$/,"").split(",")
                  //   }else{
                  //       this.presentToast(data["msg"]);
                  //   }
                  // },(data)=>{
                  // });
              }
        }catch(e){
          //返回 App json处理时发生出错时 处理逻辑；
          this.presentToast("app处理数据错误，已提交后台！");
          let obj:ERROR;
          obj ={err_reason:e.toString(),err_page:this.PAGE,err_data:JSON.stringify({"constructor":"jobdescriptionyard.ts--constructor数据初始化出错！"}),loginid:lSe.getItem("userData").record.loginid};//错误
          this.exception.errorhttp(obj);
          }
      
    


  }
  openPage(){
    console.log("11");
    this.navCtrl.push(ListPage, { item12: "丁伟" });
  }
  sure(){
    //阅读确认事件
    console.log(this.fixed);
    this.service.safetyjop({loginid:this.item["loginid"],m_id:this.item["m_id"],update_read:1}).then(
      (obj:pageBean) =>{
       // console.log("listjs",obj["data"].data.page);
        //this.page2={page:obj["data"].data.page,rows:10}
      
        console.log(obj);
        if(obj["data"].is_read=="1"){
          //请求库场员页面数据
          console.log("ok");
          this.http().then((data)=>{
            if(data["msg"]!="没有数据！"){
                this.jobNumber = lSe.getItem("user").username
                this.shipName = data["data"]["kRationale"].ship_name;
                this.goodsName =  data["data"]["kRationale"].cargo_name;
                this.number1 = data["data"]["kRationale"].cargo_sn;
                this.number = data["data"]["kRationale"].cargo_num;
                this.number3 = data["data"]["kRationale"].mac_num;
                this.rat_id = data["data"]["kRationale"].id;
                this.number2 = data["data"]["kRationale"].separate_sn;
                //处理卷号String 最后一个
                let reel_number = this.number1;
                reel_number.replace(/[,，]$/,"").split(",");
                this.TicketNumberdata = reel_number.replace(/[,，]$/,"").split(",")
            }else{
              this.presentToast(data["msg"]);
            }
          },(data)=>{
          });
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
  TicketNumber(){
    //获取数组卷号数组
    if(this.TicketNumberdata==undefined)return;
    let _array = this.TicketNumberdata;
    let _array1 = this.number2!=""&&this.number2!=null?this.number2.split(','):new Array(this.TicketNumber.length);
    let _array2 = new Array();
    for(let i =0;i<_array.length;i++){
      _array2[i] = {
        id:i,
        name1:_array[i],
        name2:_array1[i],
        name3:1,
        flag:false
      }
    }
    if(_array2.length>0){
       //跳转分票页面
    this.navCtrl.push(TicketNumberPage, {
      callback: this.myCallbackFunction,
      item: _array2
    });
    }else{
      this.presentToast("请拉取有效的件号数据！");
    }
  }
  // 用于pop 回调的 block
  myCallbackFunction(params:Array<any>){
   // this.ticketNumber =params;
   console.log(params);
   console.log(this);
    
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
    if(lSe.getItem("ticketNumber")){
       if(lSe.getItem("ticketNumber").length>0){
          var str = this.number2 = '';
          for(var i=0;i<lSe.getItem("ticketNumber").length;i++){
            if(lSe.getItem("ticketNumber")[i].name2==undefined)break;
            if(lSe.getItem("ticketNumber").length-1==i){
              str=str+lSe.getItem("ticketNumber")[i].name2
            }else{
              str=str+lSe.getItem("ticketNumber")[i].name2+','
            } 
          }
          this.number2 =str;
          lSe.setItem("ticketNumber",null);//设置为空
       }
    }
    if(this.navflag){
      this.httpC();
    }
    super.BackButtonCustomHandler();
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
    let _valdate:returnReslut = 
          validate.forVlidate(
          [
            {name:"分票号",node:this.number2,type:"String",condition:true},
            {name:"件数",node:this.number,type:"Number",condition:true,min:1},
          ])
     //判断数据是否填充
     let separate_sn = this.number2;
     if(_valdate.flag){
       //提交数据
        this.http2({loginid:this.item["loginid"],separate_sn:separate_sn,rat_id:this.rat_id}).then(data=>{
          if(data["msg"]=="更新成功！"){
               this.presentToast("发车成功！");
               this.number2 = "";
               this.number = 0;
               this.TicketNumberdata = [];
          }else{
               this.presentToast("发车失败！");
          }
        },data=>{
          console.log(data);
        });
     }else{
        this.presentToast(_valdate.Msg+"输入有误！");
     }
  }
  receivedata(){
    //手动接受数据
    this.http().then((data)=>{
      try{//结构json数据 异常处理
        if(data["msg"]!="没有数据！"){
          this.jobNumber = lSe.getItem("user").username;
          this.shipName = data["data"]["kRationale"].ship_name;
          this.goodsName =  data["data"]["kRationale"].cargo_name;
          this.number1 = data["data"]["kRationale"].cargo_sn;
          this.number = data["data"]["kRationale"].cargo_num;
          this.number3 = data["data"]["kRationale"].mac_num;
          this.rat_id = data["data"]["kRationale"].id;
          this.number2 = data["data"]["kRationale"].separate_sn;
          //处理卷号String 最后一个
          let reel_number = this.number1;
          reel_number.replace(/[,，]$/,"").split(",");
          this.TicketNumberdata = reel_number.replace(/[,，]$/,"").split(",")
        }else{
          this.presentToast(data["msg"]);
        }
      }catch(e){
        //返回 App json处理时发生出错时 处理逻辑；
        this.presentToast("app处理数据错误，已提交后台！");
        let obj:ERROR;
        obj ={err_reason:e.toString(),err_page:this.PAGE,err_data:JSON.stringify(data),loginid:lSe.getItem("userData").record.loginid};//错误
        this.exception.errorhttp(obj);
    }    
    },(data)=>{

    });
  
  }
  roleback(){
    //数据回滚
     this.service.rollbacktally({loginid:this.item["loginid"],book_id:this.item["m_id"],ticket_id:this.item["m_id"]}).then(data=>{
          console.log(data["data"]["bean"]);
        try{//结构json数据 异常处理
          if(data["msg"]!="没有数据！"){
            this.jobNumber = lSe.getItem("user").username;
            this.shipName = data["data"]["bean"].ship_name;
            this.goodsName =  data["data"]["bean"].cargo_name;
            this.number1 = data["data"]["bean"].cargo_sn;
            this.number = data["data"]["bean"].cargo_num;
            this.number3 = data["data"]["bean"].mac_num;
            this.rat_id = data["data"]["bean"].id;
            this.number2 = data["data"]["bean"].separate_sn;
            //处理卷号String 最后一个
            let reel_number = this.number1;
            reel_number.replace(/[,，]$/,"").split(",");
            this.TicketNumberdata = reel_number.replace(/[,，]$/,"").split(",")
          }else{
           
            this.presentToast(data["msg"]);
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
       this.service.warehouse({loginid:this.item["loginid"],book_id:this.item["m_id"],ticket_id:this.item["m_id"]}).then(
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
  async http2(pagedata){//页面数据提交
    return await new Promise((resolve, reject)=>{
        this.service.warehouse_submit(pagedata).then((obj:pageBean)=>{
          resolve(obj);
        }).catch(obj=>{
          console.log(obj);
        })
    })
  }

 
  ionViewWillLeave(){
    super.ionViewWillLeave && super.ionViewWillLeave();
  }
}
