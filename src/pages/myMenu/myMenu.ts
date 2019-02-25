import { Component } from '@angular/core';
import { NavController ,ModalController} from 'ionic-angular';
import { ServiceProvider } from "../../service/http";
import { lSe } from "../../public/localstorage";
import { LoginPage } from "../login/login";

@Component({
  selector: 'page-myMenu',
  templateUrl: 'myMenu.html'
})
export class MyMenuPage{
  user:{
    name:string,
    number:string,
    img:string
  }={name:null,
     number:null,
     img:null
    };
  constructor(public navCtrl: NavController,
              public service: ServiceProvider,
              public modalC: ModalController){
                  this.user.name = lSe.getItem("role").name;
                  this.user.number = lSe.getItem("memory").username;
  }
  outLogin(){// 退出到登录页面
    this.service.logout({loginid:lSe.getItem("userData").record.loginid}).then(data=>{
          lSe.setItem("user", { state: false });
          let modal = this.modalC.create(LoginPage,{
              item:{
                  htmlType:"请选择货主",
                  callback:this,
                  flag:1
              }
            });
        modal.present();
    }).catch(data=>{

    });
  }
}
