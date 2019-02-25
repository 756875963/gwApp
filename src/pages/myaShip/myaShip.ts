import { Component ,ViewChild } from '@angular/core';
import { ModalController ,NavController ,NavParams ,Navbar ,ToastController ,Content ,AlertController ,Events ,LoadingController} from 'ionic-angular';
import { TallyingPage } from '../tallying/tallying';
import { DispatchedworkersPage } from '../dispatchedworkers/dispatchedworkers';
import { lSe } from '../../public/localstorage';
import { pageBean } from '../../entity/pageBean';
import { Task } from '../../entity/task';
import { ServiceProvider } from '../../service/http';
import { registerBack } from "../../service/registerBack";
import { SearchcomPage } from '../../pages/searchcom/searchcom';
import { PredictionPage} from '../../pages/addprediction/prediction';
import { AddmyAShipPage } from '../../pages/addmyAShip/addmyAShip';
import { returnReslut } from '../../entity/returnReslut';
import { validate } from '../../service/validate';
@Component({
  selector: 'page-myaShip',
  templateUrl: 'myaShip.html'
})

export class MyaShipPage extends registerBack{
  @ViewChild(Navbar) navBar: Navbar;
  @ViewChild(Content) content : Content;
  validate = validate;
  predictionId:"";
  ship_name:"";
  fixed :String = "-1";//按钮状态
  detailsData :Object ={};//详情数据
  detailsFlag :boolean = true;//详情显示标记
  pageHttpFlag :boolean =true;//下拉请求标记
  httpFlag :Boolean = true; //重复请求标记
  page :pageBean={
    page: 1,//当前页
    pageSize:0,//每页最大条数
    total : 0,//总页数
    records : 0,//总记录数
  };
  page2:{ //请求分页
    page:1,
    rows:10
  };
  search:{ //时间查询对象
    start_time:string,//开始时间
    end_time:string//结束时间
  }={start_time:null,
     end_time:null};
  selectedItem: any;
  htmlListLenghtFlag:boolean=false;
  icons: string[];
  items: Array<{title: string, note: string, icon: string}>;
  modality: boolean = true;// 模态框显示标记
  callback;// pop方法事件订阅回调函数
  datalist: Array<any> =[];
  dataActive:any;//选中数据
  prediction_num:string;//预报id
  pageEvent:any;
  rep_ti:string;
   constructor(public navCtrl :NavController, 
               public navParams :NavParams,
               public service :ServiceProvider,
               public toast :ToastController,
               public alertC :AlertController,
               public events :Events,
               public loadingController :LoadingController,
               public modalC :ModalController){
                 super("/consumerList");
                 debugger;
                 this.prediction_num = this.navParams.get("item");
                 this.rep_ti = this.navParams.get("rep_ti").replace(/(^\s*)|(\s*$)/g,'');
                 this.callback = this.navParams.get("callback");
                 this.predictionId = this.navParams.get("callback").prediction.id;
                 //请求船舶列表
                 this.http({page:1,pageSize:10,total:0,records:0},
                           {barge_id:this.predictionId,ship_name:"",order:"order",rep_ti:this.rep_ti}).then(data=>{
                            if(Boolean(data["ok"])){
                             // console.log(this.arryStringForObject(data["data"].pager.rows));
                              this.datalist = this.arryStringForObject(data["data"].pager.rows);
                              delete data["data"].pager.rows;
                              data["data"].pager.pageSize  = 10;
                              this.page = data["data"].pager;
                            }else{

                            }
                 }).catch(data=>{

                 })
  }
  
  Modality(event){
    this.modality = true;
    this.dataActive = {}
  }

  details(event){           //查看详情 
    event.stopPropagation();//阻止事件冒泡
    //this.showAlert();
    this.detailsFlag = false;
    this.modality = true;
  }

  jobMatching(event,dataActive){       //跳转派工页面
    event.stopPropagation();//阻止事件冒泡
   
    this.modality = true;
    this.navCtrl.push(DispatchedworkersPage,{
      item: this.dataActive,callback:this.myCallbackFunction
    });
  }

  // operation(event,data){ 
  //   this.fixed = data.id;
  //   this.detailsData =data;
  //   this.dataActive = data
   
