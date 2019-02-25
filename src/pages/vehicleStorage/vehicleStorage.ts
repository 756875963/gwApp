import { Component } from '@angular/core';
import { NavController ,NavParams ,ToastController ,Events} from 'ionic-angular';
import {ListPage} from '../list/list';
import { Camera ,CameraOptions } from '@ionic-native/camera';
import { FileTransfer ,FileUploadOptions ,FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { stringify } from 'qs';
import { ServiceProvider } from '../../service/http';
import { ActionType } from '../../service/const';
import { photo } from '../../entity/photo';
import { lSe } from '../../public/localstorage';
import { CodeSheetPage } from '../codeSheet/codeSheet';
import { pageBean } from '../../entity/pageBean';
import { registerBack } from "../../service/registerBack";

@Component({
  selector: 'page-vehicleStorage',
  templateUrl: 'vehicleStorage.html'
})
export class vehicleStoragePage extends registerBack {
  totalNumber :number;//总件数
  carNumber :string;//车辆
  cid:string;//车辆id
  measure_average :number;//平均方值
  agoindex :number =null;//修改时记录上个数据的坐标位置
  firstLevelMenuFlag :number=0;//一级当前标记
  deleteFlag :boolean = true;//删除按钮显示标记
  index :number =null;//失去焦点下标
  operation :object =null;//操作数据
  updateOperation :object =null;//修改参数
  flex_mode :Boolean = true;//模态框显示标记
  Sawingchecked :Boolean = false;//锯断标记
  Tiechecked :Boolean = false;//打结标记
  pilefoot :string = "";//桩脚
  partnumber :string = "";//件号
  Length  :string = "";//长度
  diameter :string ="";//直径
  path :string ="";//图片预览
  picture :string ="name.jpg";//上传图片返回的图片名称
  id:string="";//form表主键
  saveflag:boolean = true;//保存为true，删除为false
  rational_id :string="";//理货表ID
  goods_detail_id:string="";//库存详情id
  clickflag:boolean=false;//自动匹配是否成功
  updateflag:boolean=false;//单根木头，是否是修改提交
  //access_token: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsiYXBpLXJlc291cmNlIl0sInVzZXJfbmFtZSI6ImFkbWluIiwic2NvcGUiOlsicmVhZCIsIndyaXRlIiwidHJ1c3QiXSwiZXhwIjoxNTA5MTk2OTcyLCJhdXRob3JpdGllcyI6WyJST0xFX1VTRVIiXSwianRpIjoiOWFmYmIyYWItMzdiYi00MTIyLTg2NDAtY2FmMDc1OTRmOGZkIiwiY2xpZW50X2lkIjoiY2xpZW50MiJ9.bJOpK0UjCI1ym32uerR_jKp4pv8aLaOxnTeK_DBjYZU';
  fileTransfer: FileTransferObject = this.transfer.create();
  list1 :Array<any> =[
    {id:1,flag:true},
    {id:2,flag:false},
    {id:3,flag:false},
    {id:4,flag:false},
    {id:5,flag:false},
    {id:6,flag:false},
    {id:7,flag:false},
    {id:8,flag:false},                                                                         
    {id:9,flag:false},
    {id:10,flag:false}
    
  ];
  list2 :Array<any> =[
     [{id:1,text:""},{id:2,text:""},{id:3,text:""},{id:4,text:""},{id:5,text:""},{id:6,text:""},{id:7,text:""},{id:8,text:""},{id:9,text:""},{id:10,text:""}],
     [{id:1,text:""},{id:2,text:""},{id:3,text:""},{id:4,text:""},{id:5,text:""},{id:6,text:""},{id:7,text:""},{id:8,text:""},{id:9,text:""},{id:10,text:""}],
     [{id:1,text:""},{id:2,text:""},{id:3,text:""},{id:4,text:""},{id:5,text:""},{id:6,text:""},{id:7,text:""},{id:8,text:""},{id:9,text:""},{id:10,text:""}],
     [{id:1,text:""},{id:2,text:""},{id:3,text:""},{id:4,text:""},{id:5,text:""},{id:6,text:""},{id:7,text:""},{id:8,text:""},{id:9,text:""},{id:10,text:""}],
     [{id:1,text:""},{id:2,text:""},{id:3,text:""},{id:4,text:""},{id:5,text:""},{id:6,text:""},{id:7,text:""},{id:8,text:""},{id:9,text:""},{id:10,text:""}],
     [{id:1,text:""},{id:2,text:""},{id:3,text:""},{id:4,text:""},{id:5,text:""},{id:6,text:""},{id:7,text:""},{id:8,text:""},{id:9,text:""},{id:10,text:""}],
     [{id:1,text:""},{id:2,text:""},{id:3,text:""},{id:4,text:""},{id:5,text:""},{id:6,text:""},{id:7,text:""},{id:8,text:""},{id:9,text:""},{id:10,text:""}],
     [{id:1,text:""},{id:2,text:""},{id:3,text:""},{id:4,text:""},{id:5,text:""},{id:6,text:""},{id:7,text:""},{id:8,text:""},{id:9,text:""},{id:10,text:""}],
     [{id:1,text:""},{id:2,text:""},{id:3,text:""},{id:4,text:""},{id:5,text:""},{id:6,text:""},{id:7,text:""},{id:8,text:""},{id:9,text:""},{id:10,text:""}],
     [{id:1,text:""},{id:2,text:""},{id:3,text:""},{id:4,text:""},{id:5,text:""},{id:6,text:""},{id:7,text:""},{id:8,text:""},{id:9,text:""},{id:10,text:""}]
    ];
    listActive :Array<any> =[
      {id:1,text:"",index:""},
      {id:2,text:"",index:""},
      {id:3,text:"",index:""},
      {id:4,text:"",index:""},
      {id:5,text:"",index:""},
      {id:6,text:"",index:""},
      {id:7,text:"",index:""},
      {id:8,text:"",index:""},
      {id:9,text:"",index:""},
      {id:10,text:"",index:""}
    ];
  constructor(public navCtrl: NavController,public navParams:NavParams,
    private camera: Camera,
    private transfer: FileTransfer, private file: File,
    public service:ServiceProvider,
    public toastController :ToastController,
    public events :Events) {
      super("/vehicleStorage");
    console.log("yard_id",this.navParams.get("item"));//任务列表跳转过来带的参数
    //if(lSe.getItem("vehicleStorage")!=""&&lSe.getItem("vehicleStorage")!=null) this.list2 = lSe.getItem("vehicleStorage");//判断本地是否有存储；
     //车号赋值
     this.carNumber = this.navParams.get("item").carno;
     //车id
     this.cid= this.navParams.get("item").cid;
     //理货表ID,如果是回退就有值
     this.rational_id= this.navParams.get("item").rational_id;
     console.log('ra'+this.rational_id)
     //平均方赋值
     this.measure_average = this.navParams.get("item").measure_average
    //进入页面，获取一层数据
    this.getFloorData(true);
    //console.log(lSe.getItem("Codesheet"));
    //设置数据回调不可读
    //lSe.setItem("vehicledata",{read:false});
    //二维数组装入本地存储中
    //lSe.setItem("vehicleStorage",this.list2);//存入本地存储

    //初始化当前选中状态和数据显示
    let Active_index=0;
    for(let i=0;i<this.list1.length;i++){
      if(this.list1[i].flag){
        Active_index = i;
        this.firstLevelMenuFlag=i;
        break;
      }
    }
    //this.listActive = lSe.getItem("vehicleStorage")[Active_index];

   


  }
  openPage(){
    this.navCtrl.push(ListPage, { item12: "丁伟" });
  }
  firstLevelMenu(item){
    console.log(item);
    for(let i=0;i<this.list1.length;i++){
      if(item.id==this.list1[i].id){
        this.list1[i].flag = true;
        this.firstLevelMenuFlag = i;
        //console.log(this.firstLevelMenuFlag=this.firstLevelMenuFlag+1);
      }else{
        if(this.list1[i].flag){
          this.list1[i].flag = false;
        }
      }
    }
    this.getFloorData(false);
  }
  twoLevelMenu(item){
    console.log(item);
    if(item["text"]!=""){
      this.partnumber =item["partnumber"];
      this.Sawingchecked=item["Sawingchecked"]==0?false:true;
      this.Tiechecked=item["Tiechecked"]==0?false:true;
      this.pilefoot=item["pilefoot"];
      this.Length=item["Length"];
      this.diameter=item["diameter"];
      this.picture=item["picture"];
      this.path = item["picture"];
      this.deleteFlag =false;
      this.updateflag=true;
      this.clickflag=true;
      this.goods_detail_id=item["goods_detail_id"];
      //
      //this.blurInput("delete");
      this.updateOperation={
        partnumber:item["partnumber"],
        pilefoot:item["pilefoot"],
        index:item["index"]
      };
    }else{
      this.updateflag=false;
    }
    console.log(this.updateflag)
    this.flex_mode = false;
    this.operation = item;
  }
  addTwoLevelMenu(){//选中当前层的一个行数据新增一个列
    this.listActive[this.listActive.length] ={id:this.listActive.length+1,text:""};
  }
  qiaokaoflag(event){
    console.log(event);
  }
  submit(){//表单提交
    console.log(this.Sawingchecked);
    console.log(this.Tiechecked);
    //长度直径通过匹配
    if(this.clickflag){
      let obj = {};
      obj["id"] ="";
      obj["partnumber"] =this.partnumber;
      obj["Sawingchecked"] =this.Sawingchecked?1:0;
      obj["Tiechecked"] =this.Tiechecked?1:0;
      obj["pilefoot"] =this.pilefoot;
      obj["Length"] =this.Length;
      obj["diameter"] =this.diameter;
      obj["picture"] =this.picture;
      obj["text"] =this.pilefoot+"#"+this.partnumber;//#拼接
      obj["rational_id"]=this.rational_id;
      obj["cid"]=this.cid;
      obj["carno"]=this.carNumber;
      obj["floor"]=this.firstLevelMenuFlag;//层
      obj["goods_detail_id"]=this.goods_detail_id;
      obj["yard_no"]=this.navParams.get("item").toppingsnumber;//出库单号
      obj["updateflag"]=this.updateflag;
      let i=0;
      for(i=0;i<this.listActive.length;i++){
        if(this.listActive[i].id==this.operation["id"]){
          console.log(this.listActive[i],this.operation);
          obj["id"] = this.listActive[i].id;
          obj["index"] = this.index;
          this.listActive[i] = obj;
          console.log(i);
        }
        this.sort();
      
      } 
      console.log(this.listActive)
      obj["position_no"]=i+1;   //本层的位置  
      obj["jsonstr"]=JSON.stringify(this.listActive);//本层的json数据
      console.log(obj["jsonstr"]);
      obj["saveflag"]=this.saveflag;
      console.log(obj);
      this.http4({formdata:JSON.stringify(obj)}).then(data=>{
        console.log(data);

        // if(data["msg"]=="该数据不能重复添加"){
        //      this.presentToast(data["msg"]);
        // }else{
          
        // }
        
       }).catch(data=>{
       });
      
      this.flex_mode = true;
      this.empty();
      this.updateOperation=null;
    }else{
      this.presentToast("请先匹配长度、直径");
    }
      
  }
  photoClick(){//照片拍照
    console.log("拍照");
    alert("拍照");
    this.openCamera();
  }
  /**
   * 打开摄像头
   */
  openCamera() {
    const options: CameraOptions = {
      quality: 90,                                                   //相片质量 0 -100
      destinationType: this.camera.DestinationType.DATA_URL,        //DATA_URL 是 base64   FILE_URL 是文件路径
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: true,   
      //allowEdit :true,    
      targetWidth:800,
      targetHeight:800,
      sourceType : this.camera.PictureSourceType.CAMERA                                 //是否保存到相册
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
    this.presentToast("dddd");
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
   // alert(1);
    this.fileTransfer.upload(this.path, apiPath, options)
      .then((data)=> {
        this.picture = ActionType.IMGURL + JSON.parse(data.response).data.data.relativefilepath +"/"+ JSON.parse(data.response).data.data.newfilename;
       
        //this.operation["picture"] //alert(2);
       // console.log(obj.lf);
       //this.presentToast(obj["data"].data);
       //this.Length = "1";
        //alert(JSON.stringify(data));
        //alert(JSON.parse(data.response.replace("\\","")).data.data);
        //this.presentToast(JSON.parse(obj.response).data);
     
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
  presentToast(message) {
    let toast = this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top',
      cssClass:"margin25"
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    toast.present();
  }
  blurInput(str){//失去焦点事件
    // pilefoot :string = "";//桩脚
    //partnumber :string = "";//件号
    console.log(this.operation)
        this.service.mapping({
          pilefoot:this.pilefoot,
          partnumber:this.partnumber,
          yard_no:this.navParams.get("item").toppingsnumber,
          carno:this.carNumber,
          rational_id:this.rational_id,
          updateflag:this.updateflag,
          id:this.operation["id"],
          floor:this.firstLevelMenuFlag
        }).then(data=>{
          this.clickflag=data["data"].clickflag;
          //如果返回数据重复  false
          console.log(data["data"].clickflag);
          if(!data["data"].clickflag){ 
            //console.log(data["msg"])       
            this.presentToast(data["msg"]);
            this.pilefoot="";
            this.partnumber="";
          }else{
            this.goods_detail_id=data["data"].pGoodsDetailExtend.id;
            if(data["data"].is_has){//如果有匹配的数据
              this.Length=data["data"].pGoodsDetailExtend.length;
              this.diameter=data["data"].pGoodsDetailExtend.diameter;
            } 
          }
            
            //data["data"].pGoodsDetailExtend.text=data["data"].pGoodsDetailExtend.Pilefoot+"#"+data["data"].pGoodsDetailExtend.Partnumber;
            //this.listActive.push(data["data"].pGoodsDetailExtend);
        }).catch(data=>{

        })
   
  }
  manual_Testing(){
    
  }
  focusInput(obj){
    this.Length = "";
    this.diameter = "";
    if(obj=="pilefoot"){
    }else{
    }
  }
  empty(){ //清空数据
    this.Sawingchecked = false;//锯断标记
    this.Tiechecked  = false;//打结标记
    this.pilefoot  = "";//桩脚
    this.partnumber  = "";//件号
    this.Length   = "";//长度
    this.diameter  ="";//直径
    this.path  ="";//图片预览
    this.picture  ="name.jpg";//上传图片返回的图片名称  临时  name.jpg;
  }
  close(){//关闭模态框
    this.flex_mode = true;
    this.empty();
    this.deleteFlag=true;
    this.updateOperation =null;
  }

  sort(){//排序
    let array = this.listActive;
    let array1 =[];
    let array2 =[]; 
    for(let i=0,j=0,k=0;i<array.length;i++){
       if(array[i].text!=""){
          array1[j++] = array[i];
       }else{
          array2[k++] = array[i];
       }
    }
    this.listActive =array1.concat(array2);

  }

  delete(obj){//删除数据
    if(obj==undefined) return;
     let array = this.listActive;
     console.log(obj);
     for(let i=0;i<array.length;i++){
      if(obj.partnumber==array[i].partnumber){
        console.log(array[i]["index"]);
        array[i] ={text:"",id:array[i]["id"]};
        break;
      }
     }    
     this.sort();
     this.close();
     obj["saveflag"]=false;
     obj["jsonstr"]=JSON.stringify(this.listActive);//本层的json数据
     obj["rational_id"]=this.rational_id;
     //let array1 = lSe.getItem("Codesheet");
     this.http6({formdata:JSON.stringify(obj)}).then(data=>{
      console.log(data);
      // if(data["msg"]=="该数据不能重复添加"){
      //      this.presentToast(data["msg"]);
      // }else{
        
      // }
     }).catch(data=>{
     });
     
  }
  imgload(event){
     console.log(event);//计算图片自适应高度 
  }
  save(){//页面数据保存 跳转页面
    console.log(111);
    this.http7({rational_id:this.rational_id,carno:this.carNumber,cid:this.cid,yard_no:this.navParams.get("item").toppingsnumber}).then(data=>{
      console.log(data);
      this.navCtrl.pop().then(() => {
        // 发布 bevents事件
        this.events.publish('_TOTALCALCULATE', JSON.stringify({numL:data["data"].num,texts:data["data"].text}));
        });
      //this.navCtrl.pop();
      // if(data["msg"]=="该数据不能重复添加"){
      //      this.presentToast(data["msg"]);
      // }else{
        
      // }
     }).catch(data=>{
     });
    
  }
  goto_CodeSheetPage(){
    //接受出库单编号
    let number = 1000; 
    this.navCtrl.push(CodeSheetPage,{item:number});
  }
  totalCalculate(){
    let _num = 0;
    for(let i=0;i<this.list2.length;i++){
       for(let j=0;j<this.list2[i].length;j++){
           if(this.list2[i][j].text!=""){
                _num=_num+1;
           }else{
                break;
           }
       }
    }
    return _num ;
  }
  //
  getFloorData(obj){
     //请求数据库查询当前层级数据
     this.http5({firstflag:obj,yard_no:this.navParams.get("item").toppingsnumber,rational_id:this.rational_id,
     floor:this.firstLevelMenuFlag,carno:this.carNumber}).then(data=>{
      console.log(data); 
      if(data["data"].pWoodCarStarts==null){
        this.listActive =[
          {id:1,text:"",index:""},
          {id:2,text:"",index:""},
          {id:3,text:"",index:""},
          {id:4,text:"",index:""},
          {id:5,text:"",index:""},
          {id:6,text:"",index:""},
          {id:7,text:"",index:""},
          {id:8,text:"",index:""},
          {id:9,text:"",index:""},
          {id:10,text:"",index:""}
        ]
      }else{
         if(JSON.parse(data["data"].pWoodCarStarts).length<10){
          this.listActive = JSON.parse(data["data"].pWoodCarStarts).concat([
              {id:1,text:"",index:""},
              {id:2,text:"",index:""},
              {id:3,text:"",index:""},
              {id:4,text:"",index:""},
              {id:5,text:"",index:""},
              {id:6,text:"",index:""},
              {id:7,text:"",index:""},
              {id:8,text:"",index:""},
              {id:9,text:"",index:""},
              {id:10,text:"",index:""}
            ].slice(JSON.parse(data["data"].pWoodCarStarts).length+1,10))
         }else{
            this.listActive=JSON.parse(data["data"].pWoodCarStarts);
         }
      }
      
      //根据返回的json数据回显当前层数据
      // if(data["msg"]=="并单记录不存在"){
      //      this.presentToast(data["msg"]);
      // }else{
      //   //处理数据
      //   for(let i=0;i<data["data"].bill_list.length;i++){
      //     data["data"].bill_list[i] = Object.assign(data["data"].bill_list[i],{flag:false});
      //   }
      //   lSe.setItem("Codesheet",data["data"].bill_list);//存入本地存储
      // }
      
     }).catch(data=>{
     });
  }
  async http3(obj){//获取码单数据
    return  await new Promise((resolve, reject) => {
       this.service.getWeightSheet(obj).then(
         (obj:pageBean) =>{
           resolve(obj);
         }
       ).catch(
         obj=>{
           console.log(obj);
         }
       );
     })
  }
  async http4(obj){//装车 保存，单根木头
    return  await new Promise((resolve, reject) => {
       this.service.saveVehicleStorage(obj).then(
         (obj:pageBean) =>{
           resolve(obj);
         }
       ).catch(
         obj=>{
           console.log(obj);
         }
       );
     })
  }
  async http5(obj){//获取每一层的数据
    return  await new Promise((resolve, reject) => {
       this.service.getWoodCar(obj).then(
         (obj:pageBean) =>{
           resolve(obj);
         }
       ).catch(
         obj=>{
           console.log(obj);
         }
       );
     })
  }
  async http6(obj){//删除单根木头数据
    return  await new Promise((resolve, reject) => {
       this.service.deleteWoodCar(obj).then(
         (obj:pageBean) =>{
           resolve(obj);
         }
       ).catch(
         obj=>{
           console.log(obj);
         }
       );
     })
  }
  async http7(obj){//中间层级保存，获取整个装车的数量和text整合
    return  await new Promise((resolve, reject) => {
       this.service.modelSaveWoodCar(obj).then(
         (obj:pageBean) =>{
           resolve(obj);
         }
       ).catch(
         obj=>{
           console.log(obj);
         }
       );
     })
  }
  ionViewDidEnter(){
    super.BackButtonCustomHandler();
  }
  ionViewWillLeave(){
    super.ionViewWillLeave && super.ionViewWillLeave();
  }
}
