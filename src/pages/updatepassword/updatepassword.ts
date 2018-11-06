import { Component } from '@angular/core';
import { NavController ,ToastController} from 'ionic-angular';
import { lSe } from '../../public/localstorage';
import { ServiceProvider } from '../../service/http';
import { Exception } from '../../service/exception';
import { ERROR } from '../../entity/error';
import { LoginPage } from '../login/login';
@Component({
  selector: 'page-updatepassword',
  templateUrl: 'updatepassword.html'
})
export class UpdatepasswordPage {
  PAGE:"updatepassword.ts";
  passwordShow:Boolean=false;//密码显示标记
  oldpassword:String;//旧密码
  newpassword:String;//新密码
  confirmpassword:String;//确认密码
  constructor(public navCtrl: NavController,
              public toastController:ToastController,
              public service :ServiceProvider,
              public exception:Exception) {
      
  }
  submit(){
    // @param loginid   登录人id
    // * @param old_pass  原密码
    // * @param new_pass  新密码
    // * @param comfirm_pass  确认新密码
    let _that = this;
    try{
      if(lSe.getItem('memory').password==this.oldpassword){
        if(this.newpassword==this.confirmpassword){
             this.service.change({
              loginid:lSe.getItem("userData").record.loginid,
              old_pass:this.oldpassword,
              new_pass:this.newpassword,
              comfirm_pass:this.confirmpassword
             }).then(data=>{
              
               if(data["msg"]=="密码修改成功"){
                let toast = this.toastController.create({
                  message:data["msg"]+",正在退出登录中...",
                  duration: 1000,
                  position: 'middle',
                  cssClass:"margin25"
                });
                toast.onDidDismiss(() => {
                  _that.service.logout({loginid:lSe.getItem("userData").record.loginid}).then(data=>{
                    console.log(data);
                    lSe.setItem("user", { state: false });
                    _that.navCtrl.push(LoginPage);
                      }).catch(data=>{
                
                      }); 
                });
                toast.present();
               
                
               }else{
                this.presentToast(data["data"].msg);
               }
                   console.log(data);
             }).catch(data=>{

             });
        }else{
          this.presentToast("新密码和确认密码不一致！");
        }
    }else{
          this.presentToast("旧密码输入有误！");
    }
    }catch(e){
        //返回 App json处理时发生出错时 处理逻辑；
        this.presentToast("app处理数据错误，已提交后台！");
        let obj:ERROR;
        obj ={err_reason:e.toString(),err_page:this.PAGE,err_data:JSON.stringify({error:"密码修改有误！"}),loginid:lSe.getItem("userData").record.loginid};//错误
        this.exception.errorhttp(obj);
    }
   
    
    console.log(this.oldpassword,this.newpassword,this.confirmpassword);
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
}
