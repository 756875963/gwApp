import { Component } from '@angular/core';
import { NavController ,NavParams} from 'ionic-angular';
import {ListPage} from '../list/list';

@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html'
})

export class PaymentPage {
  array:Array<any>;//页面集合数据
  constructor(public navCtrl: NavController,
              public navParams: NavParams) {
              console.log(this.navParams.get('item').data.list);
              this.array = this.navParams.get('item').data.list
  }
  openPage(){
    console.log("11");
    this.navCtrl.push(ListPage, { item12: "丁伟" });
  }

}
