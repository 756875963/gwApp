import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler ,NgModule } from '@angular/core';
import { FileOpener } from '@ionic-native/file-opener';
import { PipesModule } from '../pipes/pipes.module';
import { IonicApp ,IonicErrorHandler ,IonicModule ,NavController} from 'ionic-angular';
import { MyApp } from './app.component';
import { Camera } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker'; 
import { File } from '@ionic-native/file';
import { FileTransfer ,FileTransferObject} from '@ionic-native/file-transfer';
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
import { HardwareBackButtonProvider } from '../service/HardwareBackButtonProvider';
import { KheightDriverPage } from '../pages/k_heightDriver/k_heightDriver';
import { JobListPage } from '../pages/jobList/jobList'; //理货list
import { WelcomePage } from '../pages/welcome/welcome';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ServiceProvider} from '../service/http';
import { HttpModule } from '@angular/http';
import { SettingsProvider } from '../providers/settings/settings';
import { Session } from '../service/session';
import { Vibration } from '@ionic-native/vibration';
import { JPush } from '@jiguang-ionic/jpush';
import { Device } from '@ionic-native/device';
import { Exception } from '../service/exception';
import { DriverPage } from '../pages/driver/driver';
import { AppVersion } from '@ionic-native/app-version';
import { WoodMentionPage } from '../pages/woodMention/woodMention';
import { Network } from '@ionic-native/network';
import { DataRollbackListPage } from '../pages/dataRollbackList/dataRollbackList';
import { MultiPickerModule } from 'ion-multi-picker';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { TranslatePage } from '../pages/translate/translate';

//船舶预报 外部页面
import { ConsumerIndexPage } from '../pages/consumerIndex/consumerIndex';//index
import { ConsumerListPage } from '../pages/consumerList/consumerList';//船舶预报列表
import { SearchcomPage } from '../pages/searchcom/searchcom';//查询页面
import { PredictionPage } from '../pages/addprediction/prediction';//新增预报
import { PersonSearchPage } from '../pages/personSearch/personSearch';//货主和收货人查询
import { AddAddressPage } from '../pages/addAddress/addAddress';//新增地址
import { CityDataProvider } from '../providers/city-data/city-data';//新增地址组件
import { BrandQueryPage } from '../pages/brandQuery/brandQuery';//牌号列表
import { LineUpPage } from '../pages/lineUp/lineUp';//排队页面 
import { MyaShipPage } from '../pages/myaShip/myaShip';//我的船舶
import { AddmyAShipPage } from '../pages/addmyAShip/addmyAShip';//新增船舶
import { AddShipperPage } from '../pages/addShipper/addShipper';//新增货主
import { ShipperSearchPage } from '../pages/shipperSearch/shipperSearch';//收货地址列表
import { PredictionDetails} from '../pages/predictionDetails/predictionDetails';//预报详情 个人预想 没有时间对接
import { MyMenuPage } from '../pages/myMenu/myMenu';//我的


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
    MechanicalPage,
    WelcomePage,
    KheightDriverPage,
    WoodMentionPage,
    DataRollbackListPage,
    ConsumerIndexPage,
    ConsumerListPage,
    SearchcomPage,
    PredictionPage,
    PersonSearchPage,
    AddAddressPage,
    BrandQueryPage,
    LineUpPage,
    MyaShipPage,
    AddmyAShipPage,
    AddShipperPage,
    ShipperSearchPage,
    PredictionDetails,
    MyMenuPage,
    TranslatePage
  ],
  imports: [
    PipesModule,
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    MultiPickerModule
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
    MechanicalPage,
    WelcomePage,
    KheightDriverPage,
    WoodMentionPage,
    DataRollbackListPage,
    ConsumerIndexPage,
    ConsumerListPage,
    SearchcomPage,
    PredictionPage,
    PersonSearchPage,
    AddAddressPage,
    BrandQueryPage,
    LineUpPage,
    MyaShipPage,
    AddmyAShipPage,
    AddShipperPage,
    ShipperSearchPage,
    PredictionDetails,
    MyMenuPage,
    TranslatePage
  ],
  providers: [
    HardwareBackButtonProvider,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler },
    ServiceProvider,
    SettingsProvider,
    Camera,
    File,
    FileTransfer,
    Session,
    Vibration,
    JPush,
    Device,
    Exception,
    AppVersion,
    FileOpener,
    FileTransferObject,
    Network,
    CityDataProvider,
    ImagePicker,
    PhotoViewer
  ]
})
export class AppModule {}
