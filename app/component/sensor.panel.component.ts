import { Component, ViewChild, Output, EventEmitter, } from '@angular/core';
import { Http, Response, Headers,URLSearchParams, RequestOptions } from '@angular/http';
import { ModalDirective } from 'ng2-bootstrap/components/modal/modal.component';
import { Observable} from 'rxjs/Rx';

@Component({
	selector: 'sensor',
	template: `

	<div bsModal #lgModal="bs-modal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
	<div class="vertical-alignment-helper modal-dialog modal-lg">
	<div class="modal-dialog vertical-align-center">
	<div class="modal-content">
	<div class="modal-body" id="modal-body">
	<h4 class="modal-title" id="title">Change Sensor</h4><br>

	<i class="fa fa-cogs" aria-hidden="true"></i> <input type="text" placeholder="Device MAC" aria-describedby="sizing-addon2" id="input1" value="5c7f8702cfff0"><br>
	<br>
	<div id="crop">
	<img src="img/waiting-respond.gif" alt="loading" id="waiting-respond"/>
	</div>
	<div id="error-log" class="alert alert-danger" style="display:none"></div>
	<div id="success-log" class="alert alert-success" style="display:none"></div>
	<br>
	<div style="display:block;margin:0 auto;text-align:center;">
	<button type="submit" class="btn btn-success" id="btn-success" (click) = "login()">Change</button>
	<button type="button" class="btn btn-danger" id="btn-danger" (click)="hideLgModal()">Close</button>
	</div>
	</div>
	</div>
	</div>
	</div>	
	</div>`,
	providers: []
})
export class Sensor{	
	private sensorURL = 'https://iot-project-metropolia.eu-gb.mybluemix.net/api/group_1/device/login';
	private token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiR1JPVVBfMSIsImFkbWluIjp0cnVlfQ.eKvUFe2OdsnZUfee8Xoi_vHixDOzs2rchkIFaegHE4E";
	constructor(private http: Http){

	}

	@ViewChild('lgModal')
	lgModal:ModalDirective;

	/**
	 * [showLgModal reset the modal]
	 * @param {number} _param [description]
	 */
	 showLgModal(_param:number) {
	 	document.getElementById("btn-success").style.display = "inline-block";
	 	document.getElementById("btn-danger").style.display = "inline-block";
	 	document.getElementById("error-log").style.display = "none";
	 	document.getElementById("success-log").style.display = "none";
	 	document.getElementById("crop").style.height = '10px';
	 	document.getElementById("waiting-respond").style.height = '0';
	 	this.lgModal.show();
	 }
	 login(){
	 	if((<HTMLInputElement>document.getElementById('input1')).value=='' || !(/\S/.test((<HTMLInputElement>document.getElementById('input1')).value))){
	 		document.getElementById('error-log').innerText="Please check the input again";
	 		document.getElementById("success-log").style.display = "none";
	 		document.getElementById("error-log").style.display = "block";
	 	}else if((<HTMLInputElement>document.getElementById('input1')).value==localStorage.getItem('sensor')){
	 		document.getElementById('error-log').innerText="Device is added";
	 		document.getElementById("success-log").style.display = "none";
	 		document.getElementById("error-log").style.display = "block";
	 	}else {
	 		document.getElementById("success-log").style.display = "block";
	 		document.getElementById('success-log').innerHTML= 'Pair succesful';
	 		document.getElementById("error-log").style.display = "none";
	 		localStorage.removeItem('location');
	 		localStorage.removeItem('timeTemp');
	 		localStorage.removeItem('timeStart');
	 		localStorage.removeItem('locationName');
	 		localStorage.removeItem('estimateDistance');
	 		localStorage.removeItem('estimateTime');
	 		localStorage.setItem('sensor',(<HTMLInputElement>document.getElementById('input1')).value);
	 	}
	 }

	/**
	 * [hideLgModal hide the modal]
	 */
	 hideLgModal() {
	 	this.lgModal.hide();
	 }
	}