import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler ,NgModule } from '@angular/core';
import { IonicApp ,IonicErrorHandler ,IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { TallyingPage } from '../pages/tallying/tallying';
import { StaffListPage } from '../pages/staffList/staffList';
import { JobdescriptionPage} from '../pages/jobdescription/jobdescription';
import { DispatchedworkersPage } from '../pages/dispatchedworkers/dispatchedworkers';
import { JobdescriptionyardPage } from '../../src/pages/jobdescriptionyard/jobdescriptionyard';
import { JobdescriptionOutPage } from '../../src/pages/jobdescriptionOut/jobdescriptionOut';
import { JobdescriptionInstallPage } from "../../src/pages/jobdescriptionInstall/jobdescriptionInstall";
import { MechanicalPage } from '../../src/pages/mechanical/mechanical';
import { RefutationPage } from '../pages/refutation/refutation';
import { vehicleStoragePage } from '../pages/vehicleStorage/vehicleStorage';
import { TicketNumberPage } from '../pages/ticketNumber/ticketNumber';
import { TicketNumberQueryPage } from '../pages/ticketNumberQuery/ticketNumberQuery';
import { UpdatepasswordPage } from '../pages/updatepassword/updatepassword';
import { WorkclassPage } from '../pages/workclass/workclass';
import { CameraPage } from '../pages/camera/camera';
import { PaymentPage }from '../pages/payment/payment';
import { StatisticslistPage } from '../pages/statisticslist/statisticslist';
import { HeightDriverPage } from '../pages/heightDriver/heightDriver';
import { CodeSheetPage } from '../pages/codeSheet/codeSheet';
import { VehicleListPage } from '../pages/vehicleList/vehicleList';
import { IndexPage } from '../pages/index/index';
import { JobListPage } from '../pages/jobList/jobList';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ServiceProvider} from '../service/http'
import { HttpModule } from '@angular/http';
import { SettingsProvider } from '../providers/settings/settings';
import { Session } from '../service/session';
import { Vibration } from '@ionic-native/vibration';
import { JPush } from '@jiguang-ionic/jpush';
import { Device } from '@ionic-native/device';
import { Exception } from '../service/exception';
import { DriverPage } from '../pages/driver/driver';
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    TallyingPage,
    IndexPage,
    DispatchedworkersPage,
    StaffListPage,
    JobdescriptionPage,
    JobListPage,
    JobdescriptionyardPage,
    TicketNumberPage,
    JobdescriptionOutPage,
    CameraPage,
    vehicleStoragePage,
    RefutationPage,
    CodeSheetPage,
    VehicleListPage,
    PaymentPage,
    TicketNumberQueryPage,
    UpdatepasswordPage,
    WorkclassPage,
    StatisticslistPage,
    DriverPage,
    JobdescriptionInstallPage,
    HeightDriverPage,
    MechanicalPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    TallyingPage,
    IndexPage,
    DispatchedworkersPage,
    StaffListPage,
    JobdescriptionPage,
    JobListPage,
    JobdescriptionyardPage,
    TicketNumberPage,
    JobdescriptionOutPage,
    CameraPage,
    vehicleStoragePage,
    RefutationPage,
    CodeSheetPage,
    VehicleListPage,
    PaymentPage,
    TicketNumberQueryPage,
    UpdatepasswordPage,
    WorkclassPage,
    StatisticslistPage,
    DriverPage,
    JobdescriptionInstallPage,
     HeightDriverPage,
     MechanicalPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ServiceProvider,
    SettingsProvider,
    Camera,
    File,
    FileTransfer,
    Session,
    Vibration,
    JPush,
    Device,
    Exception
  ]
})
export class AppModule {}
