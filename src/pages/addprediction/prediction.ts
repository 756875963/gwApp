import { Component } from '@angular/core';
import { NavController ,ModalController ,ToastController ,LoadingController ,NavParams ,ActionSheetController } from 'ionic-angular';
import { PersonSearchPage } from '../../pages/personSearch/personSearch';
import { Camera ,CameraOptions } from '@ionic-native/camera';
import { FileTransfer ,FileUploadOptions ,FileTransferObject } from '@ionic-native/file-transfer';
import { ImagePicker ,ImagePickerOptions} from '@ionic-native/image-picker';
import { File } from '@ionic-native/file';
import { MyaShipPage } from '../../pages/myaShip/myaShip';//我的船舶
import { ShipperSearchPage } from '../../pages/shipperSearch/shipperSearch';//我的收货人地址 
import { ServiceProvider} from '../../service/http'; 
import { promises } from 'fs';
import { resolve } from 'path';
import { returnReslut } from '../../entity/returnReslut';
import { validate } from '../../service/validate';
import { ActionType } from '../../service/const';
import { PhotoViewer } from '@ionic-native/photo-viewer';
@Component({
  selector: 'page-prediction',
  templateUrl: 'prediction.html'
})
export class PredictionPage {
  path :string ="";//图片预览
  validate = validate;
  //新增预报对象
  prediction:any={
    sortId:"",//分类id
    goodsId:"",//商品名id
    id:"",
    barge_no:"",//预报编号
    barge_cn:"",//船名
    contacts:"",//联系人
    link_phone:"",//联系电话
    s_times:"",//艘次
    ship_ids:"",//船舶list
    rep_ti:"",//预计到港时间
    rep_ti1:"",//预计到港时间
    owener:"",//货主
    shippernumber:"",//货主联系电话
    cargo_t_key:"",//货类
    cargo_n_key:"",//货名
    cargo_wei:"",//货物重量
    work_type:"1",//作业类型 
    consignee:"",//收货人
    consigneeNumber:"",//收货人电话
    consignee_address:"",//收货地址
    bz:"无要求",
    owener_key:"",//货主id
    consignee_key:"",//收货人id
    flag: false,
    shiplist:new Array(),//船集合;
    pictureList: new Array() //照片list
  }
  cargoClasslist:Array<any>=[//货类集合
    {id:"1",dict_name:"袋1",cargoNameList:[
      {cargoNameId:"11",name:"袋1-1"},
      {cargoNameId:"12",name:"袋1-2"},
      {cargoNameId:"13",name:"袋1-3"},]
    },
    {id:"2",dict_name:"袋2",cargoNameList:[
      {cargoNameId:"21",name:"袋2-1"},
      {cargoNameId:"22",name:"袋2-2"},
      {cargoNameId:"23",name:"袋2-3"},]
    }
  ]
  pictureList:Array<any>;
  shiplist:Array<any> = [];//船舶列表
  cargoNameList:Array<any> = [];//货名集合
  item:any="";
  fileTransfer: FileTransferObject = this.transfer.create();
  
  
  constructor(public navCtrl: NavController,
              public modalC :ModalController,
              public service: ServiceProvider,
              public toastController : ToastController,
              public loadingController : LoadingController,
              public navParams : NavParams,
              private camera: Camera,
              private transfer: FileTransfer, 
              private file: File,
              private imagePicker: ImagePicker,
              public actionSheetCtrl: ActionSheetController,
              private photoViewer: PhotoViewer
    ) {
                this.item = this.navParams.get("item");            
                let loading = this.presentLoadingDefault();
                Promise.all([new Promise((reslove,reject)=>{
                  this.service.createPrediction({}).then(data=>{
                    if(data["ok"]){
                      //初始化赋值
                      this.prediction.barge_no = data["data"].barge.barge_no;
                      this.prediction.id = data["data"].barge.id;
                      this.prediction.link_man =  data["data"].user.username;
                      this.prediction.link_phone = data["data"].user.telphone;
                      console.log(this.prediction.id);
                      reslove(data);
                    }else{
                      this.presentToast(data["msg"]);
                      reject(data);
                    }
                       
                  }).catch(data=>{
                      reject(data);
                  })
                }),new Promise((reslove,reject)=>{
                    this.service.cargoTypeCargoNames({}).then(data=>{
                        if(data["ok"]){
                           reslove(data);
                        }else{
                           reject(data);
                        }
                    }).catch(data=>{
                           reject(data);
                    })     
                })]).then(data=>{
                   //0 创建预报主键 1 货类数组
                   loading();
                   this.cargoClasslist = data[1]["data"].goodstypes;
                   if(this.item.flag==1){
                     this.prediction = JSON.parse(this.item.data.json);
                     console.log(this.prediction);
                     this.shiplist = this.prediction.shiplist;
                  }else{
  
                  }
                }).catch(data=>{
                  loading();
                  console.log(data);
                });
                
              console.log("初始化");

  }
  cargoClassChange(){//货类选中事件
    console.log("货类选中事件");
    console.log(this.prediction.sortId);
    for(let item of this.cargoClasslist){
      if(item.id == this.prediction.cargo_t_key){
          this.cargoNameList = item.goodsNames;
          break;
      }
    }
  }
  cargoNameChange(){//货名选中事件
    console.log("货名选中事件");
    console.log(this.prediction.goodsId);
  }
  shipperhref(){//货主跳转
    let modal = this.modalC.create(PersonSearchPage,{item:{
        htmlType:"请选择货主",
        callback:this,
        flag:1}
      });
    modal.present();
  }
  callback(data){
    console.log(data);
    this.prediction.owener = data.shipper.com_legal_person;
    this.prediction.shippernumber = data.shipper.phone;
    this.prediction.owener_key = data.shipper.id;
    this.prediction.consignee = data.address.name;
    this.prediction.consigneeNumber = data.address.phone;
    this.prediction.consignee_address = data.address.address+data.address.detail_address;
    
  }
  goback(){
    this.navCtrl.pop();
  }
  myAShip(){//跳转我的船舶
      if(this.prediction.rep_ti1==""||this.prediction.rep_ti1==null){
         this.presentToast("请选择预计到港时间");
      }else{
        this.prediction.rep_ti = this.prediction.rep_ti1.replace(/T|Z/g,' ');
        let modal = this.modalC.create(MyaShipPage,{item:this.prediction.barge_no,id:this.prediction.id,callback:this,rep_ti:this.prediction.rep_ti});
        modal.present();
      }
     
  }
  shipcallback(data:Array<any>){//船舶回调方法
    console.log(data);
    this.prediction.shiplist = this.shiplist = data;
    let str = [];
    for(let item of this.shiplist){
       str.push(item.barge_cn)
    }
    this.prediction.ship_ids = str.toString();
    console.log(data.length);
    this.prediction.s_times = data.length//艘次
    let _cargoWeight:number = 0;// 重量合计
    for(let item of data){
      _cargoWeight = Number((_cargoWeight+parseFloat(item.cargo_wei)).toFixed(2));
    }
    this.prediction.cargo_wei = _cargoWeight;
    console.log(_cargoWeight);
  }

