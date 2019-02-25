import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the StarObjectPipe pipe.
 *
 * 去文字带星方法
 */
@Pipe({
  name: 'starObject',
})
export class StarObjectPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string, ...args){
      return value.replace(new RegExp(value.substr(args[0],args[1]),"i"),'*');
  }
  
}

