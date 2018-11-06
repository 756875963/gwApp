import { Component ,ViewChild } from '@angular/core';
import { NavController ,NavParams ,Navbar ,Events ,LoadingController ,ToastController} from 'ionic-angular';
import { TallyingPage } from '../tallying/tallying';
import { DispatchedworkersPage } from '../dispatchedworkers/dispatchedworkers';
import { lSe } from '../../public/localstorage';
import { JobdescriptionPage } from '../../pages/jobdescription/jobdescription';//外理员页面；
import { JobdescriptionyardPage } from '../../pages/jobdescriptionyard/jobdescriptionyard';//库场员页面
import { JobdescriptionOutPage } from '../../pages/jobdescriptionOut/jobdescriptionOut';//木材车提出库页面
import { JobdescriptionInstallPage} from '../../pages/jobdescriptionInstall/jobdescriptionInstall';//落驳页面
import { RefutationPage } from '../refutation/refutation';//启驳页面
import { pageBean } from '../../entity/pageBean';
import { ServiceProvider } from '../../service/http';
import { Session } from '../../service/session';
import { Exception } from '../../service/exception';
import { ERROR } from '../../entity/error';
import { HeightDriverPage } from '../heightDriver/heightDriver';//水平司机
import { MechanicalPage } from '../mechanical/mechanical';//装载机司机