  // }
  //title 后退监听
 
  
  //界面加载完成 
  ionViewDidEnter(){ 
    super.BackButtonCustomHandler();
  }
   // 用于pop 回调的 block
   myCallbackFunction  =(params) => {
     if(params.Refresh){
        this.fixed = "-1";
        this.http({ page:1,rows:10},this.search).then((data)=>{
            this.datalist = data["data"].booklist;
        });
     }
      return new Promise((resolve, reject) => {
      if(typeof(params)!='undefined'){
          resolve('ok');
      }else{
          reject(Error('error'));
      }    
      });
  }
  
  //下拉事件
  doInfinite(event){
    let _event = event;
    var _that = this;
    this.pageEvent = _event;
    if(this.pageHttpFlag){
       this.pageHttpFlag = false;
       this.page.page++;
       this.http(this.page,{barge_id:this.predictionId,ship_name:"",order:"",rep_ti:this.rep_ti}).then(
        (data)=>{
          if(data["data"].pager.rows.length>0){
            this.datalist =this.datalist.concat(data["data"].pager.rows);
            delete data["data"].pager.rows;
            data["data"].pager.pageSize  = 10;
            this.page = data["data"].pager;
            event.complete();
            this.pageHttpFlag = true;
          }else{
            event.complete();
            _that.presentToast("没有更多数据！");
            event.enable(false);   
          }
        }
      ).catch(
        (data) =>{
        }
      );
    }
  }
  
