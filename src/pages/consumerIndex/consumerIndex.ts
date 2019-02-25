import { Component, ViewChild } from '@angular/core';
import { NavController, Events, Nav, ToastController ,Platform} from 'ionic-angular';
import { LoginPage } from '../login/login';
import { postUrl, getUrl, imgUrl, defaultHeadPorait } from '../../public/api';
import { Userobj } from '../../entity/user';
import { lSe } from '../../public/localstorage';
import { UpdatepasswordPage } from '../updatepassword/updatepassword';
import { SettingsProvider } from '../../providers/settings/settings';
import { Vibration } from '@ionic-native/vibration';
import { WorkclassPage } from '../workclass/workclass';
import { JPush } from '@jiguang-ionic/jpush';
import { Device } from '@ionic-native/device';
import { ServiceProvider } from '../../service/http';
import { Exception } from '../../service/exception';
import { ERROR } from '../../entity/error';
import { TemplateParseError } from '@angular/compiler';
import { direction } from '../../service/screen';
import { registerBack } from "../../service/registerBack";
import { ConsumerListPage } from '../consumerList/consumerList';//预报
import { PersonSearchPage } from '../personSearch/personSearch';//通讯录
import { LineUpPage } from '../lineUp/lineUp';//排队
import { DomSanitizer } from '@angular/platform-browser';//引入
import { MyMenuPage } from '../myMenu/myMenu';//我的
//import { IMqttMessage, MqttModule, MqttService } from 'ngx-mqtt';

@Component({
  selector: 'page-consumerIndex',
  templateUrl: 'consumerIndex.html'
})

