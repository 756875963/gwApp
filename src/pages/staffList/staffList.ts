import { Component ,ViewChild} from '@angular/core';
import { NavController ,NavParams ,ToastController ,Content } from 'ionic-angular';
import { ListPage } from '../list/list';
import { lSe } from '../../public/localstorage';
import { ServiceProvider } from '../../service/http';
import { pageBean } from '../../entity/pageBean';
import { Userlist } from '../../entity/userlist';
import { registerBack } from "../../service/registerBack";

@Component({
  selector: 'page-staffList',
  templateUrl: 'staffList.html'
})
export class StaffListPage extends registerBack{
  @ViewChild(Content) content : Content;
  activeData :Array<any> =[
  ];//选中的人员
  data :Array<Userlist> =[
  ];
  callback;
  submitFlag :Boolean = false; 
  pageHttpFlag :boolean =true;//下拉请求标记
  httpFlag :Boolean = true; //重复请求标记
  page :pageBean={
    page : 1,//当前页
    pageSize : 0,//每页最大条数
    total : 0,//总页数
    records : 0,//总记录数
  };
  page2:{ //请求分页
    page:number,
    rows:number
  }={page:1,rows:10};
  constructor(public navCtrl: NavController,
     public navParams: NavParams ,
     public toastCtrl:ToastController ,
     public service:ServiceProvider) {
      super("/staffList");
    this.callback = this.navParams.get("callback");
  
    this.activeData = this.navParams.get("data");
   
    
    this.http({page:1,rows:10}).then(
      (obj:Userlist)=>{
          
             for(var i=0;i<obj["data"].data.length;i++){
              obj["data"].data[i].doFlag = false
              for(var j=0;j<this.activeData.length;j++){
              if(this.activeData[j].user_id==obj["data"].data[i].user_id){
                
                obj["data"].data[i].doFlag =true;
                 break;
              }else if(this.activeData.length==j){
                obj["data"].data[i].doFlag =false;
              }
           }
             
          }
         
           this.data =  obj["data"].data;
      }
    ).catch(
      (obj)=>{

      }
    );
   
  }
  openPage(){
  
    this.navCtrl.push(ListPage, { item12: "丁伟" });
  }
  hrefpush(event){
   
  }
  checkFct(data){
   
    let _dataList = this.data;
    let array1 =[];
    let array2 =[];
    if(!this.submitFlag){
      for(var i =0; i<_dataList.length;i++){
        if(_dataList[i].id == data.id){
           if(!this.data[i].doFlag ){
            array1.push(_dataList[i]);
           }
           _dataList[i].doFlag = !data.doFlag;
        }else{
           if(this.data[i].doFlag){
            array2.push(_dataList[i]);
           }
        }
    } 
    this.activeData = array1.concat(array2);
    }
  }
  submit(){
    var _that = this;
   
    if(this.activeData.length>0){
      if(!this.submitFlag){
        this.submitFlag =true;
        let param = this.activeData;
        lSe.setItem('userlist',this.activeData);
        setTimeout(() => {
          _that.callback({system:null}).then((e :UIEvent)=>{
           _that.submitFlag =false;
           _that.navCtrl.pop();
          }).catch((e:UIEvent)=>{
            
          });
        },500);
       }
    }else{
      let toast = this.toastCtrl.create({
        message: "未选中人员，无法保存！",
        duration: 2000,
        position: 'middle',
        cssClass:"margin25"
      });
      toast.onDidDismiss(() => {
       
      });
      toast.present();
    }     
  }
  delete(data){
    // let _dataList = this.data;
    // let _activeList = this.activeData;
    // for(var i =0; i<_dataList.length;i++){
    //     if(_dataList[i].number == data.number){
    //        _dataList[i].doFlag = !data.doFlag;
    //        //return;
    //     }    
    // } 
    // console.log(data);
    // for(var i =0;i<_activeList.length;i++){
      
    //   if(data.number==_activeList[i].number){
    //     console.log(i);
    //     console.log(this.activeData.splice(i,1));
    //     return;
    //   }
    //    // console.log(this.activeData);
    // }
  } 
  //任务列表请求
  async http(obj){
    return  await new Promise((resolve, reject) => {
       this.service.PersonnelList(obj).then(
         (obj:any) =>{
             resolve(obj);
         }
       ).catch(
         obj=>{
          
         }
       );
     })
  }
  doInfinite(event){
    
     this.http({page:++this.page2.page,rows:10}).then(
      (obj:Userlist)=>{
          // console.log(14,obj["data"].data.rows);
          //    for(var i=0;i<obj["data"].data.rows.length;i++){
          //     obj["data"].data.rows[i].doFlag = false
          //     // for(var j=0;j<this.activeData.length;j++){
                
          //     // if(this.activeData[j].id==obj["data"][i].id){
          //     //   console.log(this.activeData[j].id);
          //     //   obj["data"][i].doFlag =true;
          //     //    break;
          //     // }else if(this.activeData.length==j){
          //     //   obj["data"][i].doFlag =false;
          //     // }
          //  // }
             
          // }
          // console.log(obj["data"]);
           this.data =  obj["data"].data.rows;
      }
    ).catch(
      (obj)=>{

      }
    );
  }
  ionViewDidEnter(){
    super.BackButtonCustomHandler();
  }
  ionViewWillLeave(){
    super.ionViewWillLeave && super.ionViewWillLeave();
  }
}
