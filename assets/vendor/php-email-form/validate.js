 (function () {
   "use strict";
     
     // Инициализация EmailJS
       emailjs.init("8hcDpemUSPaKXZpo0");

   let forms = document.querySelectorAll('.php-email-form');

   forms.forEach(function (e) {
     e.addEventListener('submit', function (event) {
       event.preventDefault();

       let thisForm = this;

       let action = thisForm.getAttribute('action');
       let recaptcha = thisForm.getAttribute('data-recaptcha-site-key');

       if (!action) {
         displayError(thisForm, 'The form action property is not set!');
         return;
       }

       thisForm.querySelector('.loading').classList.add('d-block');
       thisForm.querySelector('.error-message').classList.remove('d-block');
       thisForm.querySelector('.sent-message').classList.remove('d-block');

       let formData = new FormData(thisForm);

       if (recaptcha) {
         if (typeof grecaptcha !== "undefined") {
           grecaptcha.ready(function () {
             try {
               grecaptcha.execute(recaptcha, { action: 'php_email_form_submit' })
                 .then(token => {
                   formData.set('recaptcha-response', token);
                   php_email_form_submit(thisForm, formData);
                 })
             } catch (error) {
               displayError(thisForm, error);
             }
           });
         } else {
           displayError(thisForm, 'The reCaptcha javascript API url is not loaded!');
         }
       } else {
         php_email_form_submit(thisForm, formData);
       }
     });
   });

   function php_email_form_submit(thisForm, formData) {
     // Собираем данные из формы
     const templateParams = {
       name: formData.get("name"),
       email: formData.get("email"),
       subject: formData.get("subject"),
       message: formData.get("message")
     };

     // Отправка письма через EmailJS
     emailjs.send("service_0u9ajut", "__ejs-test-mail-service__", templateParams) // Замените на ваш service_id и template_id
       .then(function (response) {
         console.log("SUCCESS!", response);
         thisForm.querySelector('.loading').classList.remove('d-block');
         thisForm.querySelector('.sent-message').classList.add('d-block');
         thisForm.reset();
       }, function (error) {
         console.log("FAILED...", error);
         thisForm.querySelector('.loading').classList.remove('d-block');
         thisForm.querySelector('.error-message').innerHTML = "Failed to send the message. Please try again.";
         thisForm.querySelector('.error-message').classList.add('d-block');
       });
   }

   function displayError(thisForm, error) {
     thisForm.querySelector('.loading').classList.remove('d-block');
     thisForm.querySelector('.error-message').innerHTML = error;
     thisForm.querySelector('.error-message').classList.add('d-block');
   }

 })();
