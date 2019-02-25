import { Component } from '@angular/core';
import { NavController ,NavParams ,ToastController ,LoadingController ,AlertController} from 'ionic-angular';
import { ListPage } from '../list/list';
import { Exception } from '../../service/exception';
import { ERROR } from '../../entity/error';
import { ServiceProvider } from '../../service/http';
import { pageBean } from '../../entity/pageBean';
import { lSe } from '../../public/localstorage';
import { registerBack } from "../../service/registerBack";



@Component({
  selector: 'page-heightDriver',
  templateUrl: 'heightDriver.html'
})
export class HeightDriverPage extends registerBack{
  
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
  toppings3:String = "";
  licensePlate3:Array<any>;//装载机数组；
  securityBook :String;
  stairlist:Array<any>=[];//分票数组；
  secondlevellist:Array<any>=[];//连续编号数组；
  op_id:string ="";//id
  constructor(public navCtrl : NavController,
              public navParams : NavParams,
              public service : ServiceProvider,
              public toastController : ToastController,
              public exception :Exception,
              public loadingController:LoadingController,
              private alertCtrl: AlertController) {
               super("/heightDriver");
         try{//结构json数据 异常处理
            //this.loading = this.presentLoadingDefault();
            this.navflag = false;
            this.item = this.navParams.get("item");
            this.securityBook = this.navParams.get("item").text;
            this.fixed = this.securityBook==""? false: true;
            this.stationNumber = lSe.getItem("userData").record.loginid;
            console.log(this.item["m_id"]);
            if(this.securityBook==""){
              console.log("请求数据");
              this.http2({book_id:this.item["m_id"],loginid:lSe.getItem("userData").record.loginid}).then(data=>{
                    console.log(data);
                  //   if(data["msg"]=="没有数据！"){
                  //     this.presentConfirm(data["msg"],data=>{
                  //       console.log(data);
                  //       this.navCtrl.pop();
                  //     });
                  // }
                    //  this.shipName = data["data"].kRationale.ship_name;
                    //  this.goodsName = data["data"].kRationale.cargo_name;
                    //  this.licensePlate3 = data["data"].mac_list;//装载机数组
                    //  this.toppings3 = data["data"].mac_list[0].driver_n_text;
                    //  let _array =  this.destruction_array(data["data"].detail_list);
                    //  _array[0].flag = true;
                    //  this.stairlist  = _array;
                    //  this.secondlevellist = _array[0].listdata;
              }).catch(data=>{

              })
            }else{
             // this.loading();
            }
          }catch(e){
            //返回 App json处理时发生出错时 处理逻辑；
            this.presentToast("app处理数据错误，已提交后台！");
            let obj:ERROR;
            obj ={err_reason:e.toString(),err_page:this.PAGE,err_data:JSON.stringify({"constructor":"refutation.ts--constructor数据初始化出错！"}),loginid:lSe.getItem("userData").record.loginid};//错误
            this.exception.errorhttp(obj);
            }
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
      this.loading = this.presentLoadingDefault();
      this.service.safetyjop({loginid:this.item["loginid"],m_id:this.item["m_id"],update_read:1}).then(
        (obj:pageBean) =>{
            console.log(obj);
            _data = obj;
            if(obj["data"].is_read=="1"){
              console.log("请求数据");
              this.loading();
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
          console.log("提交数据",this.secondlevellist);
          let _realityList:Array<any> = [];//实际分票号数组
          let _virtualist:Array<any> = [];//虚拟数据
          let _id:number = 0;//分票号id
          let _mac_id:String ="";//装载机id
          //_driver_n_text = this.toppings3;
          if(this.secondlevellist.length==0){
              this.presentToast("提交数据有误！");
          }else{
            for(let obj of this.secondlevellist){
              if(obj.flag){
                _realityList.push(parseInt(obj.id));
              }
          }
          for(let obj of this.stairlist){
              if(obj.flag){
                 _id = obj.id;
                 break;
              }
          }
         
          for(let obj of this.licensePlate3){
              if(this.toppings3==obj.driver_n_text){
                 _mac_id = obj.mac_id;
                 break;
              }
          }
          _virtualist = this.stairlist;
          let form_data ={
            realityList:_realityList,
            virtualist:_virtualist,
            id:_id,
            mac_id:_mac_id,
            book_id:this.item["m_id"],
            mac_name:this.toppings3,
            op_id:this.op_id
          }
          // console.log(_id,this.toppings3);
          // console.log(_realityList.sort((a,b)=>{return a-b}));
          // console.log(_realityList);
          if(_realityList.length>0){
            let loading = this.presentLoadingDefault("数据处理中...");
            this.http4(form_data).then(data=>{
                  console.log(data);
                  this.op_id ="";
                  loading();
                  this.presentToast("数据提交成功！");
                  this.accept();
            }).catch(data=>{

            })
          }else{
            this.presentToast("连续编号未选择！");
          }
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
 
  rollback(){//数据回退
       this.http5({book_id:this.item["m_id"]}).then(data=>{
           try{
             this.op_id = data["data"]["bean"].id;
             let _array =  JSON.parse(data["data"]["bean"].form_data);//分票列表；
             this.goodsName = data["data"].kRationale.cargo_name
             this.shipName =  data["data"].kRationale.ship_name
             this.stairlist = _array.virtualist; 
             this.licensePlate3 = data["data"]["mac_list"];//装载机
             this.toppings3 = _array.mac_name;//装载机司机；
             for(let item of this.stairlist){
               if(item.flag){
                this.secondlevellist = item.listdata;//连续编号数组；
                break;
               }
             }
             
             console.log(_array);
           }catch(e){
                //返回 App json处理时发生出错时 处理逻辑；
            this.presentToast("app处理数据错误，已提交后台！");
            let obj:ERROR;
            obj ={err_reason:e.toString(),err_page:this.PAGE,err_data:JSON.stringify({"constructor":"heightDriver.ts--constructor数据初始化出错！"}),loginid:lSe.getItem("userData").record.loginid};//错误
            this.exception.errorhttp(obj);
           }
       }).catch(data=>{
           console.log(data);
       });
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
    this.http2({book_id:this.item["m_id"],loginid:lSe.getItem("userData").record.loginid}).then(data=>{
          console.log(data);
          if(data["msg"]=="没有数据！"){
              this.presentConfirm(data["msg"],data=>{
                console.log(data);
                this.navCtrl.pop();
              });
          }
          this.shipName = data["data"].kRationale.ship_name;
          this.goodsName = data["data"].kRationale.cargo_name;
          this.licensePlate3 = data["data"].mac_list;//装载机数组
          this.toppings3 = data["data"].mac_list[0].driver_n_text;
          let _array =  this.destruction_array(data["data"].detail_list);
          _array[0].flag = true;
          this.stairlist  = _array;
          this.secondlevellist = _array[0].listdata;
          this.loading();
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
       this.service.getspdataById(obj).then(
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
       this.service.sendSpsend(obj).then(
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
  async http5(obj){//数据数据
    return  await new Promise((resolve, reject) => {
       this.service.getsplast(obj).then(
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
    // Unregister the custom back button action for this page
    super.ionViewWillLeave && super.ionViewWillLeave();
  }
}
  