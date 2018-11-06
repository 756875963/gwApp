import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/Rx';

/*
  Generated class for the SettingsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SettingsProvider {

  private theme: BehaviorSubject<String>;
  
     constructor() {
         // theme 是 BehaviorSubject实例
         this.theme = new BehaviorSubject('light-theme');
     }
  
     setActiveTheme(val) {
         // 改变值
         this.theme.next(val);
     }
  
     getActiveTheme() {
         // 观察
         return this.theme.asObservable();
     }

}
