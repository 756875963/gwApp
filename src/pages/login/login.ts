import { Component ,ViewChild } from '@angular/core';
import { NavController ,NavParams ,ToastController ,Nav ,Platform ,LoadingController ,AlertController} from 'ionic-angular';
import { IndexPage } from '../index/index';//app首页
import { HomePage }from '../home/home';
import { lSe } from '../../public/localstorage';
import { ServiceProvider} from '../../service/http';
import { Http } from '../../entity/httpdata';
import { JPush } from '@jiguang-ionic/jpush';
import { Device } from '@ionic-native/device';
import { Vibration } from '@ionic-native/vibration';
@Component({
    selector: 'page-list',
    templateUrl: 'login.html',
    providers: [ServiceProvider]
})
export class LoginPage {
    repeatFlag : boolean =true;//提交按钮重复控制标记
    lastUserName : string;//上一次输入的用户名
    lastPassWord : string;//上一次输入的密码
    selectedItem : any;
    icons : string[];
    loginState : boolean = false;//登录状态
    flag : boolean = true;       //记住账号
    username : string ="";
    password : string = "";
    isShow : boolean = true;
    result;
    registrationId:String;//设备编号
    car : object ={
      user:'',
      password:''
    }
    landscape:string;//
    @ViewChild(Nav) nav: Nav;
    rootPage :any = null;
    constructor(public navCtrl: NavController, 
                public navParams: NavParams,
                private toastCtrl: ToastController,
                private service: ServiceProvider,
                private loadingController: LoadingController,
                private alertC: AlertController,
                private vibration: Vibration,
                public jpush: JPush,
                public device: Device){

                  let _that = this;
              if(screen.availWidth<screen.availHeight){
                   //竖屏 
              }else{
                   //横屏
                  this.landscape = "loginrotate";//div50%css布局
              }
              window.addEventListener("orientationchange",function(){
                 if(window.orientation=='0'){
                   console.log("竖屏");
                     //竖屏
                     _that.landscape = "";//div100%css布局
                 }else if(window.orientation=='90'){
                    //横屏"
                    _that.landscape = "loginrotate";//div50%css布局
                 }
              });

      if(lSe.getItem("user")&&lSe.getItem("user").state){
        this.loginState = true;
        this.rootPage = IndexPage;
      }else{
        this.loginState = false;
        if(lSe.getItem("memory")&&lSe.getItem("memory").username){
            this.username = lSe.getItem("memory").username;
            this.password = lSe.getItem("memory").password;
        }
      }
      
    }
    itemTapped(event, item) {
      // That's right, we're pushing to ourselves!
      this.navCtrl.push(LoginPage, {
        item: item
      });
    }
    onLogin(event){
      let _that = this;
      let username = this.username;//用户名
      let password = this.password;//密码
      if(!this.repeatFlag){
         return;
      }
      if(username == this.lastUserName&&password == this.lastPassWord){
        // this.presentToast("用户名或密码不正确！");
        this.showAlert1("用户名或密码不正确！");
         return;
      }
      if(("" != username && null != username)&&("" != password && null != password)){//判断用户名和密码都不能为空
        //this.presentToast("登陆验证...");
        let _loading = this.presentLoadingDefault("登陆验证...");
        this.repeatFlag = false;
        this.lastUserName = this.username;
        this.lastPassWord = this.password;
        //this.jpush.getRegistrationID().then(rId => {
          let rId = "160a3797c85ea05494a";
          this.service.VerificationLoginTwo({username:this.username,password:this.password,device_id:rId}).then(
            (obj:Http)=>{
              _loading.dismiss();
              this.repeatFlag = true;
              console.log(obj,obj.data);
              let aa = true;
              //判断是否系统出错
              if(obj.ok){
                  //判断输入用户名是否正确
                  if(Boolean(obj.ok)){
                   // this.presentToast("用户名或密码不正确！");
                    lSe.setItem("user",{
                      username:username,
                      password:password,
                      state:true
                    });
                    if(event){
                        lSe.setItem("memory",{
                          username:username,
                          password:"",  
                        });
                        lSe.setItem("userData",obj.data);
                    }else{
                      lSe.setItem("memory",{});
                    }
                    this.loginState = true;
                    _that.nav.setRoot(IndexPage);
                  }else{
                   // this.presentToast("用户名或密码不正确！");
                    this.showAlert1("用户名或密码不正确！");
                  }
              }else{
                  //this.presentToast("用户名或密码不正确！");this.presentToast("系统出错！");
                  this.showAlert1("用户名或密码不正确！");
              }
            })   
       // });
        console.log("关");
       
      }else{
        this.presentToast("用户名或密码不能为空！");
      }
    }
    blurInput(flag){
      this.car={
        user:'',
        password:''
      }
    }
    focusInput(flag){
      console.log(flag);
      this.car[flag] ="carshow";
    }
    presentToast(message) {
      let toast = this.toastCtrl.create({
        message: message,
        duration: 2000,
        position: 'top',
        cssClass:"margin25"
      });
      toast.onDidDismiss(() => {
        console.log('Dismissed toast');
      });
      toast.present();
    }

    presentLoadingDefault(text) {
      let loading = this.loadingController.create({
        content: text
      });
      loading.present();
      return loading;
    }
     //提示数据1
   showAlert1(text){ 
    let alert = this.alertC.create({
      title: "登陆提示",
      message: text,
      buttons: [
        {
          text: "确定",
          handler: data => {
            console.log(data);
          }
        }
      ]
    });
    alert.present();
  }
  canLeave:boolean = false;
  ionViewCanLeave() {
    return this.canLeave;//阻止离开；
  }
}
