import { Component ,ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';//实例页面
import { ListPage } from '../pages/list/list';//任务列表页面
import { LoginPage } from '../pages/login/login';//登陆页面
import { IndexPage } from '../pages/index/index';//app首页
import { CameraPage } from '../pages/camera/camera';//app首页
import { CodeSheetPage } from '../pages/codeSheet/codeSheet';
import { SettingsProvider } from '../providers/settings/settings';
import { JPush } from '@jiguang-ionic/jpush';
declare const window: any;
declare var screen :any;     //定义全局变量
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  selectedTheme: String;
  @ViewChild(Nav) nav: Nav;
  rootPage: any = LoginPage;
  pages: Array<{title: string, component: any}>;
  constructor( private settings: SettingsProvider, public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    public jpush: JPush
    ) {
    this.initializeApp();
    // used for an example of ngFor and navigation
    this.pages = [
      { title: '实例页面', component: HomePage },
      { title: '任务列表', component: ListPage },
      { title: '登录页面', component: LoginPage },
      { title: '首页',component: IndexPage},
      { title: '拍照测试',component: CameraPage}
    ];
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
}
