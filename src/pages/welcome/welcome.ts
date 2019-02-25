import { Component ,ViewChild } from '@angular/core';
import { NavController ,Slides } from 'ionic-angular';
import { ListPage } from '../list/list';
import { LoginPage } from '../login/login';
import { lSe } from '../..//public/localstorage';
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage {
  @ViewChild(Slides) slides: Slides;
  constructor(public navCtrl: NavController) {

  }
  openPage(){
    console.log("11");
    this.navCtrl.push(ListPage, { item12: "丁伟" });
  }
  experience(e){
    console.log(e);
    this.navCtrl.push(LoginPage,{}).then(data=>{
       lSe.setItem('read',{flag:true});
    });
  }
}
