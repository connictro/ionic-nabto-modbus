import { Component } from '@angular/core';
import { App, NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { NabtoDevice } from '../../app/device.class';
import { NabtoService } from '../../app/nabto.service';
import { hexconvert } from './hexconvert';


declare var NabtoError;

class RegisterConfiguration {
  n: string; // 
  t: string; // type : number
  r: string;
  v: string; // final value of the item like temperature or humidity 
  f: string;
  slaveID: string;
  fc: string; //function code 
  o: string; // open switch 
  c: string; // close switch

}

class ModbusConfiguration {

  a: string;
  r: RegisterConfiguration[];
}


@IonicPage()
@Component({                                            //
  selector: 'page-modbus',                              // This is a CSS Selector to tell angular to create and insert an instance of this component wheerever it finds the corresponding 
  templateUrl: 'modbus.html'                            // tag in the template HTML. This tempate deinges the components host view.
})


export class ModbusPage {

  AlfredoSwitch = false;
  MexicanEggSwitch = false;
  ScentedLambSwitch = false;
  WalnutSwitch = false;

  registers: string[];
  registerMap: string[];
  
  configuration: ModbusConfiguration;
  
  device: NabtoDevice;
  deviceName: string;
  
  tempSensorIndex: string[];
  registerConfigurations: RegisterConfiguration[];

  busy: boolean;
  offline: boolean;
  timer: any;                                                     // when you are unsure of the datatype value 
  spinner: any;
  unavailableStatus: string;
  firstView: boolean = true;
  
  constructor(private navCtrl: NavController,
              private nabtoService: NabtoService,
              private toastCtrl: ToastController,
              private loadingCtrl: LoadingController,
              private navParams: NavParams,
              private modalCtrl: ModalController,
	      private app: App) {

    this.device = navParams.get('device');
    this.timer = undefined;
    this.busy = false;
  

  }

  

  ionViewDidLoad() {
    if(this.device == undefined || this.device == null) {
      this.navCtrl.setRoot('OverviewPage');  // .then(() => {this.navControl.popToRoot()});
      return;     
    }
    this.refresh();
    this.deviceName = this.device.name;
  }


    
  ionViewDidEnter() {

    if (!this.firstView) {
      this.refresh();
    } else {
      // first time we enter the page, just show the values populated
      // during load (to not invoke device again a few milliseconds
      // after load)
      this.firstView = false;
    }
  }

switchTapped(switchselection)
{




if (switchselection=='AlfredoSwitch')
{
  console.log("Entering AlfredoSwitch");

              if (this.AlfredoSwitch)
                  {
                    var convertedtoNumber=+this.registerConfigurations[2].slaveID;
                          this.switchSendModbusCommand(convertedtoNumber,this.registerConfigurations[2].fc,this.registerConfigurations[2].r,this.registerConfigurations[2].o, function(){console.log("Turned ON");}); 
                  }
              else 
                  {
                    var convertedtoNumber=+this.registerConfigurations[2].slaveID;
                    this.switchSendModbusCommand(convertedtoNumber,this.registerConfigurations[2].fc,this.registerConfigurations[2].r,this.registerConfigurations[2].c, function(){console.log("Turned OFF");}); 
                  }
 //AlfredoSwitch
//01 05 00 00 01 00 9d 9a
//01 05 00 00 00 00 9c 0a 
}
else if (switchselection=='MexicanEggSwitch')

{
  console.log("Entering MexicanEggSwitch");
            if (this.MexicanEggSwitch)
              {
                var convertedtoNumber=+this.registerConfigurations[3].slaveID;

                this.switchSendModbusCommand(convertedtoNumber,this.registerConfigurations[3].fc,this.registerConfigurations[3].r,this.registerConfigurations[3].o, function(){console.log("Turned ON");}); 
              }
          else 
              {
                var convertedtoNumber=+this.registerConfigurations[3].slaveID;
                this.switchSendModbusCommand(convertedtoNumber,this.registerConfigurations[3].fc,this.registerConfigurations[3].r,this.registerConfigurations[3].c, function(){console.log("Turned OFF");}); 
              }

//MexicanEggSwitch
// 01 05 00 01 01 00 6d 9a
// 01 05 00 01 00 00 6c 0a
}

else if (switchselection=='ScentedLambSwitch') {
  console.log("Entering ScentedLambSwitch");
//ScentedLambSwitch
// 01 05 00 02 01 00 3c 5a
// 01 05 00 02 00 00 3d ca 

          if (this.ScentedLambSwitch)
              {
                var convertedtoNumber=+this.registerConfigurations[4].slaveID;

                this.switchSendModbusCommand(convertedtoNumber,this.registerConfigurations[4].fc,this.registerConfigurations[4].r,this.registerConfigurations[4].o, function(){console.log("Turned ON");}); 
              }
          else 
              {
                var convertedtoNumber=+this.registerConfigurations[4].slaveID;
                this.switchSendModbusCommand(convertedtoNumber,this.registerConfigurations[4].fc,this.registerConfigurations[4].r,this.registerConfigurations[4].c, function(){console.log("Turned OFF");}); 
              }
}

else if (switchselection=='WalnutSwitch')
{
  console.log("Entering WalnutSwitch");
//WalnutSwitch
// 01 05 00 03 01 00 8d 9b 
// 01 05 00 03 00 00 8c 0b


    if (this.WalnutSwitch)
          { 
            var convertedtoNumber=+this.registerConfigurations[5].slaveID;
             this.switchSendModbusCommand(convertedtoNumber,this.registerConfigurations[5].fc,this.registerConfigurations[5].r,this.registerConfigurations[5].o, function(){console.log("Turned ON");}); 
            }
        else 
              {
                var convertedtoNumber=+this.registerConfigurations[5].slaveID;
                    this.switchSendModbusCommand(convertedtoNumber,this.registerConfigurations[5].fc,this.registerConfigurations[5].r,this.registerConfigurations[5].c, function(){console.log("Turned OFF");}); 
                }
  }





}
  refresh() {
    this.busyBegin();
    var self = this;
    this.nabtoService.invokeRpc(this.device.id, "modbus_configuration.json").
      then((state: any) => {   // Promises are objects that contain a reference to functions to call when something fails or succeeds.
                               // A PROMISE IS A PLACEHOLDER FOR FUTURE VALUE. state is a variable of type any 

        console.log('data:' + state.data);
        self.configuration = JSON.parse(state.data);

  self.registerConfigurations = self.configuration.r;
  console.log("JSON to Mapping on Variables "+ self.registerConfigurations);

  
  
	//console.log('configuration[a]:' + this.configuration.a);
        console.log('configuration[r].length:' + this.configuration.r.length);

	self.registerConfigurations.forEach(function (item:RegisterConfiguration, index) {    // calls a function for each element in the array 

            console.log("Register" + index + ":" + item.r);
                        if (index < 2){ 
    
                          var convertedtoNumber=+item.slaveID;
	            
                          self.readHoldingRegisterNumber(convertedtoNumber,item.r, (value:number)=> {
                            console.log("item.f="+item.f);
                                  if(typeof item.f === "undefined" || item.f == "") {
                                      item.v=""+value;
                                      } else {
                                                      if (value <= 1000)
                                                      {
                                                          var formatter = new Function('r', '"use strict"; return '+item.f);
                                                          item.v=""+formatter(value);

                                                      }
                                                      else 
                                                      {
                                                        value = 65536-value;

                                                        value=(value/10);
                                                        var formatter = new Function('r', '"use strict"; return '+item.f);
                                                        item.v="-"+formatter(value);
                                                        
                                                      }
                                              }
                              console.log("index:"+index);
                              console.log("Register:"+self.registerConfigurations[index].v);
                          
              
                                                                      }); 
           } });
	
	
        this.busyEnd();
	
      }).catch(error => {
        this.busyEnd();
        this.handleError(error);
      });
  }

  switchSendModbusCommand(address: number,fc: string,register: string, switch_STATE: string, callback: (data: string) => void) {

    var hexAddress = hexconvert.pad(hexconvert.dec2hex(address),2);
    console.log("hexAddress" + hexAddress);

    
    var modbusCmd = hexAddress + fc + register + switch_STATE; // hexconvert.pad(hexconvert.dec2hex(words),4);

    //console.log ("CHECK1: " + hexconvert.pad(hexconvert.dec2hex(words),4));
    //console.log ("CHECK2: " + hexconvert.pad(hexconvert.dec2hex(words),3));
    console.log("Modbus command:" + modbusCmd);

    
    this.nabtoService.invokeRpc(this.device.id, "modbus_function.json",
				{ "bus":0, "address":hexAddress, "data": modbusCmd}).
      then((state: any) => {

        console.log("data-before" + " " + state.data); // Complete Reading of the Response
      //  var temperature = state.data.substring(6,11);
        //console.log("Temperature:" + temperature);
        //var humidity = state.data.substring(10);
        //console.log("Humidity:" + humidity);



	 //var tmpStr = state.data.substring(6);
	//console.log("data:" + tmpStr);
	callback(state.data);

      }).catch(error => {
	console.log("ERROR:"+error);
        this.busyEnd();
        this.handleError(error);
      });
    
  }







  
  readHoldingRegisterNumber(address: number, register: string, callback: (data: number) => void) {
    var tmpfunc = (hexdata:string) => {
      console.log("hexdata:" + hexdata);

      var number = hexconvert.hex2dec(hexdata);
      console.log("Hexdata-dec:"+ number);
      callback(number);
    }
    this.readHoldingRegisters(address, register, 1, tmpfunc);
  }
    
  
  readHoldingRegisters(address: number, register: string, words: number, callback: (data: string) => void) {

    var hexAddress = hexconvert.pad(hexconvert.dec2hex(address),2);
    console.log("hexAddress" + hexAddress);
    
    
    var modbusCmd = hexAddress + "03" + register + hexconvert.pad(hexconvert.dec2hex(words),4); //words
      

    console.log ("CHECK1: " + hexconvert.pad(hexconvert.dec2hex(words),4));
    console.log ("CHECK2: " + hexconvert.pad(hexconvert.dec2hex(words),3));
    console.log("Modbus command:" + modbusCmd);

    
    this.nabtoService.invokeRpc(this.device.id, "modbus_function.json",
				{ "bus":0, "address":hexAddress, "data": modbusCmd}).
      then((state: any) => {

      
        console.log("data-before" + " " + state.data); // Complete Reading of the Response
        var temperature = state.data.substring(6,11);
        console.log("Temperature:" + temperature);
        var humidity = state.data.substring(10);
        console.log("Humidity:" + humidity);



	var tmpStr = state.data.substring(6); // only 6 here
	
	console.log("data:" + tmpStr);
	callback(tmpStr);

      }).catch(error => {
	console.log("ERROR:"+error);
        this.busyEnd();
        this.handleError(error);
      });
      
    
  }

  
  busyBegin() {
    if (!this.busy) {
      this.busy = true;
      this.timer = setTimeout(() => this.showSpinner(), 500);
    }
  }

  busyEnd() {
    this.busy = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }
    if (this.spinner) {
      this.spinner.dismiss();
      this.spinner = undefined;
    }
  }

  handleError(error: any) {
    console.log(`Handling error: ${error.code}`);
    if (error.code == NabtoError.Code.API_RPC_DEVICE_OFFLINE) {
      this.unavailableStatus = "Device offline";
      this.offline = true;
    } else {
      console.log("ERROR invoking device: " + JSON.stringify(error));
    }
    this.showToast(error.message);
  }

  

  showToast(message: string) {
    var opts = <any>{
      message: message,
      showCloseButton: true,
      closeButtonText: 'Ok',
      duration: 4000
    };
    let toast = this.toastCtrl.create(opts);
    toast.present();
  }
  
  showSpinner() {
    this.spinner = this.loadingCtrl.create({
      content: "Invoking device...",
    });
    this.spinner.present();
  }

  showSettingsPage() {
    this.navCtrl.push('DeviceSettingsPage', {
      device: this.device
    });
  }

  available() {
    return !this.offline;
  }

  unavailable() {
    return this.offline;
  }

  home() {
    this.navCtrl.popToRoot();
  }
  


}
