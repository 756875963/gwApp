import { Component } from '@angular/core';
import { NavController ,NavParams} from 'ionic-angular';
import { ListPage } from '../list/list';
import { lSe } from '../../public/localstorage';
@Component({
  selector: 'page-ticketNumberQuery',
  templateUrl: 'ticketNumberQuery.html'
})
export class TicketNumberQueryPage {
  globalCheck :Boolean ;//全局选中状态
  inputAll :string ;//确定总的分票数
  //active_index :Array<number> = [];//选择数据的下标
  callback;
  data :Array<any> = [//mock数据
    {id:1,name1:"101",name2:"",name3:"1",flag:false},
    {id:2,name1:"102",name2:"",name3:"2",flag:false},
    {id:3,name1:"103",name2:"",name3:"3",flag:false},
    {id:4,name1:"104",name2:"",name3:"4",flag:false},
    {id:5,name1:"105",name2:"",name3:"5",flag:false}
  ];
  constructor(public navCtrl: NavController ,public navParams:NavParams) {
    this.callback = this.navParams.get("callback");
    //此处调用 http数据请求
  }
  sureinput(){
    for(var i =0;i<this.data.length;i++){
      if(this.data[i].flag){
        this.data[i].name2 = this.inputAll;
        this.data[i].flag = false;
      }  
    }
    this.globalCheck=false;
  }
  checkFunction(id){ 
      for(var i=0;i<this.data.length;i++){
        if(this.data[i].id==id){
          this.data[i].flag = !this.data[i].flag;
        }
      }     
  }
  globalcheckFunction(){
    for(var i=0;i<this.data.length;i++){
      if(!this.globalCheck){
          this.data[i].flag = true;
      }else{
          this.data[i].flag = false;
      }
    }
    this.globalCheck = !this.globalCheck;
  }
  submit(){
    lSe.setItem("ticketNumber",this.data);//设置回调数据
    this.callback(this.data).then((e :UIEvent)=>{
      this.navCtrl.pop();
     }).catch((e:UIEvent)=>{
       console.log(e);
     });
  }
 
}
