import { Component, OnInit, ViewChild, trigger, state, style, animate, transition, Input} from '@angular/core';

@Component({
  selector: 'login-panel',
  template: `<div class="col-xs-12 col-sm-12 col-md-6">
	<div class="appNav">
		<button class="active" id = "loginBtn" >LOGIN</button><!--
		!--><button id = "registerBtn" >REGISTER</button>
	</div>
	<form method="post" id="login">
		<div class="modal-body row">
			<div class="col-xs-12 col-sm-12 col-md-12">
				<div class="input-group">
					<span class="input-group-addon"><span class="glyphicon glyphicon-user"></span></span>
					<input type="text" class="form-control" id="username" name="username" placeholder="Username" required/>
				</div>
			</div>
			<br><br>

			<div class="col-xs-12 col-sm-12 col-md-12">
				<div class="input-group">
					<span class="input-group-addon"><span class="glyphicon glyphicon-lock"></span></span>
					<input class="form-control" type="password" id="password" name="password" placeholder="Password" required/>
				</div>
			</div>

			<br><br>
		</div>
		<div class="modal-footer">
			<button class="btn btn-default btn-primary" type="submit">
				Login
			</button>
		</div>
	</form>
	<form method="post" id="register">
		<div class="modal-body row">
			<div class="col-xs-12 col-sm-12 col-md-12">
				<div class="input-group">
					<span class="input-group-addon"><span class="glyphicon glyphicon-user"></span></span>
					<input type="text" class="form-control" id="usernameRegister" name="usernameRegister" placeholder="Username" required/>
				</div>
			</div>

			<br>
			<br>

			<div class="col-xs-6 col-sm-6 col-md-6">
				<div class="input-group">
					<span class="input-group-addon"><span class="glyphicon glyphicon-lock"></span></span>
					<input class="form-control" type="password" id="passwordRegister" name="passwordRegister" placeholder="Password" required/>
				</div>
			</div>

			<div class="col-xs-6 col-sm-6 col-md-6">
				<div class="input-group">
					<span class="input-group-addon"><span class="glyphicon glyphicon-repeat"></span></span>
					<input class="form-control" type="password" id="passwordRegisterCon" name="passwordRegisterCon" placeholder="Confirm Password" required/>
				</div>
			</div>

			<br><br>
		</div>
		<div class="modal-footer">
			<button class="btn btn-default btn-primary" type="submit">
				Register
			</button>
		</div>
	</form>

	<div id="result" class="center">

	</div>
</div>`,
  providers: []
})

export class LoginComponent{
}
