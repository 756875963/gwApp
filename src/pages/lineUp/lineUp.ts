import { Component } from '@angular/core';
import { NavController ,NavParams ,ToastController ,LoadingController} from 'ionic-angular';
import {ListPage} from '../list/list';
import { ServiceProvider } from '../../service/http';
import { pageBean } from '../../entity/pageBean';
@Component({
  selector: 'page-lineUp',
  templateUrl: 'lineUp.html'
})
export class LineUpPage {
  page :pageBean={
    page: 1,//当前页
    pageSize : 10,//每页最大条数
    total : 1,//总页数
    records : 1,//总记录数
  };
  dataList:Array<any>;
  constructor(public navCtrl: NavController,
              public service: ServiceProvider) {
     this.service.bargeQueue({pageBean:JSON.stringify({
      page: 1,//当前页
      pageSize : 10,//每页最大条数
      total : 1,//总页数
      records : 1,//总记录数
    })}).then(data=>{
       console.log(data);
       this.dataList = data["data"].queues.rows;
     }).catch(data=>{

     })
  }
  openPage(){
    console.log("11");
    this.navCtrl.push(ListPage, { item12: "丁伟" });
  }
  
}
