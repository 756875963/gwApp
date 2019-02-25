import { Component } from '@angular/core';
import { NavController ,NavParams ,ModalController ,ToastController ,LoadingController} from 'ionic-angular';
import { AddAddressPage } from '../addAddress/addAddress';
import { AddShipperPage } from '../addShipper/addShipper';
import { ServiceProvider } from '../../service/http';
import { pageBean } from '../../entity/pageBean';
import { ShipperSearchPage } from '../shipperSearch/shipperSearch';
@Component({
  selector: 'page-personSearch',
  templateUrl: 'personSearch.html'
})
export class PersonSearchPage {
    page :pageBean={
      page: 1,//当前页
      pageSize : 10,//每页最大条数
      total : 0,//总页数
      records : 0,//总记录数
    };
    item:any;//前一个页面类型
    title:string = "通讯录"//
    dataList:any;//数据集合
    myInput:string = "";//input输入值
    Event:any;
    htmlShowFlag:number = 0;
    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public modalC: ModalController,
                public service: ServiceProvider,
                public toastController: ToastController,
                public loadingController: LoadingController) {
              //判断前一个页面来type
              this.item = this.navParams.get("item");
              this.title = this.item == undefined ? "通讯录" : this.item.htmlType;
              // this.item.flag  1.新增预报跳入 调回退 
              
    }
  addAddressHref(){//跳转新增地址页面
      this.navCtrl.push(AddAddressPage,{item:{htmltype:"新增",callback:this}});
  }
  hrefaddshipper(){//跳转新增货主
    let modal = this.modalC.create(AddShipperPage,{item:{htemltype:"新增货主",callback:this}});
    modal.present();
  }
  ionViewDidEnter(boolean){
    let _loading = boolean?()=>{}:this.presentLoadingDefault();
    this.service.getMyGoodsHostList({
      pageBean:JSON.stringify({
        page: 1,//当前页
        pageSize : 10,//每页最大条数
        total : 0,//总页数
        records : 0,//总记录数
      }),
      search:JSON.stringify({condition:this.myInput})
    }).then(data=>{
      _loading();
      if(data["ok"]){
          this.dataList = data["data"].pager.rows;
          this.htmlShowFlag =  this.dataList.length;
      }else{
          this.presentToast(data["msg"]);
      }
    }).catch(data=>{
      _loading();
      this.presentToast("系统出错了");
    })
  }
  presentLoadingDefault(msg="数据加载中，请稍等！") { 
    //统一加载处理css 效果组件；
    let loading = this.loadingController.create({
      content:msg
    });
    loading.present();
    return ()=>{
      loading.dismiss()
    };
  }
  presentToast(message) {
    let toast = this.toastController.create({
      message: message,
      duration: 2000,
      position: 'middle',
      cssClass:"margin25"
    });
    toast.onDidDismiss(() => {
    });
    toast.present();
  }
  editor(item){//编辑
      let modal = this.modalC.create(AddShipperPage,{item:{htemltype:"编辑货主",callback:this,data:item}});
      modal.present();
  }
  hrefshipperaddress(item){//跳转收货地址
    let _address = {};//收货地址
    if(this.item&&this.item.flag==1){// 回退到新增预报页面
      this.service.getReceiveAddressList({
        search:JSON.stringify({goodshost_id:item.id,condition:""}),
        pageBean:JSON.stringify({page:1,pageSize:10,total:0,records:0})}).then(data=>{
        //取得默认第一个数据为货主默认地址；默认标记就是 list的第一个 is_default: "1"；
        if(data["ok"]){
          if(data["data"].pager.rows.length>0){
             _address = data["data"].pager.rows[0];
          }else{
             this.presentToast("没有查询到相关收货人地址");
          }
        }else{
          this.presentToast(data["msg"]);
        }
        this.item.callback.callback({address:_address,shipper:item});
        this.navCtrl.pop();
      }).catch(data=>{
        this.presentToast("系统出错了！");
      })
    }else{
       let modal = this.modalC.create(ShipperSearchPage,{item:{htmltype:"收货人地址",callback:this,data:item,flag:0}});
       modal.present();
    }
  }
  doInfinite(event){
        this.Event = event;
        this.page.page = ++this.page.page; 
        this.service.getMyGoodsHostList({
          pageBean:JSON.stringify(this.page),
          search:JSON.stringify({condition:this.myInput})
        }).then(data=>{
            if(data["ok"]){
                this.dataList = this.dataList.concat(data["data"].pager.rows);
                if(data["data"].pager.rows.length==10){
                    event.complete();
                }else{
                    event.enable(false); 
                }
            }else{
                this.presentToast(data["msg"]);
                event.enable(false); 
            }
        }).catch(data=>{
          this.presentToast("系统出错了");
        })
  }
  onInput(event){
    this.ionViewDidEnter(true);
  }
  goback(){
    this.navCtrl.pop();
  }
}