export class ConsumerIndexPage  extends registerBack{
  chatRoot1 = ConsumerListPage;
  chatRoot2 = PersonSearchPage;
  chatRoot3 = LineUpPage;
  chatRoot4 = MyMenuPage;
  PAGE:"index.ts";
  weather:object={
    city:"",
    temp1:"",
    temp2:"",
    weather:""
  };
  _height:string ="";//div 动态高度
  public registrationId: string;
  landscape:boolean = false;//横屏flag
  devicePlatform: string;
  css:any;//权限显示
  href :object = {
    ConsumerListPage:ConsumerListPage,
    // JobListPage:JobListPage,
    // UpdatepasswordPage:UpdatepasswordPage,
    // ListPage1:ListPage,
  }
  sequence: number = 0;
  sex: Boolean = true;//工作人员
  menu: Array<{ id: number, title: string, icon: string, href: object, infonum: number }> = [];//菜单数组
  selectedTheme;
  aa: String = "ddd";
  user: Userobj = {
    userId: 0,
    name: "",
    img: ""
  };//:{name:string,img:string,userId:number};//用户对象
  sensor1: String;
  map :any;
  ddd=``;
  @ViewChild(Nav) nav: Nav;
  rootPage1: any = LoginPage;
  constructor( //private _mqttService: MqttService,
        public service: ServiceProvider,
        private settings: SettingsProvider,
        public navCtrl: NavController,
        public events: Events,
        public toastC: ToastController,
        private vibration: Vibration,
        public jpush: JPush,
        public device: Device,
        public exception :Exception,
        public DomSanitizer :DomSanitizer,
        private platform: Platform) {
         super("/index");
          this.events
          
          // direction.getWnindirection({fcn:this.screen});
          console.log(document.getElementsByClassName("title"));
          //判断设备方向
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

    this.devicePlatform = device.platform;
    // 获取当前主题
    this.settings.getActiveTheme().subscribe(val => this.selectedTheme = val);
    // this.menu = [
    //   { id: 1, title: "外理派工", icon: "../../assets/imgs/Dispatching.png", href: ListPage, infonum: 122 },
    //   { id: 2, title: "开始作业", icon: "../../assets/imgs/jop.png", href: JobListPage, infonum: 1 },
    //   { id: 3, title: "修改密码", icon: "../../assets/imgs/set.png", href: UpdatepasswordPage, infonum: 0 },
    //   { id: 4, title: "退出登录", icon: "../../assets/imgs/exit.png", href: ListPage, infonum: 0 },
    //   { id: 5, title: "工班统计", icon: "../../assets/imgs/statistics.png", href: StatisticslistPage, infonum: 0 },
    //   { id: 6, title: "整船统计", icon: "../../assets/imgs/statistics2.png", href: StatisticslistPage, infonum: 0 },
    // ]

    let _img = "";
    let _userId = 1;
    let _name ;
    _name = lSe.getItem("userData").record.loginid;
    this.sex = lSe.getItem("userData").record.sex == null ? true : lSe.getItem("userData").record.sex == "男" ? true : false;
    if (_img != "" && _img != null) {
      this.user.img = imgUrl + _img;
    } else {
      this.user.img = defaultHeadPorait;
    }
    this.css = lSe.getItem("userData").record.rolename.indexOf("外理理货组长")<=-1? "jurisdiction":"";
    console.log(this.css);console.log(lSe.getItem("userData").record.rolename.indexOf("外理理货组长"));
    this.user.userId = lSe.getItem("userData").record.loginid;
    this.user.name = lSe.getItem("userData").record.username;

    //this.presentToast("constructor");

    //       this._mqttService.observe('home/door').subscribe((message: IMqttMessage) => 
    //  {
    //  this.sensor1 = message.payload.toString();
    //  console.log(this.sensor1);
    //  });
    document.addEventListener(
      "jpush.receiveNotification",
      (event: any) => {
        var content;
        if (this.devicePlatform == "Android") {
          content = event.alert;
        } else {
          content = event.aps.alert;
        }
        this.vibration.vibrate(2000);
        this.presentToast(JSON.stringify(event)["alert"]);
      },
      false
    );

    document.addEventListener(
      "jpush.receiveMessage",
      (event: any) => {
        var content;
        if (this.devicePlatform == "Android") {
          content = event.alert;
        } else {
          content = event.aps.alert;
        }
        alert("Receive message: " + JSON.stringify(event));
      },
      false
    );

    // document.addEventListener(
    //   "jpush.openNotification",
    //   (event: any) => {
    //     var content;
    //     if (this.devicePlatform == "Android") {
    //       content = event.alert;
    //       alert(event.extras["cn.jpush.android.EXTRA"].ID)
    //     } else {
    //       // iOS
    //       if (event.aps == undefined) {
    //         // 本地通知
    //         content = event.content;
    //       } else {
    //         // APNS
    //         content = event.aps.alert;
    //       }
    //     }
    //     alert("open notification: " + JSON.stringify(event));
    //   },
    //   false
    // );

    // document.addEventListener(
    //   "jpush.receiveLocalNotification",
    //   (event: any) => {
    //     // iOS(*,9) Only , iOS(10,*) 将在 jpush.openNotification 和 jpush.receiveNotification 中触发。
    //     var content;
    //     if (this.devicePlatform == "Android") {
    //     } else {
    //       content = event.content;
    //     }
    //     alert("receive local notification1: " + JSON.stringify(event));
    //   },
    //   false
    // );
  }
  screen(obj){
  
      console.log("index窗口",obj);
      alert(screen.availWidth);
       let _that = this;
      //计算宽度和高度
      //let window = direction.getWnindirection({fcn:this.screen});
      if(obj.screenDirection == "竖屏"){
        _that.landscape = false;//div100%css布局
        setTimeout(function(){
         console.log(document.getElementsByClassName("content1")[0].clientHeight)
         console.log(document.getElementsByClassName("content1"),document.getElementsByClassName("content1")[0].clientHeight);
         //menu的高度  四个10px 3个button高度
         let total:number = document.getElementsByClassName("content1")[0].clientHeight;
         console.log(total);
         total = Math.floor((total-4*10)/3);
         _that._height  = total+"px";
         console.log(total);
        
        },100);
        
      }else{
        _that.landscape = true;//div100%css布局
        console.log(document.getElementsByClassName("content1")[1].clientHeight);
        //menu的高度  三个10px 2个button高度
        setTimeout(function(){
            let total:number = document.getElementsByClassName("content1")[1].clientHeight;
            //document.getElementsByClassName("content1")[1].clientHeight:document.getElementsByClassName("content1")[0].clientHeight;
            console.log(total);
            total =  Math.floor((total-3*10)/2);
            console.log(total);
            _that._height  = total+"px";
        },100);
      }

  }
  
