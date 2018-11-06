import { Component ,ViewChild } from '@angular/core';
import { NavController ,NavParams ,Navbar ,ToastController ,Content ,AlertController ,Events ,LoadingController ,Platform} from 'ionic-angular';
import { TallyingPage } from '../tallying/tallying';
import { DispatchedworkersPage } from '../dispatchedworkers/dispatchedworkers';
import { lSe } from '../../public/localstorage';
import { pageBean } from '../../entity/pageBean';
import { Task } from '../../entity/task';
import { ServiceProvider } from '../../service/http';
import { WorkclassPage } from '../../pages/workclass/workclass';

declare var screen :any;     //定义全局变量
@Component({
  selector: 'page-statisticslist',
  templateUrl: 'statisticslist.html'
})

export class StatisticslistPage {
  
  @ViewChild(Navbar) navBar: Navbar;
  @ViewChild(Content) content : Content;
  worktype:String;//作业类型
  dateTime:String;//日期时间
  maintitle:String;//title标题
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
  icons: string[];
  items: Array<{title: string, note: string, icon: string}>;
  modality: boolean = true;// 模态框显示标记
  callback;                // pop方法事件订阅回调函数
  datalist: Array<Task> =[  //mock数据
    // {id:"1",name1:"jd7891",name2:"船1",name3:"010",name4:"和谐1",name5:"木材1",name6:"装"},
    // {id:"2",name1:"jd7892",name2:"船2",name3:"011",name4:"和谐2",name5:"木材2",name6:"装"},
    // {id:"3",name1:"jd7893",name2:"船3",name3:"012",name4:"和谐3",name5:"木材3",name6:"装"},
    // {id:"4",name1:"jd7894",name2:"船4",name3:"013",name4:"和谐4",name5:"木材4",name6:"装"},
    // {id:"5",name1:"jd7895",name2:"船5",name3:"014",name4:"和谐5",name5:"木材5",name6:"装"},
    // {id:"6",name1:"jd7896",name2:"船6",name3:"015",name4:"和谐6",name5:"木材6",name6:"装"},
    // {id:"7",name1:"jd7897",name2:"船7",name3:"016",name4:"和谐7",name5:"木材7",name6:"装"},
    // {id:"8",name1:"jd7898",name2:"船8",name3:"017",name4:"和谐8",name5:"木材8",name6:"装"},
    // {id:"9",name1:"jd7899",name2:"船9",name3:"018",name4:"和谐9",name5:"木材9",name6:"装"},
    // {id:"10",name1:"jd7801",name2:"船10",name3:"019",name4:"和谐10",name5:"木材10",name6:"装"},
  ];
  dataActive:any;//选中数据
   constructor(public navCtrl :NavController, 
               public navParams :NavParams,
               public service :ServiceProvider,
               public toast :ToastController,
               public alertC :AlertController,
               public events :Events,
               public loadingC :LoadingController,
               public platform :Platform) {
                platform.ready().then(() => {
                  // Okay, so the platform is ready and our plugins are available.
                  // Here you can do any higher level native things you might need.
                 
                 alert(screen.availWidth);
                  //screen.orientation.lock('landscape-primary');
                 
                });
    this.http({ page:1,rows:10}).then((data)=>{
      console.log( "ddd",data); 
      this.datalist = data["data"]["data"].rows;
      delete data["data"].list;
      this.page = data["data"];
      console.log( data["data"]["data"].rows);
    });
    this.httpFlag = false;
    this.callback = this.navParams.get("callback");
    this.maintitle = this.navParams.get("flagText");
    this.dateTime = this.getTime();
    this.worktype = "0";
    console.log(this.getTime());
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
    console.log(this.detailsData);
  }
  jobMatching(event,dataActive){       //跳转派工页面
    event.stopPropagation();//阻止事件冒泡
    console.log(dataActive);
    this.modality = true;
    this.navCtrl.push(DispatchedworkersPage,{
      item: this.dataActive,callback:this.myCallbackFunction
    });
  }
  operation(event,data){ 
    // console.log(data.id);
    // this.fixed = data.id;
    // this.detailsData =data;
    // this.dataActive = data
    console.log("跳转");

    if(this.maintitle=="整船统计"){
      this.navCtrl.push(WorkclassPage,{item:"整船统计"});
    }else{
      this.navCtrl.push(WorkclassPage,{item:"工班统计"});
    }
  }
  //title 后退监听
  goBack(){
    console.log("45454");
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
    console.log("进入");
    // if(this.httpFlag){
    //   console.log("dddd");
    //   this.content.scrollToTop();
    //    this.http({}).then((data)=>{
    //      console.log(data);
    //      this.datalist = data["data"]["list"];
    //      this.page = data["data"];
       
    //    });;
    // }
  }
   // 用于pop 回调的 block
   myCallbackFunction  =(params) => {
     console.log(params);
     if(params.Refresh){
        this.fixed = "-1";
        this.http({ page:1,rows:10}).then((data)=>{
            this.datalist = data["data"]["data"].rows;
            delete data["data"].list;
            this.page = data["data"];
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
          console.log(data["data"].data.rows);
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
         console.log(data);
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
    console.log(event);
  }
  presentLoadingDefault() {
    let loading = this.loadingC.create({
      content: 'Please wait...'
    });
    loading.present();
    return loading;
    // setTimeout(() => {
    //   loading.dismiss();
    // }, 5000);
  }
  getTime(){
    var time = new Date();
    var y = this.zeroBu(time.getFullYear());//年
    var m = this.zeroBu(time.getMonth() + 1);//月
    var d = this.zeroBu(time.getDate());//日
    var h = this.zeroBu( time.getHours());//时
    var mm = this.zeroBu( time.getMinutes());//分
    var s =  this.zeroBu(time.getSeconds());//秒
    var times=y+"-"+m+"-"+d;
    return times;

  }
  zeroBu(n){
    if(n<10){
      return '0'+n;
    }else{
        return n
    }
  }
  //下面是拨离出来的http的请求；低耦合 为了实现连续的逻辑调用 不直接放在业务逻辑中；
  //任务列表请求
  async http(page){
    return  await new Promise((resolve, reject) => {
       this.service.Tasklist(page,1).then(
         (obj:pageBean) =>{
           console.log("listjs",obj["data"].data.page);
           this.page2={page:obj["data"].data.page,rows:10}
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
