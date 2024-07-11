(function ($) {

	"use strict";


	// Form
	var contactForm = function () {
		if ($('#contactForm').length > 0) {
			$("#contactForm").validate({
				rules: {
					name: "required",
					subject: "required",
					email: {
						required: true,
						email: true
					},
					message: {
						required: true,
						minlength: 5
					}
				},
				messages: {
					name: "Please enter your name",
					subject: "Please enter your subject",
					email: "Please enter a valid email address",
					message: "Please enter a message"
				},
				/* submit via ajax */

				submitHandler: function (form) {
					var $submit = $('.submitting'),
						waitText = 'Submitting...';

					$.ajax({
						type: "POST",
						url: "main.html",
						data: $(form).serialize(),

						beforeSend: function () {
							$submit.css('display', 'block').text(waitText);
						},
						success: function (msg) {
							if (msg == 'OK') {
								$('#form-message-warning').hide();
								setTimeout(function () {
									$('#contactForm').fadeIn();
								}, 1000);
								setTimeout(function () {
									$('#form-message-success').fadeIn();
								}, 1400);

								setTimeout(function () {
									$('#form-message-success').fadeOut();
								}, 8000);

								setTimeout(function () {
									$submit.css('display', 'none').text(waitText);
								}, 1400);

								setTimeout(function () {
									$('#contactForm').each(function () {
										this.reset();
									});
								}, 1400);

							} else {
								$('#form-message-warning').html(msg);
								$('#form-message-warning').fadeIn();
								$submit.css('display', 'none');
							}
						},
						error: function () {
							$('#form-message-warning').html("Something went wrong. Please try again.");
							$('#form-message-warning').fadeIn();
							$submit.css('display', 'none');
						}
					});
				} // end submitHandler

			});
		}
	};
	contactForm();

})(jQuery);


document.getElementById('contactForm').addEventListener('submit', function (event) {
	event.preventDefault();
	const form = event.target;
	const data = new FormData(form);
	const formData = {
		name: data.get('name'),
		email: data.get('email'),
		subject: data.get('subject'),
		message: data.get('message'),
	};
	fetch('http://localhost:5000/api/contact', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(formData),
	})
		.then(response => response.json())
		.then(data => {
			if (data.message === 'Email sent successfully') {
				document.getElementById('form-message-success').style.display = 'block';
				document.getElementById('form-message-warning').style.display = 'none';
			} else {
				document.getElementById('form-message-warning').style.display = 'block';
				document.getElementById('form-message-success').style.display = 'none';
			}
		})
		.catch(error => {
			document.getElementById('form-message-warning').style.display = 'block';
			document.getElementById('form-message-success').style.display = 'none';
		});
});