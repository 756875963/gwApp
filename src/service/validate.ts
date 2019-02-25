import { returnReslut } from '../entity/returnReslut';
export const validate ={
    forVlidate:function(array:Array<any>){
        let returndata :returnReslut={
            reslut:null,
            Msg:null,
            flag:null
        };
        try{
            let _array = [],_arrayMsg=[],_flag=true;
            for(let obj of array) {
                let redata = this[String(obj.type+"Fnc")](obj);
                if(!redata.flag){
                    _flag = false;
                    _array.push(redata);
                    _arrayMsg.push(redata.name);
                }
            };
            returndata.reslut = _array;
            returndata.Msg = _arrayMsg.toString();
            returndata.flag = _flag;
        }catch(e){
             console.log(e);
        }
       return returndata;//返回指定格式对象；用于其他的类的调用的；
    },
    NumberFnc:function(obj){
       let _reg1 = /^(0|\+?[1-9][0-9]*)$/;
       let _reg2= /[\.]/;
       let _min = obj.min == undefined ? -Infinity : obj.min;
       let _max = obj.max == undefined ? Infinity : obj.max;
       let _toFixed = obj.toFixed == undefined ? true : obj.toFixed;
       let _flag = false;
       if(_min<obj.node&&obj.node<_max){
           if(_toFixed){
               if(_reg1.test(obj.node)&&!_reg2.test(String(obj.node))){
                  _flag = true;
               }
           }else{
                  _flag = true;
           }
       }
       return {name:obj.name,flag:_flag};
    },
    StringFnc:function(obj){
       let _validateFlag = obj.condition == undefined ? true : obj.condition
       let _flag = false;
       if(_validateFlag){
           if((obj.node != "" && obj.node != null)&&obj.node != 0) _flag = true;
       }else{
        _flag = true;
       }
       return {name:obj.name,flag:_flag}
    },
    TelephoneFnc:function(obj){
        let _reg1 = /^1(3|4|5|7|8)\d{9}$/;
        return {name:obj.name,flag:_reg1.test(obj.node)};
    }
}