  //吐司
  presentToast(message) {
    let toast = this.toast.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      cssClass:"margin25"
    });
    toast.onDidDismiss(() => {

    });
    toast.present();
  }
  //离开页面初始化参数
  ionViewWillLeave(){
    this.httpFlag = true;
    super.ionViewWillLeave && super.ionViewWillLeave();
  }
  //提示数据
  showAlert(){ 
    let alert = this.alertC.create({
      title: 'Login',
      message: "Enter a name for this new album you're so keen on adding",
      inputs: [
        {
          name: 'title',
          placeholder: 'Title'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
           
          }
        },
        {
          text: 'Save',
          handler: data => {
        
          }
        }
      ]
    });
    alert.present();
  }
  close_mode(){
    this.detailsFlag = true;
    document.getElementById("topest").scrollIntoView();
  }

  tapEvent(event){
   
  }

  presentLoadingDefault(msg="数据加载中，请稍等！") { //统一加载处理css 效果组件；

      let loading = this.loadingController.create({
        content:msg
      });
      loading.present();
      return ()=>{loading.dismiss()};
  }


  searchClick(){//跳转查询页面
    this.navCtrl.push(SearchcomPage,{
      item: "1",callback:this
    });
  }
  // 用于pop 回调的 block
  myCallbackFunction1  =(params) => {
    this.search = params;
    this.http({page:1,rows:10},this.search).then(data=>{
    }).catch(data=>{
      
    })
    return new Promise((resolve, reject) => {
     if(typeof(params)!='undefined'){
       //console.log(this.user);
         resolve('ok');
         console.log('回调1: '+ params.start_time);
     }else{
         reject(Error('error'))
     }    
    });
  }
  operation(flag,item,index){
    if(!flag){
      let alert = this.alertC.create({
        title: '操作提示',
        message: '你确定移除该预报的船舶吗？',
        buttons: [
          {
            text: '取消',
            role: 'cancel',
            handler: () => {
             
            }
          },
          {
            text: '确定',
            handler: () => {
              
              this.http1({barge_id:this.predictionId,
                ship_id:item.id,
                ship_wei:item.cargo_wei,
                flag:flag}).then(data=>{
            if(data["ok"]&&data["msg"]=="移除成功"){
                this.datalist[index].flag = 0;
                this.datalist[index].cargo_wei =0;
                 //初始化时间段
                 let _dateStr = data["data"].bargeship.rep;
                 if(_dateStr==null||_dateStr==""){
                    this.datalist[index].rep_ti = [];
                 }else{
                    this.datalist[index].rep_ti = _dateStr.indexOf(',')>=0? _dateStr.split(','):[String(_dateStr)];
                 }

            }
            this.presentToast(data["msg"]);
    }).catch(data=>{

    });
            }
          }
        ]
      });
      alert.present();
    }else{
     
        let alert = this.alertC.create({
          title: '货物重量(单位:吨)',
          inputs: [
            {
              name: 'cargo_wei',
              placeholder: '请输入货物重量',
              value:item.cargo_wei,
              type:"number"
            }
          ],
          buttons: [
            {
              text: '取消',
              role: 'cancel',
              handler: data => {
                
              }
            },
            {
              text: '确定',
              handler: data => {
                let _data = data;
        
          if(parseFloat(data.cargo_wei)>0){
                this.http1({barge_id:this.predictionId,
                            ship_id:item.id,
                            ship_wei:data.cargo_wei,
                            flag:flag,rep_ti:this.rep_ti}).then(data=>{
                        if(data["ok"]&&data["msg"]=="保存成功！"){
                            this.datalist[index].flag = 1;
                            this.datalist[index].cargo_wei = _data.cargo_wei;
                            //初始化时间段
                            let _dateStr = data["data"].bargeship.rep;
                            if(_dateStr==null||_dateStr==""){
                              this.datalist[index].rep_ti = [];
                              //加入成功回填
                              this.datalist[index].barge_id = data["data"].pBargeShip.barge_id;
                            }else{
                              this.datalist[index].rep_ti = _dateStr.indexOf(',')>=0? _dateStr.split(','):[String(_dateStr)];
                            }

                        }
                        this.presentToast(data["msg"]);
                }).catch(data=>{

                });}else{
                  this.presentToast("货物重量输入有误！");
                }
              }
            }
          ]
        });
        alert.present();
      }
    
    
  }
  
  href(){//跳转新增船泊页面
    let modal = this.modalC.create(AddmyAShipPage,{item: "1",callback:this});
    modal.present();
    // this.navCtrl.push(PredictionPage,{
    //   item: "1",callback:this
    // });
  }
  doRefresh(event){//上拉刷新
    this.http({page:1,pageSize:10,total:0,records:0},
      {barge_id:this.predictionId,ship_name:"",order:"order",rep_ti:this.rep_ti}).then(
      (data)=>{
        event.complete();
        if(data["data"].pager.rows.length>0){
          this.datalist = this.arryStringForObject(data["data"].pager.rows);
         // this.datalist = data["data"].pager.rows;
          delete data["data"].pager.rows;
          data["data"].pager.pageSize  = 10;
          this.page = data["data"].pager;
          this.pageEvent.complete();
          this.pageHttpFlag = true;
          this.pageEvent.enable(true); 
        }else{
          this.pageEvent.complete();
          this.presentToast("没有更多数据！");
          this.pageEvent.enable(false);   
        }
      }
    ).catch(
      (data) =>{
      }
    );
   // setTimeout(data=>{event.complete()},2000);
  }
  goback(){
    this.http({page:1,pageSize:100,total:0,records:0},
      {barge_id:this.predictionId,ship_name:"",order:"order"}).then(
      (data)=>{
        let _array = [];
        if(data["ok"]){
          if(data["data"].pager.rows.length>0){
            for(let item of data["data"].pager.rows){
              if(item.flag!=0){
               _array.push(item);                
              }else{
                break;
              }
            }
          }
        }
        this.callback.shipcallback(_array);
        this.navCtrl.pop(); 
      }
    ).catch(
      (data) =>{
      }
    );
   
  }
  arryStringForObject(data:Array<any>){ //String to Object
    
       for(let i=0;i<data.length;i++){
          if(data[i].rep_ti==null||data[i].req_ti==""){
               data[i].rep_ti = [];
          }else{
               data[i].rep_ti = data[i].rep_ti.indexOf(',')>=0? data[i].rep_ti.split(','):[String(data[i].rep_ti)];
          }
       }
       return data;
  }
  //船舶列表请求
  async http(page,search){
    return  await new Promise((resolve, reject) => {
       this.service.getShipAppList({pageBean:JSON.stringify(page),search:JSON.stringify(search)}).then(
         (obj:pageBean) =>{
           resolve(obj);
         }
       ).catch(
         obj=>{
           
         }
       );
     })
 }
 //绑定船舶和预报的关系 confirmNum
  async http1(search){
    return  await new Promise((resolve, reject) => {
      this.service.confirmNum({search:JSON.stringify(search)}).then(
        (obj:pageBean) =>{
          resolve(obj);
        }
      ).catch(
        obj=>{
          
        }
      );
    })
  }

}
