import { Component, ViewChild, Output, EventEmitter, } from '@angular/core';
import { Http, Response, Headers,URLSearchParams, RequestOptions } from '@angular/http';
import { ModalDirective } from 'ng2-bootstrap/components/modal/modal.component';
import {Observable} from 'rxjs/Rx';

@Component({
	selector: 'sensor',
	template: `

	<div bsModal #lgModal="bs-modal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
	<div class="vertical-alignment-helper modal-dialog modal-lg">
	<div class="modal-dialog vertical-align-center">
	<div class="modal-content">
	<div class="modal-body" id="modal-body">
	<h4 class="modal-title" id="title">Change Sensor</h4><br>

	<i class="fa fa-cogs" aria-hidden="true"></i> <input type="number" placeholder="Sensor ID" aria-describedby="sizing-addon2" id="input1"><br>
	<i class="fa fa-lock" aria-hidden="true"></i> <input type="text" placeholder="Password" aria-describedby="sizing-addon2" id="input2"><br>
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
	 login(): any{
	 	if((<HTMLInputElement>document.getElementById('input1')).value=='' || !(/\S/.test((<HTMLInputElement>document.getElementById('input1')).value))||!(/\S/.test((<HTMLInputElement>document.getElementById('input2')).value))){
	 		document.getElementById('error-log').innerText="Please check the input again";
	 		document.getElementById("error-log").style.display = "block";
	 	}else {
	 		document.getElementById("crop").style.height = '100px';
	 		document.getElementById("error-log").style.display = "none";
	 		document.getElementById("btn-success").style.display = "none";
	 		document.getElementById("btn-danger").style.display = "none";
	 		document.getElementById("waiting-respond").style.height = '180px';
	 		let params: URLSearchParams = new URLSearchParams();
	 		let data = {
	 			"device_id": (<HTMLInputElement>document.getElementById('input1')).value,
	 			"password":(<HTMLInputElement>document.getElementById('input2')).value
	 		}
	 		let body = JSON.stringify(data);
	 		let head = new Headers({
	 			'Accept':'application/json',
	 			'Content-Type': 'application/json',
	 			'Authorization': this.token
	 		});
	 		this.http.post(this.sensorURL, body, {headers : head})
	 		.subscribe( (response) => {let body = response.json()
	 			document.getElementById("crop").style.height = '10px';
	 			document.getElementById("waiting-respond").style.height = '0';
	 			document.getElementById("btn-danger").style.display = "inline-block";
	 			if(body.status=="Login success"){
	 				document.getElementById("success-log").style.display = "block";
	 				document.getElementById('success-log').innerHTML= 'Change succesful';
	 			}else {
	 				document.getElementById("error-log").style.display = "block";
	 				document.getElementById('error-log').innerText="Cannot connect to the sensor";
	 			}
	 		});
	 	}
	 }

	/**
	 * [hideLgModal hide the modal]
	 */
	 hideLgModal() {
	 	this.lgModal.hide();
	 }
	}