  ionViewDidLoad(){
     //console.log(document.getElementsByClassName("content1")[0].clientHeight);
      //this.screen(direction.getWnindirection({fcn:this}))
  }
  hrefClick(page, title) {
    // this.platform.exitApp();
    console.log(title);
    if (title == "退出登录") {
      this.service.logout({loginid:lSe.getItem("userData").record.loginid}).then(data=>{
            console.log(data);
            lSe.setItem("user", { state: false });
            this.navCtrl.push(LoginPage);
      }).catch(data=>{

      });
    }else{
      this.navCtrl.push(page, {
             callback: this.myCallbackFunction
          })
    }
      //this.nav.setRoot(LoginPage);
    // } else if (title == "工班统计") {
    //   this.navCtrl.push(page, {
    //     callback: this.myCallbackFunction,
    //     flagText: "工班统计"
    //   })
    // } else if (title == "整船统计") {
    //   this.navCtrl.push(page, {
    //     callback: this.myCallbackFunction,
    //     flagText: "整船统计"
    //   })
    // } else {
    //   this.events.subscribe('bevents', (params) => {
    //     // 接收B页面发布的数据
    //     console.log('接收数据为: ' + params);

    //     // 取消订阅
    //     this.events.unsubscribe('bevents');
    //   })
    //   //this.navCtrl.push(page, { item12: "丁伟" });//跳转页面
    //   if(title == "外理配工" &&lSe.getItem("userData").record.rolename.indexOf("外理理货组长")<=-1){
    //     this.presentToast("无权限操作派工！"); 
    //     return;
    //   }
    //   this.navCtrl.push(page, {
    //     callback: this.myCallbackFunction
    //   })
    // }
  }
  // 用于pop 回调的 block
  myCallbackFunction = (params) => {
    console.log(this.aa);
    return new Promise((resolve, reject) => {
      if (typeof (params) != 'undefined') {
        console.log(this.aa);
        resolve('ok');
        console.log('回调1: ' + params);
      } else {
        reject(Error('error'))
      }
    });
  }
  ionViewDidEnter() {
    //this.presentToast("ionViewDidEnter");
    console.log("11");
    this.service.getAppbasic().then(data=>{
      console.log(data);
      try{
        this.weather = data["data"].weather;
      }catch(e){
         //返回 App json处理时发生出错时 处理逻辑；
         this.presentToast("app处理数据错误，已提交后台！");
         let obj:ERROR;
         obj ={err_reason:e.toString(),err_page:this.PAGE,err_data:JSON.stringify({"constructor":"jobdescription.ts--constructor数据初始化出错！"}),loginid:lSe.getItem("userData").record.loginid};//错误
         this.exception.errorhttp(obj);
      }
     
    }).catch(data=>{
      console.log(data);
    });
    super.BackButtonCustomHandler();
  }

  changeTheme() {
    if (this.selectedTheme === 'dark-theme') {
      //改变
      this.settings.setActiveTheme('light-theme');
    } else {
      this.settings.setActiveTheme('dark-theme');
    }
  }
  presentToast(message) {
    let toast = this.toastC.create({
      message: message,
      duration: 1000,
      position: 'middle',
      cssClass: "margin25"
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    toast.present();
  }
  tagResultHandler = function (result) {
    var sequence: number = result.sequence;
    var tags: Array<string> = result.tags == null ? [] : result.tags;
    alert('Success!' + '\nSequence: ' + sequence + '\nTags: ' + tags.toString());
  };

  aliasResultHandler = function (result) {
    var sequence: number = result.sequence;
    var alias: string = result.alias;
    alert('Success!' + '\nSequence: ' + sequence + '\nAlias: ' + alias);
  };

  errorHandler = function (err) {
    var sequence: number = err.sequence;
    var code = err.code;
    alert('Error!' + '\nSequence: ' + sequence + '\nCode: ' + code);
  };

  getRegistrationID() {
    this.jpush.getRegistrationID()
      .then(rId => {
        this.registrationId = rId;
        alert("id:"+rId);
      });

  }
  addLocalNotification() {
    if (this.devicePlatform == "Android") {
      this.jpush.addLocalNotification(0, "Hello JPush", "JPush", 1, 5000);
    } else {
      this.jpush.addLocalNotificationForIOS(5, "Hello JPush", 1, "localNoti1");
    }
  }
  // ionViewCanLeave() {
  //   this.platform.exitApp();
  // }

  function(e){
    console.log(e);
  }
assembleHTML(strHTML: any) {
  return this.DomSanitizer.bypassSecurityTrustHtml("<div style=\'background:red;\'>4545</div>");
}

ionViewWillLeave(){
  super.ionViewWillLeave && super.ionViewWillLeave();
}
}
