import { Component } from '@angular/core';
import { NavController ,NavParams ,ToastController} from 'ionic-angular';
import { ListPage } from '../list/list';

@Component({
  selector: 'page-searchcom',
  templateUrl: 'searchcom.html'
})
export class SearchcomPage {
  startdateTime:String;//日期时间
  enddateTime:String;//日期时间
  end={
    maxval:"2018-11-1",
    minval:"2018-10-1"
  }
  item:any;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public toast: ToastController) {
           this.item = this.navParams.get("callback");
  }
  
  searchClick(){
   this.compareDate(this.startdateTime,this.enddateTime);
  }
  //吐司
  presentToast(message) {
    let toast = this.toast.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      cssClass:"margin25"
    });
    toast.onDidDismiss(() => {

    });
    toast.present();
  }
  startdateTimechange(e){
    this.startdateTime =`${e.year}-${e.month}-${e.day}-${e.hour}-${e.minute}`;
  }
  enddateTimechange(e){
    this.enddateTime =`${e.year}-${e.month}-${e.day}-${e.hour}-${e.minute}`;
  }
  //比较日前大小  
 compareDate(checkStartDate, checkEndDate) {      
    let arys1= new Array();      
    let arys2= new Array();      
    if((checkStartDate != null && checkEndDate != null)||(checkStartDate != null || checkEndDate != null)) {     
        arys1 = checkStartDate == null ? new Array() : checkStartDate.split('-');  
        arys2 = checkEndDate == null ? new Array() : checkEndDate.split('-');         
        let sdate = arys1.length <= 0? new Date(1974,0,12) : new Date(arys1[0],parseInt(String(arys1[1]-1)),arys1[2],arys1[3],arys1[4]);      
        let edate = arys2.length <= 0? new Date(2099,0,12) : new Date(arys2[0],parseInt(String(arys2[1]-1)),arys2[2],arys2[3],arys2[4]);      
        if(sdate > edate) {         
            this.presentToast("日期开始时间大于结束时间");
            return false;         
        }else {   
            this.item.myCallbackFunction1({start_time:sdate,end_time:edate}).then(data=>{
               this.navCtrl.pop();
            }).catch(data=>{
            });
            return true;      
        }   
    }else{
      this.item.myCallbackFunction1({start_time:"",end_time:""}).then(data=>{
        this.navCtrl.pop();
     }).catch(data=>{
     });
      
    }    
 }     
}
