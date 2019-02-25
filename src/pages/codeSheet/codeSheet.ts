import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {ListPage} from '../list/list';
import { lSe } from '../../public/localstorage';

@Component({
  selector: 'page-codeSheet',
  templateUrl: 'codeSheet.html'
})
export class CodeSheetPage {
  array:Array<any>;
  constructor(public navCtrl: NavController) {
     console.log(lSe.getItem("Codesheet"));
     this.array = lSe.getItem("Codesheet");//初始化码单列表
  }

}
