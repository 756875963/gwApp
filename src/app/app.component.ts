import { Component ,ViewChild } from '@angular/core';
import { Nav, Platform, AlertController ,ToastController , IonicApp} from 'ionic-angular';
import { AppVersion } from '@ionic-native/app-version';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';//实例页面
import { ListPage } from '../pages/list/list';//任务列表页面
import { LoginPage } from '../pages/login/login';//登陆页面
import { IndexPage } from '../pages/index/index';//app首页
import { CameraPage } from '../pages/camera/camera';//app首页
import { WelcomePage } from '../pages/welcome/welcome';//欢迎页面
import { CodeSheetPage } from '../pages/codeSheet/codeSheet';
import { SettingsProvider } from '../providers/settings/settings';
import { JPush } from '@jiguang-ionic/jpush';
import { lSe } from '../public/localstorage';
import { FileOpener } from '@ionic-native/file-opener';
import { FileTransfer ,FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { ServiceProvider } from '../service/http';
import { ActionType } from '../service/const';
import { WoodMentionPage } from '../pages/woodMention/woodMention';
declare const window: any;
declare var screen :any;     //定义全局变量
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  selectedTheme: String;
  @ViewChild(Nav) nav: Nav;
  rootPage: any = LoginPage;//LoginPage;
  pages: Array<{title: string, component: any}>;
  constructor( private settings: SettingsProvider, public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    public jpush: JPush,
    public appVersion :AppVersion,
    public alertCtrl:AlertController,
    public fileOpener :FileOpener,
    public transfer :FileTransfer,
    public file :File,
    public service :ServiceProvider,
    public toastCtrl :ToastController,
    public ionicApp : IonicApp,
   
    ) {
       
      // this.appVersion.getAppName();
      // this.appVersion.getPackageName();
      // this.appVersion.getVersionCode();
      // this.appVersion.getVersionNumber().then(data=>{
      //  alert(data); //获取版本号
      // }).catch()
    this.initializeApp();
    // used for an example of ngFor and navigation
    this.pages = [
      { title: '实例页面', component: HomePage },
      { title: '任务列表', component: ListPage },
      { title: '登录页面', component: LoginPage },
      { title: '首页',component: IndexPage},
      { title: '拍照测试',component: CameraPage}
    ];
    // if(lSe.getItem("read")&&lSe.getItem("read").flag){//开机欢迎界面
    //     this.rootPage = LoginPage;
    // }else{
    //     this.rootPage = WelcomePage;
    // }
    // if (window.cordova) {
    //   document.addEventListener("deviceready", () => {
    //     // retrieve the DOM element that had the ng-app attribute
    //     statusBar.styleLightContent();
    //     //延迟隐藏闪屏 防止有白屏
    //     window.setTimeout(() => {
    //       splashScreen.hide();
    //     }, 500);
    //     // 代码开始


    //     if (platform.is("ios")) {
    //       console.log('this is ios');
    //     } else if (platform.is("android")) {
    //       console.log('this is android');
    //     }

    //   }, false);
    // } else {
    //   console.log('web 模式');
    //   // 代码开始
    // }

    this.settings.getActiveTheme().subscribe(val => this.selectedTheme = val);
    platform.ready().then(() => {

     // this.registerBackButtonAction();//注册返回按键事件


      //this.service.getZzdata({}).then(data=>{console.log(data)}).catch(data=>{console.log(data)});
       //this.detectionUpgrade(ActionType.UPDATEURL+"/app-debug.apk",true); //版本更新
      //this.mirk();
     // window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      //(<any>window).navigator.splashscreen.hide();
      splashScreen.hide();
      //screen.orientation.lock('portrait-primary');
      jpush.init();
      jpush.setDebugMode(true);
    });
  }
  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
  detectionUpgrade(apkUrl, allowChoose) {
    if (allowChoose) {
      this.alertCtrl.create({
        title: '升级提示',
        subTitle: '发现新版本,是否立即升级？',
        buttons: [{
          text: '取消'
        }, {
          text: '确定',
          handler: () => {
            this.downloadApp(apkUrl);
          }
        }]
      }).present();
    } else {
      this.downloadApp(apkUrl);
    }
  
  }
  tos(msg){
    this.alertCtrl.create({
      title: '提示',
      subTitle: msg,
      buttons: [{
        text: '取消'
      }, {
        text: '确定',
        handler: () => {
          
        }
      }]
    }).present();
  }
  mirk(){ //测试
    this.file.createFile(this.file.externalDataDirectory,"dingwei",true).then(data=>{
       this.tos( data.toURL());
      
    })
    // this.file.checkDir(this.file.externalDataDirectory,"").then(_ => console.log('Directory exists')).catch(err => {
    //   this.file.createDir(this.file.externalDataDirectory,"",true).then(result=>{
    //       this.tos(result);
    //       this.file.createFile(this.file.externalDataDirectory,"dingwei",true).then(data=>{
    //          this.tos( data.toURL()); 
    //         })
    //   }).catch(err=>{
    //     console.log("err:"+JSON.stringify(err))
    //   })
    // });


  }
  downloadApp(apkUrl) {
    let alert = this.alertCtrl.create({
        title: '下载进度：0%',
        enableBackdropDismiss: false,
        buttons: ['后台下载']
    }); 
    alert.present();
    
    const fileTransfer: FileTransferObject = this.transfer.create();
    //const apk =  this.file.dataDirectory +'app.apk'; //apk保存的目录
    const apk = this.file.externalRootDirectory + 'app.apk'; //apk保存的目录
    fileTransfer.download(apkUrl, apk).then((entry) => {
      this.tos(decodeURI(entry.toURL()));
       //this.openFile(decodeURI(entry.toURL()));
        this.fileOpener.open(decodeURI(entry.toURL()), 'application/vnd.android.package-archive').then(() =>{
             this.tos('File is opened');
            console.log('File is opened')
        }).catch(e => {
             this.tos(e.toString());
            console.log('Error openening file', e)
        });
    });
    fileTransfer.onProgress((event: ProgressEvent) => {
        let num = Math.floor(event.loaded / event.total * 100);
        if (num === 100) {
            alert.dismiss();
        } else {
            let title = document.getElementsByClassName('alert-title')[0];
            title && (title.innerHTML = '下载进度：' + num + '%');
        }
    });

  }


  /**
   * 获取文件类型
   * @param fileType 
   */
  getFileMimeType(fileType: string): string {
    let mimeType: string = '';
  
    switch (fileType) {
      case 'txt':
        mimeType = 'text/plain';
        break;
      case 'docx':
        mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;
      case 'doc':
        mimeType = 'application/msword';
        break;
      case 'pptx':
        mimeType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
        break;
      case 'ppt':
        mimeType = 'application/vnd.ms-powerpoint';
        break;
      case 'xlsx':
        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        break;
      case 'xls':
        mimeType = 'application/vnd.ms-excel';
        break;
      case 'zip':
        mimeType = 'application/x-zip-compressed';
        break;
      case 'rar':
        mimeType = 'application/octet-stream';
        break;
      case 'pdf':
        mimeType = 'application/pdf';
        break;
      case 'jpg':
        mimeType = 'image/jpeg';
        break;
      case 'png':
        mimeType = 'image/png';
        break;
      default:
        mimeType = 'application/' + fileType;
        break;
    }
    return mimeType;
  }
  /**
   * 打开文件
   * @param path 
   */
  openFile(path:string){
    this.fileOpener.open(path,this.getFileMimeType(path.substring(path.lastIndexOf(".")+1,path.length)))
  .then(() => {console.log('File is opened'); this.tos('File is opened');})
  .catch(e => console.log('Error opening file', JSON.stringify(e)));
  }
  // canLeave:boolean = false;
  // exit:boolean = false;
  // ionViewCanLeave() {
   
  //   let _that = this;
  //   if(_that.exit){
  //      _that.canLeave = true;
  //   }else{
  //     alert("11再次点击返回退出！");
  //      _that.exit = true;
  //     setTimeout(function(){
  //       _that.exit = false;
  //     },2000)
  //   }
  //   return _that.canLeave;//阻止离开；
  // }

  registerBackButtonAction() {
    
    this.platform.registerBackButtonAction((e) => {
      alert("回退");
      let activePortal = this.ionicApp._modalPortal.getActive() || this.ionicApp._toastPortal.getActive() || this.ionicApp._overlayPortal.getActive();
        if (activePortal) {
          activePortal.dismiss();
          return;
        }
        alert(JSON.stringify(activePortal));

        let activeVC = this.nav.getActive();
        let activeNav = activeVC.getNav();
        return activeNav.canGoBack() ? activeNav.pop() : this.showExit();//this.nativeService.minimize();
      //this.abortDownloadAndExit();
      //  this.nav.pop();
      // if (!!e && typeof e.preventDefault === 'function') {
      //   e.preventDefault();
      // }
      // return true;
      //this.showExit()
      // //如果想点击返回按钮隐藏toast或loading或Overlay就把下面加上
      // let activePortal = this.ionicApp._toastPortal.getActive() || this.ionicApp._loadingPortal.getActive() || this.ionicApp._overlayPortal.getActive()
      // ;
      // alert(JSON.stringify(activePortal));
      // console.log(activePortal);
      // if (activePortal) {
      //   activePortal.dismiss().catch(() => {});
      //   activePortal.onDidDismiss(() => {});
      //   return;
      // }
      // let activeVC = this.nav.getActive();
      // let tabs = activeVC.instance.tabs;
      // let activeNav = tabs.getSelected();
      // return activeNav.canGoBack() ? activeNav.pop() :
    },1);
  }
  backButtonPressed: boolean = false;  //用于判断返回键是否触发
  //双击退出提示框
  showExit() {
    console.log(this.backButtonPressed);
    if (this.backButtonPressed) { //当触发标志为true时，即2秒内双击返回按键则退出APP
      this.platform.exitApp();
    } else {
      this.toastCtrl.create({
        message: '再按一次退出应用',
        duration: 2000,
        position: 'top'
      }).present();
      this.backButtonPressed = true;
      setTimeout(() => this.backButtonPressed = false, 2000);//2秒内没有再次点击返回则将触发标志标记为false
    }
  }
}
