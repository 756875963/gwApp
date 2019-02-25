import { Component ,ViewChild } from '@angular/core';
import { ModalController ,NavController ,NavParams ,Platform ,Navbar ,ToastController ,Content ,AlertController ,Events ,LoadingController} from 'ionic-angular';
import { TallyingPage } from '../tallying/tallying';
import { DispatchedworkersPage } from '../dispatchedworkers/dispatchedworkers';
import { lSe } from '../../public/localstorage';
import { pageBean } from '../../entity/pageBean';
import { Task } from '../../entity/task';
import { ServiceProvider } from '../../service/http';
import { registerBack } from "../../service/registerBack";
import { SearchcomPage } from '../../pages/searchcom/searchcom';
import { PredictionPage} from '../../pages/addprediction/prediction';
import { PredictionDetails} from '../../pages/predictionDetails/predictionDetails';
import { promises } from 'fs';
import { dateDataSortValue } from 'ionic-angular/umd/util/datetime-util';
@Component({
  selector: 'page-consumerList',
  templateUrl: 'consumerList.html'
})

export class ConsumerListPage extends registerBack{
  @ViewChild(Navbar) navBar: Navbar;
  @ViewChild(Content) content : Content;
  amount:number = 0;//预报总数 
  fixed :String = "-1";//按钮状态
  detailsData :Object ={};//详情数据
  detailsFlag :boolean = true;//详情显示标记
  pageHttpFlag :boolean =true;//下拉请求标记
  httpFlag :Boolean = true; //重复请求标记
  page :pageBean={
    page: 1,//当前页
    pageSize : 10,//每页最大条数
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
  }={start_time:"",
     end_time:""};
  selectedItem: any;
  htmlListLenghtFlag:boolean=false;
  icons: string[];
  items: Array<{title: string, note: string, icon: string}>;
  modality: boolean = true;// 模态框显示标记
  callback;// pop方法事件订阅回调函数
  datalist: Array<any> =[];
  dataActive:any;//选中数据
  _event:any;
   constructor(public navCtrl :NavController, 
               public navParams :NavParams,
               public service :ServiceProvider,
               public toast :ToastController,
               public alertC :AlertController,
               public events :Events,
               public loadingController :LoadingController,
               public modalC :ModalController,
               private platform: Platform){
                 super("/consumerList");
                //  let loading = this.presentLoadingDefault();
                //     this.http({ page:1,rows:10}).then((data)=>{
                //       this.datalist = data["data"].booklist;
                //       if(!(data["data"].booklist.length>0))this.htmlListLenghtFlag = true;
                //       loading();
                //     });
                //     this.httpFlag = false;
                //     this.callback = this.navParams.get("callback");
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
  
  operation(event,data){ 
    this.fixed = data.id;
    this.detailsData =data;
    this.dataActive = data
   
  }
  //title 后退监听
  goBack(){
  //  let param = '我是来自Push的值'
  //  this.callback(param).then(()=>{
  //   this.navCtrl.pop();
  //  });
   this.navCtrl.pop().then(() => {
    // 发布 bevents事件
    this.events.publish('bevents', '我是B页面数据');
    });
  }
  edit(item,flag){
    let modal = this.modalC.create(PredictionPage,{item:{callback:this ,flag:1,data:item,flag_i:flag}});
    modal.present();
  }
  releaseFunc(item,index){// 发布预报
     this.service.publish({id:item.id}).then(_data=>{
      if(_data["ok"]){
       this.service.complete({task_id:_data["data"].task_id,check:1}).then(data=>{
            this.presentToast(data["msg"]);
            this.datalist[index].in_status = _data["data"].pBargeInfo.in_status;
       }).catch(data=>{

       })
      }else{
        this.presentToast(_data["msg"]);
      }
     }).catch(data=>{
      this.presentToast(data["msg"]);
         
     })
  }
  finish1(item,i){//作废预报
    this.service.finish1({
      barge_id:item.id
    }).then(data=>{
      if(data["ok"]){
        let in_status = data["data"].pBargeInfo.in_status;//当前状态
        this.datalist[i].in_status = in_status;
        if(data["ok"]){
          this.service.complete({task_id:data["data"].task_id,check:3}).then(_data=>{
              this.presentToast("作废预报成功");
          }).catch(data=>{
              this.presentToast("作废预报失败");
          })
         }else{
              this.presentToast("作废预报失败");
         }
      }else{
         this.presentToast("作废预报失败");
      }
       
    }).catch(data=>{
    })
  }
  submitConfirmation(item,i){ //提交确定
      this.service.submitConfirmation({id:item.id}).then(data=>{
        if(data["ok"]){
          let in_status = data["data"].pBargeInfo.in_status;//当前状态
          this.datalist[i].in_status = in_status;
        }
        this.presentToast(data["msg"]);
      }).catch(data=>{
      })
  }

  //界面加载完成 
  ionViewDidEnter(){ 
    let _resolve,_reject;
    super.BackButtonCustomHandler();
    this.service.getShipRecordList({pageBean:JSON.stringify({
      page: 1,//当前页
      pageSize : 10,//每页最大条数
      total : 0,//总页数
      records : 0,//总记录数
    }),search:JSON.stringify(this.search)}).then(data=>{
      _resolve("ok"); 
      if(data["ok"]){
          this.amount = data["data"].pager.records;
          this.datalist = data["data"].pager.rows;
          this.htmlListLenghtFlag = this.amount > 0 ?false: true;
       }else{
          this.presentToast(data["msg"]);
       }
    }).catch(data=>{
          this.presentToast(data["msg"]);
          _reject("no");
    })
    return new Promise((resolve,reject)=>{
          _resolve = resolve;
          _reject = reject;
    });
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
    let _that = this;
    this._event = event;
    if(this.pageHttpFlag){
       this.pageHttpFlag = false;
       this.service.getShipRecordList({pageBean:JSON.stringify({page:++this.page.page,pageSize:10}),search:JSON.stringify(this.search)}).then(
        (data:Task)=>{
          this.pageHttpFlag = true;
          if(data["data"].pager.rows.length>0){
            event.complete();
            this.datalist =this.datalist.concat(data["data"].pager.rows);
            delete data["data"].data.rows;  
          }else{
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
  detele(item,index){//删除预报
      this.service.deleteBargeInfo({id:item.id}).then(data=>{
        if(data["ok"]){
            this.datalist[index].in_status = data["data"].pBargeInfo;
            this.datalist.splice(index,1);
        }else{
            this.presentToast(data["msg"]);
        }
      }).catch(data=>{
        
      })
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
      console.log('Dismissed toast');
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
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            console.log(data);
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

  

  presentLoadingDefault(msg="数据加载中，请稍等！") { //统一加载处理css 效果组件；
      let loading = this.loadingController.create({
        content:msg
      });
      loading.present();
      return ()=>{loading.dismiss()};
  }

  Promise(){
    // let aa = new Promise((resolve,reject)=>{});
    // console.log(aa);
    let a:any;
    setTimeout(data=>{
      a('ok');
    },10000);
    return new Promise((resolve, reject) => {
        //console.log(this.user);
        a = resolve;
     });
  }

  searchClick(){//跳转查询页面
    console.log("跳转查询页面");
    this.navCtrl.push(SearchcomPage,{
      item: "1",callback:this
    });
  }

  // 用于pop 回调的 block
  myCallbackFunction1  =(params) => {
    this._event==undefined ? null:this._event.enable(true);
    this.search = params;
    this.service.getShipRecordList({pageBean:{page:1,rows:10},search:JSON.stringify(this.search)}).then(
      (data:Task)=>{
        if(data["data"].data.rowssd.length>0){
          this.datalist =this.datalist.concat(data["data"].data.rows);
          delete data["data"].data.rows;
          this.pageHttpFlag = true;
        }else{
          this.presentToast("没有更多数据！");
        }
      }
    ).catch(
      (data) =>{
      }
    );
    return new Promise((resolve, reject) => {
     if(typeof(params)!='undefined'){
         resolve('ok');
     }else{
         reject(Error('error'))
     }    
    });
  }

  href(){//跳转新增船泊页面
    let modal = this.modalC.create(PredictionPage,{item:{callback:this,flag:0,flag_i:false}});
    modal.present();
  }
  doRefresh(event){//上拉刷新
    this._event==undefined ? null:this._event.enable(true);
    this.ionViewDidEnter().then(data=>{
         event.complete();
    }).catch(data=>{
         event.complete();
    });
    
  }
  PredictionDetails(item){//跳转预报详情
    let modal = this.modalC.create(PredictionDetails,{item:{callback:this,date:item}});
    modal.present();
  }
  //任务列表请求
  async http(page,search){
    console.log(page,search);
    return  await new Promise((resolve, reject) => {
       this.service.getShipAppList({pageBean:JSON.stringify(page),search:JSON.stringify(search)}).then(
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
