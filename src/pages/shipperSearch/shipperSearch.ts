import { Component } from '@angular/core';
import { NavController ,NavParams ,ModalController ,Platform} from 'ionic-angular';
import { AddAddressPage } from '../addAddress/addAddress';
import { AddShipperPage } from '../addShipper/addShipper';
import { ServiceProvider } from '../../service/http';
import { pageBean } from '../../entity/pageBean';
import { registerBack } from "../../service/registerBack";
@Component({
  selector: 'page-shipperSearchPage',
  templateUrl: 'shipperSearch.html'
})
export class ShipperSearchPage extends registerBack {
    page :pageBean={
    page: 1,//当前页
    pageSize : 10,//每页最大条数
    total : 0,//总页数
    records : 0,//总记录数
    };
    myInput:string="";//查询条件
    item:any;//前一个页面类型
    title:string = "搜索";
    dataList:Array<any>;
    htmlShowFlag:number = 0;
    Event:any;
    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public modalC: ModalController,
                public service: ServiceProvider,
                private platform: Platform
              ) {
                super("/ShipperSearchPage");
               //判断页面来的方向 判断前一个页面来type
              let _flag:number = this.navParams.get("item").flag;
              switch(_flag){
                // 0 从货主页面跳入
                case 0: 
                this.title = this.navParams.get("item") == undefined ? "" : this.navParams.get("item").htmltype;
                this.item = this.navParams.get("item").data;
                this.onInput();
                break;
                // 1 从新增货主页面跳入
                case 1:
                this.item = this.navParams.get("item");
                this.title = this.item == undefined ? "" : this.item.htmltype;
                this.onInput();
                break;
                case 2:
                // 2 从新增预报页面跳入
                this.item = this.navParams.get("item");
                this.item.id = this.navParams.get("item").data.owener_key;
                this.title = this.item == undefined ? "" : this.item.htmltype;
                this.onInput();
                break;
                default:
                this.item = this.navParams.get("item");
                this.title = this.item == undefined ? "" : this.item.type;
              }


    }
  addAddressHref(){//跳转新增地址页面
      this.navCtrl.push(AddAddressPage,{item:{htmltype:"新增",callback:this}});
  }
  hrefaddshipper(){//跳转新增货主
    let modal = this.modalC.create(AddShipperPage,{item:{htmltype:"新增货主",callback:this}});
    modal.present();
  }
  href(){//跳转新增地址页面
    console.log("跳转新增地址页面");
    let modal = this.modalC.create(AddAddressPage,{item:{htmltype:"新增地址",callback:this,id:this.item.id}});
    modal.present();
  }

  onInput(){
    console.log(this.myInput);
    this.page.page = 1;
    this.service.getReceiveAddressList({
      search:JSON.stringify({goodshost_id:this.item.id,condition:this.myInput}),
      pageBean:JSON.stringify({page:1,pageSize:10,total:0,records:0})}).then(data=>{
      console.log(data);

      if(data["ok"]){
          
          this.dataList = data["data"].pager.rows;
          this.htmlShowFlag = this.dataList.length;
          if(this.Event==undefined)return;
          if(data["data"].pager.rows.length==10){
              this.Event.enable(true);
          }else{
              this.Event.enable(false); 
          }
      }else{

      }
     
    }).catch(data=>{
      console.log(data);
    })
    
  }
  goback(){
    this.navCtrl.pop();
    //super.ionViewWillLeave && super.ionViewWillLeave();
  }
  editor(item){
    console.log(item);
    let modal = this.modalC.create(AddAddressPage,
      {item:{htmltype:"编辑地址",callback:this,id:this.item.id,data:item}});
    modal.present();
  }
  doInfinite(event){
    this.Event = event;
    console.log(event);
    this.service.getReceiveAddressList({
      search:JSON.stringify({goodshost_id:this.item.id,condition:this.myInput}),
      pageBean:JSON.stringify({page:++this.page.page,pageSize:10,total:0,records:0})}).then(data=>{
      console.log(data);
      if(data["ok"]){
        if(data["data"].pager.rows.length>0){
          this.dataList = this.dataList.concat(data["data"].pager.rows);
          if(data["data"].pager.rows.length==10){
             event.complete();
          }else{
             event.enable(false); 
          }
       }else{
             event.enable(false); 
       }
      }else{

      }
    }).catch(data=>{
      console.log(data);
    })
  }
  ionViewWillLeave(){
    super.ionViewWillLeave && super.ionViewWillLeave();
  }
  ionViewDidEnter(){
    super.BackButtonCustomHandler();
  }
  pophref(item){
    if(this.navParams.get("item").flag==2){
       this.navParams.get("item").callback.callbackFunction(item);
       this.navCtrl.pop();
    }
  }
}
