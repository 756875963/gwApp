import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from '../../app/app.component';
import { HomePage } from '../../pages/home/home';
import { ListPage } from '../../pages/list/list';
import { LoginPage } from '../../pages/login/login';
import { TallyingPage } from '../../pages/tallying/tallying';
import { IndexPage } from '../../pages/index/index';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ServiceProvider} from '../../service/http';
import { JobdescriptionPage } from '../jobdescription/jobdescription';
//import { HttpModule } from '@angular/http';
// @NgModule({
//   declarations: [
//     MyApp,
//     HomePage,
//     ListPage,
//     LoginPage,
//     TallyingPage,
//     IndexPage,
//     JobdescriptionPage
//     //HttpModule
//   ],
//   imports: [
//     BrowserModule,
//     IonicModule.forRoot(MyApp),
//   ],
//   bootstrap: [IonicApp],
//   entryComponents: [
//     MyApp,
//     HomePage,
//     ListPage,
//     LoginPage,
//     TallyingPage,
//     IndexPage,
//     JobdescriptionPage
//     //HttpModule
//   ],
//   providers: [
//     StatusBar,
//     SplashScreen,
//     {provide: ErrorHandler, useClass: IonicErrorHandler},
//     ServiceProvider
//   ]
// })
export class AppModule {}
