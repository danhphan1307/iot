$(document).ready(function() {
	$('#resetBtn').hide();
	$('#updateBtn').hide();
	$('#register').hide();

	$("#registerBtn").click(function(event){
		event.preventDefault();
		$('#login').slideUp();
		$('#loginBtn').removeClass('active');
		$('#register').slideDown();
		$('#registerBtn').addClass('active');
	});

	$("#loginBtn").click(function(event){
		event.preventDefault();
		$('#registerBtn').removeClass('active');
		$('#register').slideUp();
		$('#login').slideDown();
		$('#loginBtn').addClass('active');
	});

	$(register).submit(function(event) {
		event.preventDefault();
		var formData = $(register).serialize();
		var obj = $(register).serializeArray();
		formMessages.removeClass('error');
		formMessages.removeClass('success');
		formMessages.text('');
		if (obj[4].value == obj[5].value){
			formMessages.addClass('success');
			formMessages.append('<span class="glyphicon glyphicon-refresh" aria-hidden="true"></span> ');
			formMessages.append('Sending data...<br>Please be patient.');

			$.ajax({
				type: 'GET',
				url: 'http://users.metropolia.fi/~thanhph/project/second/scale/username.php',
				data: formData,
			})

			.done(function(response) {
				if(response=='Successful'){
					formMessages.removeClass('error').addClass('success');
					formMessages.text('');
					formMessages.append('<span class="glyphicon glyphicon-ok" aria-hidden="true"></span> Register Successful');	
					document.location = 'index.php';
				} else{
					formMessages.removeClass('success').addClass('error');
					formMessages.text('');
					formMessages.append('<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span> '+response+': This username is taken');	
				}

			})
			.fail(function(data) {
				formMessages.removeClass('success').addClass('error');
				formMessages.text('');
				formMessages.append('<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span> Update failed ');
				var errorLog = JSON.parse(data.responseText);
				if (errorLog !== '') {
					formMessages.append(errorLog.error);
				} else {
					formMessages.append('No Internet Connection.');
				}
			});

		} else {
			formMessages.addClass('error');
			formMessages.append('<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span> ');
			formMessages.append('Passwords do not match');
		}

	});

	$(login).submit(function(event) {
		event.preventDefault();
		var formData = $(login).serialize();
		var obj = $(login).serializeArray();
		formMessages.removeClass('error');
		formMessages.removeClass('success');
		formMessages.text('');
		formMessages.addClass('success');
		formMessages.append('<span class="glyphicon glyphicon-refresh" aria-hidden="true"></span> ');
		formMessages.append('Sending data...<br>Please be patient.');

		$.ajax({
			type: 'GET',
			url: 'http://users.metropolia.fi/~thanhph/project/second/scale/username.php',
			data: formData,
		})

		.done(function(response) {
			if(response=='Successful'){
				formMessages.removeClass('error').addClass('success');
				formMessages.text('');
				formMessages.append('<span class="glyphicon glyphicon-ok" aria-hidden="true"></span> Login Successful');
				document.location = 'index.php';
			} else{
				formMessages.removeClass('success').addClass('error');
				formMessages.text('');
				formMessages.append('<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span> '+response+': Check Username and Password again');	
			}
		})
		.fail(function(data) {
			formMessages.removeClass('success').addClass('error');
			formMessages.text('');
			formMessages.append('<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span> Update failed ');
			var errorLog = JSON.parse(data.responseText);
			if (errorLog !== '') {
				formMessages.append(errorLog.error);
			} else {
				formMessages.append('No Internet Connection.');
			}
		});
	});
});