import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {ListPage} from '../list/list';
import { registerBack } from "../../service/registerBack";

@Component({
  selector: 'page-vehicleList',
  templateUrl: 'vehicleList.html'
})
export class VehicleListPage extends registerBack{

  constructor(public navCtrl: NavController) {
     super("/extends registerBack");
  }
  openPage(){
    console.log("11");
    this.navCtrl.push(ListPage, { item12: "丁伟" });
  }
  ionViewDidEnter(){
    super.BackButtonCustomHandler();
  }
  ionViewWillLeave(){
    super.ionViewWillLeave && super.ionViewWillLeave();
  }
}
