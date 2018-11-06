import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {ListPage} from '../list/list';

@Component({
  selector: 'page-workclass',
  templateUrl: 'workclass.html'
})
export class WorkclassPage {
  myDate:String="1900-01-09";
  constructor(public navCtrl: NavController) {

  }
  openPage(){
    console.log("11");
    this.navCtrl.push(ListPage, { item12: "丁伟" });
  }

}
