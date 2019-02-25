import { Component } from '@angular/core';
import { NavController ,NavParams ,ToastController ,LoadingController ,AlertController ,Platform} from 'ionic-angular';
import { ListPage } from '../list/list';
import { Exception } from '../../service/exception';
import { ERROR } from '../../entity/error';
import { ServiceProvider } from '../../service/http';
import { pageBean } from '../../entity/pageBean';
import { lSe } from '../../public/localstorage';
import { registerBack } from "../../service/registerBack";
import { returnReslut } from '../../entity/returnReslut';
import { validate } from '../../service/validate';

@Component({
  selector: 'page-k_heightDriver',
  templateUrl: 'k_heightDriver.html'
})
export class KheightDriverPage extends registerBack{
  page :pageBean={
    page: 1,//当前页
    pageSize : 10,//每页最大条数
    total : 1,//总页数
    records : 1,//总记录数
  };
  validate = validate;
  revertNum:number=0;//回退提交数量比较；
  hreflag:boolean=true;//提交标记
  loading:any;//loadingobject
  stationNumber:string;//当前工号的编号；
  ionChange:any;
  checkedflag:boolean = false;//checked触发标记
  PAGE:string="heightDriver.ts";//当前页面
  item:String;
  damagedFlag:Boolean = true;
  navflag:Boolean=true;
  shipName: string = "";
  goodsName: string = "";//货名；
  number : number = 0;
  fixed : Boolean = true;
  fixed1 : Boolean = true;
  toppings3:String = "";
  licensePlate2:Array<any> = [];//库场数组
  toppings2:String;//库场选中
  licensePlate3:Array<any> = [];//货位数组；
  securityBook :String;
  stairlist:Array<any>=[];//分票数组；
  secondlevellist:Array<any>=[];//连续编号数组；
  op_id:string ="";//id
  cargo_num:number;//件数
  kRationale:Object;//数据对象
  toppingsname3:string;//货位选中name
  toppingsname2:String;//库场选中id
  operate_id:string="";// id
  detail_id:string="";//detail_ids
  revert_flag:string = "";//hui
  landscape: boolean;//屏幕方向；
  rollbacklicensePlate1: Array<any> =[];//回退船集合；
  rollbacklicensePlate2: Array<any> =[];//回退合同号集合；
  rollbacklicensePlateActive1: string ="";//回退船选中值；
  rollbacklicensePlateActive2: string ="";//回退合同号选中值；
  rolldata:Array<any>=[];//回退数据集合；
  scrollevents:object;//下拉events
  htmlListLenghtFlag:boolean=this.rolldata.length>0?false:true;//回滚集合为空时标记
  constructor(public navCtrl : NavController,
              public navParams : NavParams,
              public service : ServiceProvider,
              public toastController : ToastController,
              public exception :Exception,
              public loadingController:LoadingController,
              private alertCtrl: AlertController,
              public platform: Platform) {
               super('K_heightDriver');
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
                  console.log('竖屏');
                  _that.landscape = false;//div100%css布局
              }else if(window.orientation == 90 || window.orientation == -90){
                 //横屏"
                 _that.landscape = true;//div50%css布局
              }
           });
         try{//结构json数据 异常处理
            //this.loading = this.presentLoadingDefault();
            this.navflag = false;
            this.item = this.navParams.get("item");
            this.securityBook = this.navParams.get("item").text;
            this.fixed = this.securityBook==""? false: true;
            this.stationNumber = lSe.getItem("userData").record.loginid;
            console.log(this.item["m_id"]);
            //if(this.securityBook==""){
            //   if(false){
            //   console.log("请求数据");
            //   this.http2({book_id:this.item["m_id"],loginid:lSe.getItem("userData").record.loginid}).then(data=>{
            //         console.log(data);
            //       //   if(data["msg"]=="没有数据！"){
            //       //     this.presentConfirm(data["msg"],data=>{
            //       //       console.log(data);
            //       //       this.navCtrl.pop();
            //       //     });
            //       // }
            //         //  this.shipName = data["data"].kRationale.ship_name;
            //         //  this.goodsName = data["data"].kRationale.cargo_name;
            //         //  this.licensePlate3 = data["data"].mac_list;//装载机数组
            //         //  this.toppings3 = data["data"].mac_list[0].driver_n_text;
            //         //  let _array =  this.destruction_array(data["data"].detail_list);
            //         //  _array[0].flag = true;
            //         //  this.stairlist  = _array;
            //         //  this.secondlevellist = _array[0].listdata;
            //   }).catch(data=>{

            //   })
            //   console.log(11)
            // }else{
            //  // this.loading();
            // }
          }catch(e){
            //返回 App json处理时发生出错时 处理逻辑；
            this.presentToast("app处理数据错误，已提交后台！");
            let obj:ERROR;
            obj ={err_reason:e.toString(),err_page:this.PAGE,err_data:JSON.stringify({"constructor":"refutation.ts--constructor数据初始化出错！"}),loginid:lSe.getItem("userData").record.loginid};//错误
            this.exception.errorhttp(obj);
            }
  }
  cancel(){
    this.fixed1 = true;
  }
  openPage(){
    console.log("11");
    this.navCtrl.push(ListPage, { item12: "丁伟" });
  }
  stairclick(item){//分票号事件
     console.log(item);
     let _activelist = [];
     for(let i=0;i<this.stairlist.length;i++){
      if(item.id==this.stairlist[i].id){
        if(!item.flag){
          this.stairlist[i].flag = true;
          _activelist = this.stairlist[i].listdata;
          continue;
        }else{
          return;
        }
        //this.stairlist[i].flag = false;
      }
     else{
        this.stairlist[i].flag = false;
     }
    }
    this.secondlevellist = _activelist;
   }
  secondclick(item){//连续编号事件
     console.log(item);
     for(let i=0;i<this.secondlevellist.length;i++){
        if(item.id == this.secondlevellist[i].id){
          this.secondlevellist[i].flag = !item.flag;
        }else{

        }
     }
  }
  destruction_array(array){//解构二维数组；
        console.log(array);
        let stair_array = [];
        for(let i=0;i<array.length;i++){
          let _array = array[i].cargo_sn.split(',');
          for(let j=0;j<_array.length;j++){
            _array[j] = {id:_array[j],flag:false};
          }
          stair_array[i] ={id:array[i].separate_sn,listdata:_array,flag:false} 
        }
        console.log(stair_array);
      return stair_array ;
  }
  sure(){
    //阅读确认事件
    console.log(this.fixed);
    let _data = null;
    
    try{
      let loading = this.presentLoadingDefault();
      this.service.safetyjop({loginid:this.item["loginid"],m_id:this.item["m_id"],update_read:1}).then(
        (obj:pageBean) =>{
            console.log(obj);
            _data = obj;
            if(obj["data"].is_read=="1"){
              console.log("请求数据");
              loading();
          //     this.http2({book_id:this.item["m_id"],loginid:lSe.getItem("userData").record.loginid}).then(data=>{
          //       console.log(data);

          //        this.shipName = data["data"].kRationale.ship_name;
          //        this.goodsName = data["data"].kRationale.cargo_name;
          //        this.licensePlate3 = data["data"].mac_list;//装载机数组
          //        this.toppings3 = data["data"].mac_list[0].driver_n_text;
          //        let _array =  this.destruction_array(data["data"].detail_list);
          //        _array[0].flag = true;
          //        this.stairlist  = _array;
          //        this.secondlevellist = _array[0].listdata;
          //        this.loading();
          // }).catch(data=>{

          // })
              
            }   
        }
      ).catch(
        obj=>{
          console.log(obj);
        }
      );
    }catch(e){
        //返回 App json处理时发生出错时 处理逻辑；
        this.presentToast("app处理数据错误，已提交后台！");
        let obj:ERROR;
        obj ={err_reason:e.toString(),err_page:this.PAGE,err_data:JSON.stringify(_data),loginid:lSe.getItem("userData").record.loginid};//错误
        this.exception.errorhttp(obj);
    }
    
    this.fixed = !this.fixed;
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
  presentLoadingDefault(msg="数据加载中，请稍等！") { //统一加载处理css 效果组件；

    let loading = this.loadingController.create({
      content:msg
    });
   loading.present();
  return ()=>{loading.dismiss()};
   
  }
  
  getDealerName(e){
    console.log(e)
  }
  // getOrderDetailById(){//动态获取船的下的相关信息；
  //   console.log(this.toppings1);
  //   if(this.toppings1!=""){
  //     this.http3({id:this.toppings1}).then(data=>{
  //        console.log(data);
  //        this.loading();
  //        //动态回填合同号和货名；
  //        let _array =[];
  //        if(data["data"].detaillist.length>0){
  //           _array.push({cargo_n:"无信息",contract_no:"请选择"})
  //        }else{
  //           _array.push({cargo_n:"无信息",contract_no:"无信息"})
  //        }
  //       this.licensePlate3 = _array.concat(data["data"].detaillist);
  //       this.toppings3 = this.licensePlate3[0].contract_no;//选中一个合同号；
  //     }).catch(data=>{

  //     })

  //   }
  // }
  // getOrderDetailById1(){//动态根据合同号改变货名；
  //    for(let i=0;i<this.licensePlate3.length;i++){
  //        if(this.licensePlate3[i].contract_no==this.toppings3){
  //            this.goodsName = this.licensePlate3[i].cargo_n;
  //            break;
  //        }
  //    }
  // }
  submit(){//数据提交
         let _that = this;
          //验证提交数据是否符合提交要求
      let _valdate:returnReslut = 
         validate.forVlidate(
          [{name:"数量",node:this.number,type:"Number",min:0,max:10000,toFixed:true},
          {name:"驳名",node:this.shipName,type:"String",condition:true},
         ]
      );
         if(_valdate.flag){
          let submitresult = {
            revertNum:(function(){
               let number = _that.revertNum;
               _that.revertNum =0;
               return number;
            })(),
            kRationale :this.kRationale,
            cargo_num : this.cargo_num,
            yard_name: this.toppingsname2,
            site : this.toppingsname3,
            site_id : this.toppings3,
            yard_id : this.toppings2,
            number : this.number,
            ticket_id :this.item["m_id"],
            operate_id:this.operate_id,// id
            detail_id:this.detail_id,//detail_ids
            revert_flag:this.revert_flag,//hui
            licensePlate2:this.licensePlate2,
            licensePlate3:this.licensePlate3
           };
          this.http4(submitresult).then(data=>{
            if(data["msg"]=="保存成功！"){
              let msg:string = "数据提交成功";
              if(this.revert_flag!=""){
                this.revert_flag = "";
                msg = "回退数据提交成功";
                
              }
              console.log(this.revertNum);
              this.presentToast(msg);
              this.number = 0;
              this.accept();
            }else{
              this.presentToast("数据提交失败！");
            }
            
         }).catch(data=>{
 
         })
        }else{
          this.presentToast(_valdate.Msg+"提交数据有误");
        }
        
    //if(this.goodsName!="无信息"){
    //      if(this.number>0){
    //            //有效提交数据
    //            if(this.hreflag){
    //              this.hreflag = false;//提交加锁防止重复提交数据
    //              //封装表单数据
    //              let _data ={
    //                shipName_id:this.toppings1,
    //                quality:this.quality,
    //                totalNumber:this.totalNumber,
    //                contract_no:this.toppings3,
    //                goodsName:this.goodsName,
    //                number:this.number,
    //                mac_id:this.toppings2
    //              }

    //              console.log(_data);
    //              setTimeout(() => {
    //               this.hreflag = true;
    //               this.presentToast("数据提交成功");
    //             }, 10000);
    //             console.log("数据提交");
    //            }else{
    //             this.presentToast("数据已提交，正在处理中...");
    //            }
               
    //      }else{
    //       this.presentToast("提交\"件数\"大于零");
    //      }
    // }else{
    //   this.presentToast("请选择\"合同号\"");
    //   return;
    // }
  }
  doInfinite(event){
    console.log(event);
    if(this.scrollevents==undefined){
      this.scrollevents = event;
    }
    this.page.page++;
    this.http6({book_id:this.item["m_id"],
                      yard_id:this.rollbacklicensePlateActive1,
                      site_id:this.rollbacklicensePlateActive2,
                      pageBean: JSON.stringify(this.page)}).then(data=>{
                        if(data["ok"]){
                           let _data:pageBean = data["data"].pager;
                            //this.rolldata = _data.rows;
                            this.rolldata = this.rolldata.concat(_data.rows);
                            if(_data.total>_data.page){
                               event.complete();
                            }else{
                              this.presentToast("没有更多数据！");
                               event.enable(false); 
                            }   
                            // if(this.rolldata.length>0){
                            //   this.htmlListLenghtFlag = false;
                            // }else{
                            //   this.htmlListLenghtFlag = true;
                            // }
                        }else{
                          this.presentToast("数据有误！");
                        }
                      }).catch(data=>{});
  }
  rollback(){//数据回退
    
    let _array = [{ yard_name:"请选择",id:"00000000",yardsitelist:[{site:"请选择",id:"00000000"}]}];//库场默认数据
    let _array1 = [{site:"请选择",id:"00000000"}];//货位默认数据
    if(this.licensePlate2.length<=0){//判断是否含有库场和货位信息；yardSiteMgmts
      this.http7().then(data=>{
          console.log(data);
   let _array = [{ yard_name:"请选择",id:"00000000",yardsitelist:[{site:"请选择",id:"00000000"}]}];//库场默认数据
          Array.prototype.push.apply(_array,data["data"].yardSiteMgmts);
          this.rollbacklicensePlateActive1 = "00000000";
          this.rollbacklicensePlate1 = _array;
        }).catch(data=>{

        })
        
    }else{
      let _array = [{ yard_name:"请选择",id:"00000000",yardsitelist:[{site:"请选择",id:"00000000"}]}];//库场默认数据
          Array.prototype.push.apply(_array,this.licensePlate2);
          this.rollbacklicensePlateActive1 = "00000000";
          this.rollbacklicensePlate1 = _array;
    }
    this.fixed1 = false;
    this.recombine();//调用数组重组；
    if(this.scrollevents!=undefined){
      this.scrollevents["enable"](true);
      this.rolldata = [];
    }
      //  this.http5({ticket_id:this.item["m_id"]}).then(data=>{
      //      try{
      //        if(data["msg"]=="没有数据！"){
      //         this.presentToast("没有回退数据！");
      //        }else{
             
      //         this.presentToast("数据回退成功！");
      //         this.operate_id =  data["data"].operate.id,// id
      //         this.detail_id = data["data"].operate.detail_ids,//detail_ids
      //         this.revert_flag = "11";

      //         let json = JSON.parse(data["data"].operate.form_data);
      //         console.log(json);
      //         this.shipName = json.kRationale.ship_name;
      //         this.goodsName = json.kRationale.cargo_name;
      //         this.cargo_num = json.cargo_num;
      //         this.number = json.number;
      //         this.licensePlate2 = json.licensePlate2;
      //         this.licensePlate3 = json.licensePlate3;
      //         this.toppingsname2 = json.yard_name;
      //         this.toppingsname3 = json.site;
      //         this.toppings2 = json.yard_id;
      //         this.toppings3 = json.site_id;
      //         this.kRationale = json.kRationale;
      //        }
             
      //       //  this.op_id = data["data"]["bean"].id;
      //       //  let _array =  JSON.parse(data["data"]["bean"].form_data);//分票列表；
      //       //  this.goodsName = data["data"].kRationale.cargo_name
      //       //  this.shipName =  data["data"].kRationale.ship_name
      //       //  this.stairlist = _array.virtualist; 
      //       //  this.licensePlate3 = data["data"]["mac_list"];//装载机
      //       //  this.toppings3 = _array.mac_name;//装载机司机；
      //       //  for(let item of this.stairlist){
      //       //    if(item.flag){
      //       //     this.secondlevellist = item.listdata;//连续编号数组；
      //       //     break;
      //       //    }
      //       //  }
             
             
      //      }catch(e){
      //           //返回 App json处理时发生出错时 处理逻辑；
      //       this.presentToast("app处理数据错误，已提交后台！");
      //       let obj:ERROR;
      //       obj ={err_reason:e.toString(),err_page:this.PAGE,err_data:JSON.stringify({"constructor":"heightDriver.ts--constructor数据初始化出错！"}),loginid:lSe.getItem("userData").record.loginid};//错误
      //       this.exception.errorhttp(obj);
      //      }
      //  }).catch(data=>{
      //      console.log(data);
      //  });
  }
  recombine(){//回退集合重组
    // let _array = [{
    //   barge_cn: "请选择",
    //   barge_order_id: "00000000",
    //   contractlist:[{
    //     barge_order_id: "00000000",
    //   cargo_n: "0",
    //   contract_no: "请选择"}],
    //   load_counts: "0",
    //   load_weight: "0",
    // }]
    //  this.rollbacklicensePlate1 = Object.assign([],this.licensePlate1);
    //  this.rollbacklicensePlate2 = Object.assign([],[{
    //   barge_order_id: "00000000",
    //   cargo_n: "0",
    //   contract_no: "请选择"
    //  }]);
    //  Array.prototype.push.apply(_array,this.rollbacklicensePlate1);
    //  this.rollbacklicensePlateActive1 = "00000000";
    //  this.rollbacklicensePlate1 = _array;
  }

  getOrderDetailByIdTwo(){
    for(let i = 0;i<this.rollbacklicensePlate1.length;i++){
      if(this.rollbacklicensePlateActive1==this.rollbacklicensePlate1[i].id){
        if(this.rollbacklicensePlate1[i].yardsitelist.length>0){
          this.rollbacklicensePlate2 = this.rollbacklicensePlate1[i].yardsitelist;
          this.rollbacklicensePlateActive2 = "00000000";
        }else{
          this.rollbacklicensePlate2 = [{contract_no:"无合同号",cargo_n:"无货名"}];//合同集合
          this.rollbacklicensePlateActive2 = "无合同号";
          this.presentToast("无合同号")  
        }
       break;
    }
  }
}
getOrderDetailByIdTwo1(){//动态根据合同号改变货名；
  if(this.scrollevents!=undefined){
    this.scrollevents["enable"](true);
    this.rolldata = [];
  }
  this.page.page=1
  for(let i=0;i<this.rollbacklicensePlate2.length;i++){
      if(this.rollbacklicensePlate2[i].id==this.rollbacklicensePlateActive2){
          this.http6({book_id:this.item["m_id"],
                      yard_id:this.rollbacklicensePlateActive1,
                      site_id:this.rollbacklicensePlateActive2,
                      pageBean: JSON.stringify(this.page)}).then(data=>{
                        if(data["ok"]){
                           let _data:pageBean = data["data"].pager;
                            this.rolldata = _data.rows;
                            if(this.rolldata.length>0){
                              this.htmlListLenghtFlag = false;
                            }else{
                              this.htmlListLenghtFlag = true;
                            }
                        }else{
                          this.presentToast("数据有误！");
                        }
                      }).catch(data=>{});
          break;
      }
  }
}
  presentConfirm(msg,func) {
    let alert = this.alertCtrl.create({
      title: '信息提示',
      message: msg,
      buttons: [
        {
          text: '确定',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
            func(111);
          }
        },
        // {
        //   text: 'Buy',
        //   handler: () => {
        //     console.log('Buy clicked');
        //   }
        // }
      ]
    });
    alert.present();
  }
  accept(){//接受数据；
    
    this.http2({ticket_id:this.item["m_id"],loginid:lSe.getItem("userData").record.loginid}).then(data=>{
          console.log(data);
          if(data["msg"]=="没有数据！"){
              this.presentConfirm(data["msg"],data=>{
                console.log(data);
                this.navCtrl.pop();
              });
          }
          this.kRationale = data["data"].kRationale;
          this.shipName = data["data"].kRationale.ship_name;
          this.goodsName = data["data"].kRationale.cargo_name;
          this.cargo_num = data["data"].kRationale.cargo_num;
          this.number = data["data"].kRationale.cargo_num
          this.licensePlate2 = data["data"].yardSiteMgmts;//库场list
          this.toppings2 = data["data"].yardSiteMgmts[0].id;//选中id
          this.toppingsname2 = data["data"].yardSiteMgmts[0].yard_name;//选中name

          this.licensePlate3 = data["data"].yardSiteMgmts[0].yardsitelist//货位list
          this.toppings3 = data["data"].yardSiteMgmts[0].yardsitelist[0].id;//货位选中id
          this.toppingsname3 = data["data"].yardSiteMgmts[0].yardsitelist[0].site;//货位选中name
          //this.loading();
    }).catch(data=>{

    })
  }

  getOrderDetailById1(){//动态根据合同号改变货名；
    for(let i=0;i<this.licensePlate2.length;i++){
        if(this.licensePlate2[i].id==this.toppings2){
            this.licensePlate3 = this.licensePlate2[i].yardsitelist;
            this.toppingsname2 = this.licensePlate2[i].yard_name;
            break;
        }
    }
    this.toppings3 = this.licensePlate3[0].id;
    this.toppingsname3 = this.licensePlate3[0].site;
 }
 getOrderDetailById(){//动态根据合同号改变货名；
  for(let i=0;i<this.licensePlate3.length;i++){
    if(this.licensePlate3[i].id==this.toppings3){
       this.toppingsname3 = this.licensePlate3[i].site;
        break;
    }
}
}
rollblackclick(item){
  this.http5({
    detail_id: item.detail_id
 }).then(data=>{
   if(data["msg"]=="没有数据！"){
     this.presentToast(data["msg"]);
     return;
   }
   this.fixed1 = true;
   this.rolldata = [];
   try{
      if(data["data"].operate!=null&&data["data"].operate!=""){
        //解构赋值
       
        let obj = JSON.parse(data["data"].operate.form_data);
        console.log(obj);//kRationale.ship_name;
        this.shipName = obj.kRationale.ship_name;
        this.goodsName = obj.kRationale.cargo_name;
        this.cargo_num = obj.cargo_num;
        this.number =  obj.number; 
        this.revertNum = obj.number;
        this.licensePlate2 = obj.licensePlate2;
        this.licensePlate3 = obj.licensePlate3;
        this.toppings2 = obj.yard_id;
        this.toppings3 = obj.site_id;
        this.kRationale = obj.kRationale;
        this.toppingsname2 = obj.kRationale.yard_name;
        this.toppingsname3 = obj.kRationale.site; 
        this.operate_id = data["data"].operate.id;
        this.detail_id = data["data"].operate.detail_ids;//detail_ids
        this.revert_flag="1";//hui
        this.toppingsname3=obj.site;
      }
   }catch(e){
     console.log(e);
   }
    console.log(data);
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
           console.log(obj);
         }
       );
     })
  }
  
  async http2(obj){//获取水平司机页面数据
    return  await new Promise((resolve, reject) => {
       this.service.getQBDriverReceive(obj).then(
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
  
  async http3(obj){//根据船名查询数据
    return  await new Promise((resolve, reject) => {
       this.service.getOrderDetailById(obj).then(
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

  async http4(obj){//提交数据
    return  await new Promise((resolve, reject) => {
       this.service.qbDriverCommit(obj).then(
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
  async http5(obj){//数据回退
    return  await new Promise((resolve, reject) => {
       this.service.revertQiBoDriver(obj).then(
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
 // revertQiBoDriverList
  async http6(obj){//数据回退
    return  await new Promise((resolve, reject) => {
       this.service.revertQiBoDriverList(obj).then(
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
  //getQBDriverReceiveCondtions
  async http7(){//数据回退 库场货位
    return  await new Promise((resolve, reject) => {
       this.service.getQBDriverReceiveCondtions().then(
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
  ionViewDidEnter(){
    super.BackButtonCustomHandler(); 
  }

  ionViewWillLeave() {
    super.ionViewWillLeave && super.ionViewWillLeave();
  }
}