  presentToast(message,pop:any = data=>{}) {
    let toast = this.toastController.create({
      message: message,
      duration: 2000,
      position: 'middle',
      cssClass:"margin25"
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
      pop();
    });
    toast.present();
  }
  presentLoadingDefault(msg="数据加载中，请稍等！") { 
    //统一加载处理css 效果组件；
    let loading = this.loadingController.create({
      content:msg
    });
    loading.present();
    return ()=>{
      loading.dismiss()
    };
  }
  addresshref(){//选中收货人地址；
    console.log("选中收货人地址");
    if(this.prediction.owener_key!=""){
      let modal = this.modalC.create(ShipperSearchPage,{
        item:{data:this.prediction,callback:this,flag:2,htmltype:"请选择收货人"}});
      modal.present();
    }else{
       this.presentToast("请选择货主姓名！");
    }
    
  }
  callbackFunction(data){
    console.log(data);
    this.prediction.consignee_key = data.id;
    this.prediction.consignee = data.name;
    this.prediction.consigneeNumber = data.phone;
    this.prediction.consignee_address = data.address + data.detail_address;

  }
  submit(){//提交预报;
    let _valdate:returnReslut = 
    validate.forVlidate(
    [
      {name:"船队名",node:this.prediction.barge_cn,type:"String",condition:false},
      {name:"船舶",node:this.prediction.ship_ids,type:"String",condition:true},
      {name:"预计到港时间",node:this.prediction.rep_ti1,type:"String",condition:true},
      {name:"货主",node:this.prediction.owener,type:"String",condition:true},
      {name:"货类",node:this.prediction.cargo_t_key,type:"String",condition:true},
      {name:"货名",node:this.prediction.cargo_n_key,type:"String",condition:true},
      {name:"收货人",node:this.prediction.consignee,type:"String",condition:true},
      {name:"卸货要求",node:this.prediction.bz,type:"String",condition:true}
    ])
    console.log(_valdate);
    this.prediction.rep_ti = this.prediction.rep_ti1.replace(/T|Z/g,' ');
    this.prediction.flag = this.item.flag_i;
    if(_valdate.flag){
        this.service.editShipPrediction({submitresult:JSON.stringify(this.prediction)}).then(data=>{
          this.presentToast(data["msg"],data=>{

            this.navCtrl.pop().then(data=>{
              this.item.callback.ionViewDidEnter();
            });
          });
         
        }).catch(data=>{

        })
    }else{
      this.presentToast(_valdate.Msg+"，输入有误！");

    }
  }
  cargoNameChange1(){
    //判断船集合是否为空
    try{
      this.prediction.rep_ti = this.prediction.rep_ti1.replace(/T|Z/g,' ');
      if(this.shiplist.length>0&&this.prediction.rep_ti1!=""){
        this.service.editRepTi({search:JSON.stringify({
          rep_ti:this.prediction.rep_ti,
          shiplist:this.shiplist,
          id:this.prediction.id
       })}).then(data=>{
         console.log(data);
         if(data["ok"]){
            if(data["data"].records.length>0){
              this.prediction.rep_ti1 = "";
               let _str = "";
               for(let item of data["data"].records){
                _str += item.name_cn + ",";
               }
               _str = _str.replace(/,$/gi,"");
               this.presentToast(_str+"("+data["data"].records.length+"艘）不能在24小时加入预报！");
            }
         }else{
            this.presentToast("系统出错！");
         }
       }).catch(data=>{
         console.log(data);
       });
      }
    }catch(e){
       e;
    }
  }
  photoClick(){//照片拍照
    console.log("拍照");
    //this.openCamera();
    this.presentActionSheet();
    //this.addpicture();
  }
  /**
   * 打开摄像头
   */
  /**
   * 打开摄像头
   */
  openCamera(flag:boolean=true) {
    const options: CameraOptions = {
      quality: 90,                                                   //相片质量 0 -100
      destinationType: this.camera.DestinationType.DATA_URL,        //DATA_URL 是 base64   FILE_URL 是文件路径
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: true,   
      //allowEdit :true,    
      targetWidth:800,
      targetHeight:800,
      sourceType : flag? this.camera.PictureSourceType.PHOTOLIBRARY : this.camera.PictureSourceType.CAMERA                                 //是否保存到相册
      // sourceType: this.camera.PictureSourceType.CAMERA ,         //是打开相机拍照还是打开相册选择  PHOTOLIBRARY : 相册选择, CAMERA : 拍照,
    }

    this.camera.getPicture(options).then((imageData) => {
      console.log("got file: " + imageData);

      // If it's base64:
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.path = base64Image;

      //If it's file URI
      // this.path = imageData;

      this.upload1();

    }, (err) => {
      // Handle error
    });
  }
  /**
   * 文件上传
   */
  upload1() {
    
    const apiPath = ActionType.URL+"/mobile/frontend/sfileUpload/customUpload/"+ActionType.VERSION;//+ stringify({access_token: this.access_token});
    let options: FileUploadOptions = {
      fileKey: 'file',
      fileName: 'name.jpg',   //文件名称
      headers: {},
      // 如果要传参数，写这里
      params: {
        maxSize: 5000000,
        modularName: 'CNL',
        allowType: 'jpg;png;pdf;doc;xls;xlsx;docx',
      }
    };
    let loading = this.presentLoadingDefault("图片上传中...");
    this.fileTransfer.upload(this.path, apiPath, options)
      .then((data)=> {
       let IMGURL = ActionType.IMGURL + JSON.parse(data.response).data.data.relativefilepath +"/"+ JSON.parse(data.response).data.data.newfilename;
       this.prediction.pictureList.push({path:IMGURL,id:JSON.parse(data.response).data.data.id});
       console.log(JSON.parse(data.response));
       loading();
      }, (err) => {
        console.log(err);
        this.presentToast(err);
      });
    // this.service.commons({userName:1,passWord:2}).then(
    //   (obj)=>{
    //     console.log(obj);
    //   }
    // )

    
  }
  addpicture(){//相册上传接口
    console.log("图片上传事件");
    const imagePickerOpt:ImagePickerOptions= {
      maximumImagesCount: 1,//选择一张图片
      width: 800,
      height: 800,
      quality: 80
    };
    this.imagePicker.getPictures(imagePickerOpt).then((results) => {
      console.log('Image URI: ' + results);
      // for (var i = 0; i < results.length; i++) {
      //     console.log('Image URI: ' + results[i]);
      //     alert(JSON.stringify(results[i]));
      // }
    }, (err) => { });

  }
  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: '请选择上传路径',
      buttons: [
        {
          text: '相册选取',
          role: 'destructive',
          handler: () => {
             this.openCamera(true);
          }
        },
        {
          text: '相机拍摄',
          cssClass:'d_12khj',
          handler: () => {
            this.openCamera(false);
          }
        },
        {
          text: '关闭',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
 
    actionSheet.present();
  }
  removePicture(index){//删除图片
    this.prediction.pictureList.splice(index,1);
  }
  showPicture(URL:string){//预览图片
    console.log(URL);
    this.photoViewer.show(URL);
  }
}
