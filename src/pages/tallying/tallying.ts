import { Component } from '@angular/core';
import { NavController ,NavParams } from 'ionic-angular';

@Component({
  selector: 'page-tallying',
  templateUrl: 'tallying.html'
})
export class TallyingPage {
  selectedItem: any;
  icons: string[];
  items: Array<{
    id: number,//唯一表识
    active: boolean,//选中标记
    title: string, //标题
    note: string,  //笔记
    icon: string   //图标
  }>;
  flag: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
     console.log(navParams.get('item12'));
    // Let's populate this page with some filler content for funzies
    this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
    'american-football', 'boat', 'bluetooth', 'build'];

    this.items = [];
    for (let i = 1; i < 11; i++) {
      this.items.push({
        id:i,
        active:false,
        title: 'Item ' + i,
        note: 'This is item #' + i,
        icon: this.icons[Math.floor(Math.random() * this.icons.length)]
      });
    }
  }

  itemTapped(event, item) {
    // That's right, we're pushing to ourselves!
    this.navCtrl.push(TallyingPage, {
      item: item
    });

  }
  operation(event ,item){
     console.log(item);
     let _item:Array<any> = this.items;
      
    for(var i=0;_item.length>i;i++){
      
      if(_item[i].id==item.id){
         _item[i].active = !_item[i].active;
      }else{
         _item[i].active = false;
      }
    }
     this.items = _item;
  }
  doInfinite(event){
    console.log("下拉");
    setTimeout(()=>{
      event.complete();
    },5000);
  }
}
