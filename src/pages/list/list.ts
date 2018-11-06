import { Component ,ViewChild } from '@angular/core';
import { NavController ,NavParams ,Navbar ,ToastController ,Content ,AlertController ,Events ,LoadingController} from 'ionic-angular';
import { TallyingPage } from '../tallying/tallying';
import { DispatchedworkersPage } from '../dispatchedworkers/dispatchedworkers';
import { lSe } from '../../public/localstorage';
import { pageBean } from '../../entity/pageBean';
import { Task } from '../../entity/task';
import { ServiceProvider } from '../../service/http';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})

export class ListPage {
  @ViewChild(Navbar) navBar: Navbar;
  @ViewChild(Content) content : Content;
  fixed :String = "-1";//按钮状态
  detailsData :Object ={};//详情数据
  detailsFlag :boolean = true;//详情显示标记
  pageHttpFlag :boolean =true;//下拉请求标记
  httpFlag :Boolean = true; //重复请求标记
  page :pageBean={
    page: 1,//当前页
    pageSize : 0,//每页最大条数
    total : 0,//总页数
    records : 0,//总记录数
  };
  page2:{ //请求分页
    page:1,
    rows:10
  };
  selectedItem: any;
  htmlListLenghtFlag:boolean=false;
  icons: string[];
  items: Array<{title: string, note: string, icon: string}>;
  modality: boolean = true;// 模态框显示标记
  callback;// pop方法事件订阅回调函数
  datalist: Array<Task> =[];
  dataActive:any;//选中数据
   constructor(public navCtrl :NavController, 
               public navParams :NavParams,
               public service :ServiceProvider,
               public toast :ToastController,
               public alertC :AlertController,
               public events :Events,
               public loadingController :LoadingController){
                 let loading = this.presentLoadingDefault();
                    this.http({ page:1,rows:10}).then((data)=>{
                      this.datalist = data["data"].booklist;
                      if(!(data["data"].booklist.length>0))this.htmlListLenghtFlag = true;
                      loading();
                    });
                    this.httpFlag = false;
                    this.callback = this.navParams.get("callback");
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
  
  //界面加载完成 
  ionViewDidEnter(){ 
   
  }
   // 用于pop 回调的 block
   myCallbackFunction  =(params) => {
     if(params.Refresh){
        this.fixed = "-1";
        this.http({ page:1,rows:10}).then((data)=>{
            this.datalist = data["data"].booklist;
        });
     }
      return new Promise((resolve, reject) => {
      if(typeof(params)!='undefined'){
          resolve('ok');
      }else{
          reject(Error('error'))
      }    
      });
  }
  //下拉事件
  doInfinite(event){
    let _event = event;
    var _that = this;
    //event.complete();
    if(this.pageHttpFlag){
       this.pageHttpFlag = false;
       console.log(this.page.page);
       this.http({page:++this.page2.page,rows:10}).then(
        (data:Task)=>{
          if(data["data"].data.rows.length>0){
            this.datalist =this.datalist.concat(data["data"].data.rows);
            delete data["data"].data.rows;
            //this.page = data["data"];
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
      console.log('Dismissed toast');
    });
    toast.present();
  }
  //离开页面初始化参数
  ionViewWillLeave(){
    this.httpFlag = true;
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

  tapEvent(event){
   
  }

  presentLoadingDefault(msg="数据加载中，请稍等！") { //统一加载处理css 效果组件；

      let loading = this.loadingController.create({
        content:msg
      });
      loading.present();
      return ()=>{loading.dismiss()};
  }

  //任务列表请求
  async http(page){
    return  await new Promise((resolve, reject) => {
       this.service.Tasklist(page,1).then(
         (obj:pageBean) =>{
           // console.log("listjs",obj["data"].data.page);
           // this.page2={page:obj["data"].data.page,rows:10}
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
