import { Pipe ,PipeTransform } from '@angular/core';

@Pipe({
  name: 'sxypie',
  pure: true,       //true表示纯管道， false表示非纯管道
})
export class SxypiePipe implements PipeTransform {

  /**
   * 
   * 判断船舶预报 状态
   * @param {number} value
   * @param {string} exponent
   * @returns {number}  
   * 内河作业船队状态 1预报 
   *               2发布 
   *               3提交审核 
   *               4审核 
   *               5审核未通过 
   *               6提交确认 
   *               7确认  
   *               8靠泊 
   *               9开始作业  
   *              10完成作业 
   *              11离泊
   *              12作废
   *              //13新增预报草稿
   */
  transform(value: number, exponent: string): string {

        let _str = "无状态";

        // if(value == 13){
        //     _str = "待发布";
        // }else 
        if(value == 2){
            _str = "发布";
        }else if(value == 3){
            _str = "提交审核";
        }else if(value == 1){
            _str = "预报";
        }else if(value == 4){
              _str = "审核通过";
        }else if(value == 5){
              _str = "审核未通过 ";
        }else if(value == 6){
              _str = "提交确认 ";
        }else if(value == 7){
              _str = "已确认";
        }else if(value == 8){
              _str = "靠泊";
        }else if(value == 9){
              _str = "开始作业";
        }else if(value == 10){
              _str = "完成作业";
        }else if(value == 11){
              _str = "离泊";
        }else if(value == 12){
              _str = "作废";
        }

        return _str;

    }
}

