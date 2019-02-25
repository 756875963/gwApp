import { Pipe, PipeTransform } from '@angular/core';

/**
 * 根据固定时间 产生固定时间端的值
 *  2019-12-09 00:00:00  =》「 2019-12-08 00:00:00 - 2019-12-10 00:00:00」
 * 
 */
@Pipe({
  name: 'timePassage',
})
export class TimePassagePipe implements PipeTransform {
  /**
   * Takes a value and makes it TimePassagePipe.
   */
  transform(value: string,exponent: number){
     
     let _html = "<img src=\"../../assets/imgs/tuceng.png\" />";
     let _Hours:number = exponent ? exponent*60*60*1000 :24*60*60*1000;
     let date = Number(new Date(value.replace(/-/g, '/')));
     let _min = date - _Hours;
     let _max = date + _Hours;
     return this.timetrans(_min)+_html+this.timetrans(_max);
  }
  timetrans(DATE:number){
     try{
        let date = new Date(DATE);
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
        let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
        let m = (date.getMinutes() <10 ? '0' + date.getMinutes() : date.getMinutes());
        let s = (date.getSeconds() <10 ? '0' + date.getSeconds() : date.getSeconds());
        return Y+M+D+h+m;
     }catch(e){
        return "0000-00-00 00:00";
     } 
  }
}
