import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {ListPage} from '../list/list';

@Component({
  selector: 'page-vehicleList',
  templateUrl: 'vehicleList.html'
})
export class VehicleListPage {

  constructor(public navCtrl: NavController) {

  }
  openPage(){
    console.log("11");
    this.navCtrl.push(ListPage, { item12: "丁伟" });
  }

}
