import { Component } from '@angular/core';
import { NavController ,NavParams ,ToastController ,LoadingController} from 'ionic-angular';
import { ListPage } from '../list/list';
import { Exception } from '../../service/exception';
import { ERROR } from '../../entity/error';
import { ServiceProvider } from '../../service/http';
import { pageBean } from '../../entity/pageBean';
import { lSe } from '../../public/localstorage';
import { registerBack } from "../../service/registerBack";

@Component({
  selector: 'page-mechanical',
  templateUrl: 'mechanical.html'
})
export class MechanicalPage extends registerBack {
  hreflag:boolean=true;//提交标记
  loading:any;//loadingobject
  stationNumber:string;//当前工号的编号；
  ionChange:any;
  checkedflag:boolean = false;//checked触发标记
  PAGE:string="mechanical.ts";//当前页面
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
              public loadingController:LoadingController) {
               super("/mechanical"); 
         try{//结构json数据 异常处理
            this.loading = this.presentLoadingDefault();
            this.navflag = false;
            this.item = this.navParams.get("item");
            this.securityBook = this.navParams.get("item").text;
            this.goodsName = this.navParams.get("item").cargo_n_text;
            this.shipName = this.navParams.get("item").ship_n_text;
            this.fixed = this.securityBook==""? false: true;
            this.stationNumber = lSe.getItem("userData").record.loginid;
            if(this.securityBook==""){
              console.log("请求数据");
              this.http2({book_id:this.item["m_id"],loginid:lSe.getItem("userData").record.loginid}).then(data=>{
                    console.log(data["data"].d_list);
                    this.loading();
                    this.stairlist = [{id:data["data"].d_list[0].sp_mac_num,flag:true}];//只会有会有一条数据；写死了
                    let _data1 = data["data"].d_list[0].cargo_sn//运输车号
                    let _array =  _data1.split(',');
                    let _array2 = [];
                    console.log(_array);
                    for(let item of _array){
                      _array2.push({id:item,flag:false});
                    }
                    console.log(_array2);
                    this.secondlevellist = _array2;
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
              console.log(11)
            }else{
              this.loading();
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
     // this.loading = this.presentLoadingDefault();
      this.service.safetyjop({loginid:this.item["loginid"],m_id:this.item["m_id"],update_read:1}).then(
        (obj:pageBean) =>{
            console.log(obj);
            _data = obj;
            if(obj["data"].is_read=="1"){
              console.log("请求数据");
              
              // this.http2({book_id:this.item["m_id"],loginid:lSe.getItem("userData").record.loginid}).then(data=>{
              //   console.log(data["data"].shiplist);
              //   this.licensePlate1 = data["data"].shiplist;//船名；
              //   this.toppings1 = data["data"].shiplist[0].id;
              //   this.licensePlate2 = data["data"].maclist;//车号；
              //   this.toppings2 = data["data"].maclist[0].mac_id;
              //   this.quality = data["data"].shiplist[0].cargo_wei;//质量
              //   this.totalNumber = data["data"].shiplist[0].numb;//件数
              //   this.loading();
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
    let _realityLis = [];//真实数组；
    let _virtualist = this.secondlevellist;//临时虚拟数据；
    if(this.secondlevellist.length==0){
      this.presentToast("无效数据，无法提交！");return;
    }else{
      let _flag = 0;
      for(let item of this.secondlevellist){
        if(item.flag){
          _realityLis.push(item.id);
          _flag++;
        }
        // if(_flag==0){
        //   this.presentToast("无效数据，无法提交！");return;
        // }
    }
    if(_realityLis.length<=0){
      this.presentToast("无效数据，无法提交！");return;
    }
    let data ={
      stairlist:this.stairlist,
      realityList:_realityLis,
      virtualist:_virtualist,
      book_id:this.item["m_id"],
      good_sname:this.goodsName,
      ship_name:this.shipName,
      op_id:this.op_id
    }
    console.log(_realityLis);
    let load = this.presentLoadingDefault("数据提交中...");
    this.http3(data).then(data=>{
       console.log(data);
       if(data["ok"]){
          load();
          this.presentToast("提交成功！");
          this.accept();
       }
    }).catch(data=>{

    })
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
  rollback(){
   
    this.http4({book_id:this.item["m_id"]}).then(data=>{
      let rat_id = data["data"].bean.rat_id;//rat_id
      //let json = JSON.parse(data["data"].bean.form_data).
      if(data["msg"]=="没有数据！"){
        this.presentToast(data["msg"]);
      }else{
        console.log(JSON.parse(data["data"].bean.form_data));
        this.stairlist = JSON.parse(data["data"].bean.form_data).stairlist;
        this.secondlevellist = JSON.parse(data["data"].bean.form_data).virtualist;
        this.shipName = JSON.parse(data["data"].bean.form_data).ship_name;
        this.goodsName = JSON.parse(data["data"].bean.form_data).good_sname;
        this.op_id = data["data"].bean.id;
      }
       
    }).catch(data=>{

    });
  }
  accept(){
    this.http2({book_id:this.item["m_id"],loginid:lSe.getItem("userData").record.loginid}).then(data=>{
          console.log(data["data"].d_list);
          this.loading();
          if(data["msg"]=="没有数据！"){
              this.presentToast(data["msg"]);
              this.stairlist = [];
              this.secondlevellist = [];
          }else{
         
          this.stairlist = [{id:data["data"].d_list[0].sp_mac_num,flag:true}];//只会有会有一条数据；写死了
          let _data1 = data["data"].d_list[0].cargo_sn//运输车号
          let _array =  _data1.split(',');
          let _array2 = [];
          console.log(_array);
          for(let item of _array){
            _array2.push({id:item,flag:false});
          }
          console.log(_array2);
          this.secondlevellist = _array2;
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
           console.log(obj);
         }
       );
     })
  }
  async http2(obj){//获取装载机页面数据
    return  await new Promise((resolve, reject) => {
       this.service.getZzdata(obj).then(
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
  
  async http3(obj){//装载机提交数据
    return  await new Promise((resolve, reject) => {
       this.service.sendZsend(obj).then(
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
  //getzzlast
  async http4(obj){//装载机数据回滚
    return  await new Promise((resolve, reject) => {
       this.service.getzzlast(obj).then(
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
  ionViewWillLeave(){
    super.ionViewWillLeave && super.ionViewWillLeave();
  }
}