@Component({
  selector: 'page-jobList',
  templateUrl: 'jobList.html'
})
export class JobListPage {
  @ViewChild(Navbar) navBar: Navbar;
  loading:any;//loadingobject
  PAGE:string="jobList.ts";//当前页面
  lockhtml:Boolean = true; //页面锁
  text:String;
  menu_type:number;//菜单类型 1 2 3 4 5
  selectedItem: any;
  icons: string[];
  items: Array<{title: string, note: string, icon: string}>;
  modality: boolean = true;// 模态框显示标记
  callback;                // pop方法事件订阅回调函数
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
  htmlListLenghtFlag:boolean=false;
  datalist: Array<any> =[];
  //datalist :type 是判断跳转页面的标记 目前 1.外理货 2.库场员 3.木材车提出库 4.启驳
  dataActive:any={
    name1 : "",
    id : ""
  };//选中数据
  htmlmenuType:number;//页面页面类型
  constructor(public navCtrl:NavController,
              public navParams:NavParams,
              public events:Events,
              public service:ServiceProvider,
              public session:Session,
              public toastController:ToastController,
              public loadingController:LoadingController,
              public exception:Exception){
            // let promise = new Promise(function(resolve,reject){
            //     if(true){
            //       resolve("ok");
            //     }
            // });
              // Promise.try(promise).then().cacth();
              try{//结构json数据 异常处理
               
                this.callback = this.navParams.get("callback");
                // If we navigated to this page, we will have an item available as a nav param
                this.selectedItem = this.navParams.get('item');
                if(this.session.getRole().indexOf("外理理货员")>-1){
                   this.menu_type = 2;
                   this.htmlmenuType = 9;
                }else if(this.session.getRole().indexOf("理货员")>-1){
                   this.menu_type = 2;
                   this.htmlmenuType = 10;
                }else if(this.session.getRole()=="外理员"){
            
                }else if(this.session.getRole()=="水平司机"){
                   console.log("水平司机");
                   this.menu_type = 3;
                   this.htmlmenuType = 8;
                }else{
                  this.menu_type = 10;
                }
                //this.menu_type = 2;
                let dd = this.presentLoadingDefault();
                this.http({ page:1,rows:10}).then((data)=>{
                  dd();
                  this.datalist=data["data"].booklist;
                  this.htmlListLenghtFlag= 0<this.datalist.length?false:true;
                  console.log(this.datalist.length); 
                });
                //  console.log(navParams.get('item12'));
                // Let's populate this page with some filler content for funzies
                // this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
                // 'american-football', 'boat', 'bluetooth', 'build'];
            
                // this.items = [];
                // for (let i = 1; i < 11; i++) {
                //   this.items.push({
                //     title: 'Item ' + i,
                //     note: 'This is item #' + i,
                //     icon: this.icons[Math.floor(Math.random() * this.icons.length)]
                //   });
                // }
              }catch(e){
                    //返回 App json处理时发生出错时 处理逻辑；
                  this.presentToast("app处理数据错误，已提交后台！");
                  let obj:ERROR;
                  obj ={err_reason:e.toString(),err_page:this.PAGE,err_data:JSON.stringify({"constructor":"jobList.ts--constructor数据初始化出错！"}),loginid:lSe.getItem("userData").record.loginid};//错误
                  this.exception.errorhttp(obj);
              }
   
  }
  itemTapped(event, item) {
    //datalist :type 是判断跳转页面的标记 目前 1.外理货 2.库场员
    let page ;
    if(item.type == 1){
       page = TallyingPage;
    }else if(item.type == 2){
       page = JobdescriptionyardPage;
    }else{

    }
    this.navCtrl.push(page, {
      item: item
    });
  }
  Modality(event){
    this.modality = true;
    this.dataActive = {
      id:"",
      name1:""
    }
  }
  details(event){           //查看详情 
    event.stopPropagation();//阻止事件冒泡
  }
  jobMatching(event){       //跳转派工页面
    event.stopPropagation();//阻止事件冒泡
    this.modality = true;
    this.navCtrl.push(DispatchedworkersPage,{
      item: this.dataActive,callback:this.myCallbackFunction
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
  async operation(event,item){
    if(!this.lockhtml) return;
    this.lockhtml = false; //上锁
    //datalist :type 是判断跳转页面的标记 目前 1.外理货 2.库场员
    //var text1 = "";
    this.events.subscribe('custom-user-events', (params) => {
      // 接收B页面发布的数据
      console.log('接收数据为: '+ params);
      console.log(this.modality);
      // 取消订阅
      this.events.unsubscribe('bevents'); 
     })

    if(this.htmlmenuType == 9){
        this.http2({loginid:lSe.getItem("userData").record.loginid,m_id:item.id}).then((data)=>{
          console.log(data);
          this.lockhtml = true;//解锁
          this.navCtrl.push(JobdescriptionPage,{
            item: {m_id:item.id,loginid:lSe.getItem("userData").record.loginid,text:data["text"]}
          });
        
        });
    }else if(this.htmlmenuType == 10){
      if(item.work_type_text=="汽车作业"&&item.cargo_nt_text=="木材"){
        this.http2({loginid:lSe.getItem("userData").record.loginid,m_id:item.id}).then((data)=>{
          console.log(data);
          this.lockhtml = true;//解锁
          this.navCtrl.push(JobdescriptionOutPage,{
            item: {m_id:item.id,loginid:lSe.getItem("userData").record.loginid,text:data["text"]} 
          });
        });
       
        this.lockhtml = true;//解锁
      }else if(item.work_type_text=="内河作业"){
       // &&item.cargo_nt_text=="木材"
        if(item.load_unload_text=="卸"){//启驳
          this.http2({loginid:lSe.getItem("userData").record.loginid,m_id:item.id}).then((data)=>{
            console.log(data);
            this.navCtrl.push(RefutationPage,{
              item: {m_id:item.id,loginid:lSe.getItem("userData").record.loginid,text:data["text"]} 
            });
          });
        }else if(item.load_unload_text=="装"){//落驳
           if(item.cargo_nt_text=="木材"){
               console.log("落驳");
               this.http2({loginid:lSe.getItem("userData").record.loginid,m_id:item.id}).then((data)=>{
                  this.navCtrl.push(JobdescriptionInstallPage,{
                    item: {m_id:item.id,loginid:lSe.getItem("userData").record.loginid,text:data["text"]} 
                  });
               });
           }else{
               this.presentToast(item.cargo_nt_text+"无法落驳操作！");
           }
        }
        
        this.lockhtml = true;//解锁
      }else{
        this.http2({loginid:lSe.getItem("userData").record.loginid,m_id:item.id}).then((data)=>{
          console.log(data);
          this.lockhtml = true;//解锁
          this.navCtrl.push(JobdescriptionyardPage,{
            item: {m_id:item.id,loginid:lSe.getItem("userData").record.loginid,text:data["text"]}
          });
        });
      }
      
    }else if(this.htmlmenuType == 8){
      console.log("水平司机");
      this.http2({loginid:lSe.getItem("userData").record.loginid,m_id:item.id}).then((data)=>{
        console.log(data);
        this.lockhtml = true;//解锁
        //11.5 零时修改的 MechanicalPage  装载机   HeightDriverPage 水平司机
        this.navCtrl.push(MechanicalPage,{
          item: {m_id:item.id,loginid:lSe.getItem("userData").record.loginid,text:data["text"]}
        });
      });
    }else if(item.type == 3){
      this.navCtrl.push(JobdescriptionOutPage, {
        item: item
      });
    }else if(item.type == 4){
       this.navCtrl.push(RefutationPage,{
         item: item
       });
    }
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad PagePushedPage');
  }
  
  goBack(){
    console.log("45454");
   let param = '我是来自Push的值'
   this.callback(param).then(()=>{
    this.navCtrl.pop();
   });
  }
  presentLoadingDefault(msg="数据加载中，请稍等！") { //统一加载处理css 效果组件；

    let loading = this.loadingController.create({
      content:msg
    });
   loading.present();
  return ()=>{loading.dismiss()};
   
  }
  
  //界面加载完成 
  ionViewDidEnter(){ 
    this.navBar.backButtonClick=(e: UIEvent)=>{ 
      console.log("45454");
      let param = '我是来自Push的值1'
      this.callback(param).then(()=>{
       this.navCtrl.pop();
      }).catch((e:UIEvent)=>{
        console.log(e);
      });
    } 
  }
   // 用于pop 回调的 block
   myCallbackFunction  =(params) => {
    return new Promise((resolve, reject) => {
     if(typeof(params)!='undefined'){
       //console.log(this.user);
         resolve('ok');
         console.log('回调1: '+ params);
     }else{
         reject(Error('error'))
     }    
    });
  }
  //下面是拨离出来的http的请求；低耦合 为了实现连续的逻辑调用 不直接放在业务逻辑中；
  //任务列表请求
  async http(page){
    return  await new Promise((resolve, reject) => {
      console.log("类型",this.menu_type)
       this.service.Tasklist(page,this.menu_type).then(
         (obj:pageBean) =>{
          // console.log("listjs",obj["data"].data.page);
           //this.page2={page:obj["data"].data.page,rows:10}
           resolve(obj);
         }
       ).catch(
         obj=>{
           console.log(obj);
         }
       );
     })
  }
  async http2(obj){
    return await new Promise((resolve, reject) => {
      this.service.safetyjop(obj).then(
        (obj:pageBean) =>{
        // console.log("listjs",obj["data"].data.page);
          //this.page2={page:obj["data"].data.page,rows:10}
          console.log(obj);
          if(obj["data"]["is_read"]=='0'){
            console.log(obj["data"]["is_read"]);
            console.log(obj["data"]["work_require"]);
            resolve({text:obj["data"]["work_require"]});
          }else{
            resolve({text:""});
          }  
        }
      ).catch(
        obj=>{
          console.log(obj);
        }
      );
      })
  }
 
}
