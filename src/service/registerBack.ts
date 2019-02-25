import { ActionType } from '../service/const';
export  class registerBack{
    unregisterBackButtonAction: any;
    html;
    canLeave:boolean = false;
    exit:boolean = false;
    constructor(html){
        this.html = html;
    }
    public ionViewWillLeave() {
        // Unregister the custom back button action for this page
        if(ActionType.ENVIONMENT){
            this["unregisterBackButtonAction"] && this["unregisterBackButtonAction"]();
        }else{
             return;
        }
        
    }

    public BackButtonCustomHandler() {
        if(ActionType.ENVIONMENT){
            this["unregisterBackButtonAction"] && this["unregisterBackButtonAction"]();
            this["unregisterBackButtonAction"] = this["platform"].registerBackButtonAction(() => {
                this.BackButton();
            }, 10);
        }else{
            return;
        }
    }

    public BackButton(){
        // do what you need to do here ...
        try{
            if(this.html == "/index"||this.html == "/login"){
                this.exitFunction();
            }else{
                console.log("pop");
                this["navCtrl"].pop();
            }
        }catch(e){
            console.log(e);
        }
       
    }
   
    exitFunction() {
        let _that = this;
        if(_that.exit){
            this["platform"].exitApp();
        }else{
            this["toastCtrl"].create({
                message: '再按一次退出应用',
                duration: 2000,
                position: 'top'
            }).present();
        _that.exit = true;
        setTimeout(function(){
            _that.exit = false;
        },3000)}
   }
}