import { Component } from '@angular/core';
import { NavController ,NavParams} from 'ionic-angular';

@Component({
  selector: 'page-translate',
  templateUrl: 'translate.html'
})
export class TranslatePage {

  capsize:object={
    saw_amount:0,//锯断刀数
    out_turn_no:0,//外翻根数
    out_turn_vol:0,//外翻体积
    in_turn_no:0,//内翻根数
    in_turn_vol:0,//内翻体积
    pile_turn_no:0,//归根根数
    pile_turn_vol:0,//归根体积
    cut_num:0//锯刀数
  };//翻桩对象
  task:any;//定时器任务
  measure_average:number;//平均方单位
  _this:any;//oldThis;
  constructor(public navCtrl: NavController,
              public navParams: NavParams) {
              let item = this.navParams.get("item");//获取前页面数据
              this.capsize = item.capsize;
              this._this = item._this;
              this.measure_average = item.measure_average;
  }
  
  blurInput(){
    console.log("失去焦点事件");
    clearInterval(this.task);
  }
  focusInput(){
    var thst = this;
    this.task = setInterval(data=>{
      let that = this;
      that.capsize ={
        out_turn_no:that.capsize["out_turn_no"],
        out_turn_vol:(that.capsize["out_turn_no"] * that.measure_average).toFixed(3),
        in_turn_no:that.capsize["in_turn_no"],
        in_turn_vol:(that.capsize["in_turn_no"] * that.measure_average).toFixed(3),
        pile_turn_no:that.capsize["out_turn_no"] + that.capsize["in_turn_no"],
        pile_turn_vol:(parseFloat(that.capsize["out_turn_vol"]) + parseFloat(that.capsize["in_turn_vol"])).toFixed(3),
        cut_num:that.capsize["cut_num"]
      }    
    },200); 
  }

  damaged_state(FALG:boolean){//数据提交或关闭
    if(FALG){
       this._this.capsize = this.capsize;
       this.navCtrl.pop();
    }else{
       this.navCtrl.pop();
    }
  }
}
