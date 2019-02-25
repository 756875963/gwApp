import { Component ,ViewChild} from '@angular/core';
import { NavController ,NavParams ,ToastController ,LoadingController ,Content ,Events} from 'ionic-angular';
import { ListPage } from '../list/list';
import { Exception } from '../../service/exception';
import { ERROR } from '../../entity/error';
import { ServiceProvider } from '../../service/http';
import { pageBean } from '../../entity/pageBean';
import { lSe } from '../../public/localstorage';
import { registerBack } from "../../service/registerBack";
import { DataRollbackListPage } from '../dataRollbackList/dataRollbackList';
import { returnReslut } from '../../entity/returnReslut';
import { validate } from '../../service/validate';
@Component({
  selector: 'page-refutation',
  templateUrl: 'refutation.html'
})
export class RefutationPage extends registerBack {
  @ViewChild(Content) content : Content;
  page :pageBean={
    page: 1,//当前页
    pageSize : 10,//每页最大条数
    total : 1,//总页数
    records : 1,//总记录数
  };
  validate = validate;
  hreflag: boolean = true;//提交标记
  //loading: any;//loadingobject
  stationNumber: string;//当前工号的编号；
  ionChange: any;
  checkedflag: boolean = false;//checked触发标记
  quality: number;//质量
  totalNumber: number;//总件数
  PAGE: string = "refutation.ts";//当前页面
  item: String;
  damagedFlag: Boolean = true;
  navflag: Boolean = true;
  shipName: string = "";
  goodsName: string = "";//货名；
  number: number = 0;
  fixed: Boolean = true;
  fixed1: boolean = true;
  toppings: String = "";
  toppings1: String = "";//船名选中；
  toppings2: String = "";//合同号选中；
  toppings3: String = "";//车号选中；
  licensePlate1: Array<any> =[];//船名集合；
  licensePlate2: Array<any> =[];//合同号集合；
  licensePlate3: Array<any> =[];//车号集合；
  securityBook: String;
  bookid: string; //提交完成返回bookid；
  revert_flag: string = "";//修改标记 "" insert；"1" update;
  revert_id: string = "";//rat_id 
  revert_operate_id: string = "";//id
  landscape: boolean;//屏幕方向；
  rollbacklicensePlate1: Array<any> =[];//回退船集合；
  rollbacklicensePlate2: Array<any> =[];//回退合同号集合；
  rollbacklicensePlateActive1: string ="";//回退船选中值；
  rollbacklicensePlateActive2: string ="";//回退合同号选中值；
  rolldata:Array<any>=[];//回退数据集合；
  scrollevents:object;//下拉events
  htmlListLenghtFlag:boolean=this.rolldata.length>0?false:true;//回滚集合为空时标记
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public service: ServiceProvider,
              public toastController: ToastController,
              public exception: Exception,
              public events :Events,
              public loadingController: LoadingController) {
                super("/refutation");
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
              let loading = this.presentLoadingDefault();
         try{//结构json数据 异常处理
            this.navflag = false;
            this.item = this.navParams.get("item");
            this.securityBook = this.navParams.get("item").text;
            this.fixed = this.securityBook==""? false: true;
            this.stationNumber = lSe.getItem("userData").record.loginid;
            if(this.securityBook==""){
             this.bookid =  this.item["m_id"];
             this.http2({book_id:this.item["m_id"],ticket_id:this.item["m_id"],loginid:lSe.getItem("userData").record.loginid}).then(data=>{
                        loading();
                        this.licensePlate1 = data["data"].ship.bargelist;//船名；
                        this.toppings1 = data["data"].ship.bargelist[0].barge_order_id;
                        this.licensePlate2 = data["data"].maclist;//车号；
                        this.toppings2 = data["data"].maclist[0].mac_id;
                        if(data["data"].ship.bargelist.length>0){
                          this.licensePlate3 = data["data"].ship.bargelist[0].contractlist;//合同集合
                          this.toppings3 = data["data"].ship.bargelist[0].contractlist[0].contract_no;
                        }else{
                          this.licensePlate3 = [{contract_no:"无合同号",cargo_n:"无货名"}];//合同集合
                          this.toppings3  = "无货名";
                          // this.toppings3 = data["data"].ship.bargelist[0].contractlist[0].contract_no;
                        }
                        
                        
                        this.quality = data["data"].ship.bargelist[0].load_weight;//质量
                        this.totalNumber = data["data"].ship.bargelist[0].load_counts;//件数
                        
              }).catch(data=>{

              })
            }else{
                 loading();
            }
          }catch(e){
            //返回 App json处理时发生出错时 处理逻辑；
            this.presentToast("app处理数据错误，已提交后台！");
            let obj:ERROR;
            obj ={err_reason:e.toString(),err_page:this.PAGE,err_data:JSON.stringify({"constructor":"refutation.ts--constructor数据初始化出错！"}),loginid:lSe.getItem("userData").record.loginid};//错误
            this.exception.errorhttp(obj);
            loading();
            }
  }
  openPage(){
    this.navCtrl.push(ListPage, { item12: "" });
  }
  sure(){
    //阅读确认事件
    let _data = null;
    let loading = this.presentLoadingDefault();
    try{
      this.service.safetyjop({loginid:this.item["loginid"],m_id:this.item["m_id"],update_read:1}).then(
        (obj:pageBean) =>{
            _data = obj;
            if(obj["data"].is_read=="1"){
              this.http2({book_id:this.item["m_id"],loginid:lSe.getItem("userData").record.loginid,ticket_id:this.item["m_id"]}).then(data=>{
                this.licensePlate1 = data["data"].ship.bargelist;//船名；
                this.toppings1 = data["data"].ship.bargelist[0].barge_order_id;
                this.licensePlate2 = data["data"].maclist;//车号；
                this.toppings2 = data["data"].maclist[0].mac_id;
                if(data["data"].ship.bargelist.length>0){
                  this.licensePlate3 = data["data"].ship.bargelist[0].contractlist;//合同集合
                  this.toppings3 = data["data"].ship.bargelist[0].contractlist[0].contract_no;
                }else{
                  this.licensePlate3 = [{contract_no:"无合同号",cargo_n:"无货名"}];//合同集合
                  this.toppings3  = "无货名";
                }
                  this.quality = data["data"].ship.bargelist[0].load_weight;//质量
                  this.totalNumber = data["data"].ship.bargelist[0].load_counts;//件数
                  loading();
              }).catch(data=>{
                  console.log(data);
              })
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
        loading();
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
  presentLoadingDefault(msg="数据加载中，请稍等！") { //统一加载处理css 效果组件；

    let loading = this.loadingController.create({
      content:msg
    });
   loading.present();
  return ()=>{loading.dismiss()};
   
  }
  
  getDealerName(e){
    
  }
  getOrderDetailByIdTwo(){
    for(let i = 0;i<this.rollbacklicensePlate1.length;i++){
      if(this.rollbacklicensePlateActive1==this.rollbacklicensePlate1[i].barge_order_id){
        if(this.rollbacklicensePlate1[i].contractlist.length>0){
          this.rollbacklicensePlate2 = this.rollbacklicensePlate1[i].contractlist;
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
  getOrderDetailById(){//动态获取船的下的相关信息；
    for(let i = 0;i<this.licensePlate1.length;i++){
      if(this.toppings1==this.licensePlate1[i].barge_order_id){
        this.quality = this.licensePlate1[i].load_weight;//质量
        this.totalNumber = this.licensePlate1[i].load_counts;//件数
        if(this.licensePlate1[i].contractlist.length>0){
          this.licensePlate3 =  this.licensePlate1[i].contractlist;
          this.toppings3 = this.licensePlate1[i].contractlist[0].contract_no;
        }else{
          this.licensePlate3 = [{contract_no:"无合同号",cargo_n:"无货名"}];//合同集合
          this.toppings3 = "无合同号";
          this.goodsName = "无货名";
          this.presentToast("无合同号")  
        }
        break;
    }
  }
  }
  getOrderDetailById1(){//动态根据合同号改变货名；
     for(let i=0;i<this.licensePlate3.length;i++){
         if(this.licensePlate3[i].contract_no==this.toppings3){
             this.goodsName = this.licensePlate3[i].cargo_n;
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
        if(this.rollbacklicensePlate2[i].contract_no==this.rollbacklicensePlateActive2){
            this.http6({ticket_id:this.item["m_id"],
                        ship_id:this.rollbacklicensePlateActive1,
                        contract_no:this.rollbacklicensePlateActive2,
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
  submit(){//数据提交
     //验证提交数据是否符合提交要求
     let _valdate:returnReslut = 
     validate.forVlidate(
         [{name:"数量",node:this.number,type:"Number",min:0,max:10000,toFixed:true},
        ]
     );
         let _reg =  /^(0|\+?[1-9][0-9]*)$/;
         let _that = this;
         if( this.goodsName == "无货名"){
           this.presentToast("无效合同号，无法提交！");
           return;
         }
         if(_valdate.flag){
               //有效提交数据
               if(this.hreflag){
                 this.hreflag = false;//提交加锁防止重复提交数据
                 let _shipName = "";
                 let _macObj:object = {};
                 for(let i=0;i<this.licensePlate1.length;i++){
                     if(this.licensePlate1[i].barge_order_id == this.toppings1){
                         _shipName = this.licensePlate1[i].barge_cn
                     }
                 }
                 for(let i=0;i<this.licensePlate2.length;i++){
                      if(this.licensePlate2[i].mac_id == this.toppings2){
                         _macObj = this.licensePlate2[i]
                      }
                 }
                 //封装表单数据
                 let _data ={
                   revert_operate_id:this.revert_operate_id,
                   revert_id:this.revert_id,
                   revert_flag: this.revert_flag, 
                   shipName_id:this.toppings1,
                   shipName :_shipName,
                   quality:this.quality,
                   totalNumber:this.totalNumber,
                   contract_no:this.toppings3,
                   goodsName:this.goodsName,
                   number:this.number,
                   mac_id:this.toppings2,
                   ticket_id:this.item["m_id"],
                   macObj:_macObj,
                   json:{
                    toppings1:this.toppings1,//船名选中；
                    toppings2:this.toppings2,//合同号选中；
                    toppings3:this.toppings3,//车号选中；
                    licensePlate1:this.licensePlate1,//船名集合；
                    licensePlate2:this.licensePlate2,//合同号集合；
                    licensePlate3:this.licensePlate3,//车号集合；
                    quality:this.quality,//质量
                    totalNumber:this.quality,//总件数
                    number:this.number//件数
                   }
                 }
                 this.http4(_data).then(data=>{
                       if(data["msg"]=="保存成功！"){
                         // this.bookid = data["data"].bookId;
                         this.presentToast("保存成功");
                         this.revert_flag =" ";
                         this.number = 0;
                       }else{
                         this.presentToast("保存失败!");
                       }  
                       this.hreflag = true;            
                        }).catch(data=>{
                 })
               }else{
                this.presentToast("数据已提交，正在处理中...");
               }
         }else{
          this.presentToast(_valdate.Msg+"输入有误！");
         }
  }
  rollblackclick(item){
     this.http5({
      id: item.id
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
           for(let item of obj.licensePlate1){
             if(item.barge_order_id == obj.toppings1){
               this.licensePlate1 = [item];
               for(let _item of item.contractlist){
                   if(_item.contract_no == obj.toppings3){
                    this.licensePlate3 = [_item];
                    break;
                   }
               }
                break;
             }
           }
           
           this.licensePlate2 = obj.licensePlate2;
           //this.licensePlate3 = obj.licensePlate3;
           this.number = obj.number;
           this.quality = obj.quality;
           this.toppings1 = obj.toppings1;
           this.toppings2 = obj.toppings2;
           this.toppings3 = obj.toppings3;
           this.totalNumber = obj.totalNumber;
           this.revert_flag = "11";
           this.revert_id = data["data"].operate.rat_id
           this.revert_operate_id = data["data"].operate.id
         }
      }catch(e){
        console.log(e);
      }
       
    }).catch(data=>{

    })
  }
  rollblack(){
    this.navCtrl.push(DataRollbackListPage,{
      item: {oddnumbers : this.rollbacklicensePlate1,
             callback : this,
             m_id : this.item["m_id"],
             data:{rollbacklicensePlate1_2 : this.licensePlate1,
                   rollbacklicensePlate1_3 : this.licensePlate2
            },
             html:"RefutationPage"
            }
    }); 
    // this.fixed1 = false;
    // this.recombine();//调用数组重组；
    // if(this.scrollevents!=undefined){
    //   this.scrollevents["enable"](true);
    //   this.rolldata = [];
    // }
  }
  cancel(){
    this.fixed1 = true;
    this.rolldata = [];
  }
  search(){
     console.log("查询");
  }
  recombine(){//回退集合重组
    let _array = [{
      barge_cn: "请选择",
      barge_order_id: "00000000",
      contractlist:[{
        barge_order_id: "00000000",
      cargo_n: "0",
      contract_no: "请选择"}],
      load_counts: "0",
      load_weight: "0",
    }]
     this.rollbacklicensePlate1 = Object.assign([],this.licensePlate1);
     this.rollbacklicensePlate2 = Object.assign([],[{
      barge_order_id: "00000000",
      cargo_n: "0",
      contract_no: "请选择"
     }]);
     Array.prototype.push.apply(_array,this.rollbacklicensePlate1);
     this.rollbacklicensePlateActive1 = "00000000";
     this.rollbacklicensePlate1 = _array;
  }
  doInfinite(event){
    if(this.scrollevents==undefined){
      this.scrollevents = event;
    }
    this.page.page++;
    this.http6({ticket_id:this.item["m_id"],
                        ship_id:this.toppings1,
                        contract_no:this.toppings3,
                        pageBean: JSON.stringify(this.page)}).then(data=>{
                          if(data["ok"]){
                             let _data:pageBean = data["data"].pager;
                              this.rolldata = this.rolldata.concat(_data.rows);
                              if(_data.total>_data.page){
                                 event.complete();
                              }else{
                                this.presentToast("没有更多数据！");
                                 event.enable(false); 
                              }   
                          }else{
                            this.presentToast("没数据有误！");
                          }
                        }).catch(data=>{});
  }
  acceptData(){
    let loading = this.presentLoadingDefault();
    this.http2({book_id:this.item["m_id"],ticket_id:this.item["m_id"],loginid:lSe.getItem("userData").record.loginid}).then(data=>{
      loading();
      this.licensePlate1 = data["data"].ship.bargelist;//船名；
      this.toppings1 = data["data"].ship.bargelist[0].barge_order_id;
      this.licensePlate2 = data["data"].maclist;//车号；
      this.toppings2 = data["data"].maclist[0].mac_id;
      if(data["data"].ship.bargelist.length>0){
        this.licensePlate3 = data["data"].ship.bargelist[0].contractlist;//合同集合
        this.toppings3 = data["data"].ship.bargelist[0].contractlist[0].contract_no;
      }else{
        this.licensePlate3 = [{contract_no:"无合同号",cargo_n:"无货名"}];//合同集合
        this.toppings3  = "无货名";
        // this.toppings3 = data["data"].ship.bargelist[0].contractlist[0].contract_no;
      }
      
      
      this.quality = data["data"].ship.bargelist[0].load_weight;//质量
      this.totalNumber = data["data"].ship.bargelist[0].load_counts;//件数
      
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
  async http2(obj){//获取驳船列表
    return  await new Promise((resolve, reject) => {
       this.service.getQBBargeName(obj).then(
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
  async http4(obj){ //驳船提交数据
    return  await new Promise((resolve, reject) => {
      this.service.bargeInCommit(obj).then(
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

  async http5(obj){ //驳船数据回退
    return  await new Promise((resolve, reject) => {
      this.service.revertQiBo(obj).then(
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
  async http6(obj){ //驳船数据回退
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
  
  ionViewDidEnter(){
    super.BackButtonCustomHandler(); 
  }

  ionViewWillLeave() {
    super.ionViewWillLeave && super.ionViewWillLeave();
  
  }
}
