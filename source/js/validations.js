var validatorOptions = {
  custom: {
// Find an agent input validation
'zip-code': function($el) {
  if(checkInput($el.val(), $el)) {
    if (isValidZip($el.val())) {
      return;
    }else{
        return "Invalid Zip Code";
      }
  } else {
    return 'Numeric value only';
  }
},
'email-validator': function($el) {
  if (isEmailAddress($el.val())) {
return;
  }else 
  return'Invalid Email Address';
},
'password-validator': function($el) {
  if(checkPassword($el.val())) {
    return;
  } else {
    return 'Password must contain atleast 1 lowercase, 1 uppercase, 1 number and 1 special character.';
  }
},
'card-expiry' : function($el) {
  if(formatString($el.val())) {
    return;
  } else {
    return '';
  }
},
'card-validator': function($el) {
  if(CCNumberValid($el.val(), $el)) {
    return;
  } else {
    return;
  }
},
'numeric-value': function($el) {
  if(checkInput($el.val(), $el)) {
    return;
  } else {
    return 'Numeric value only';
  }
},
'date-format-validator': function($el) {
  if(dateFormatCheck($el.val())) {
    if(ageCheck($el.val())){
      if(startDateCheck($el.val())){
        return;
      }
      else{
        return "Date of birth prior to 1990 not accepted";
      }
    }
    else{
      return "Age should be 18 and above";
    }
  } else{
    return "Date is not in the proper format";
  }
},

// Confirm Password validation
'confirm-password': function($el) {
  if($el.val() === $('#userPassword').val()) {
    return;
  } else {
    return 'Confirm password doesn\'t match.'
  }
}
}
};

$(document).ready(function() {
	$('form[data-toggle="validator"]').validator(validatorOptions);
});

function isValidZip(value) {
  var zipRegex = /^[0-9]{5}$/;
  if (zipRegex.test(value) && value > 0) {
    return true;
  } else {
    return false;
  }
}

//Numeric input restriction

function checkInput($el) {
  var invalidChars = /[^0-9]/gi
  if(invalidChars.test($el)) {
    $el = $el.replace(invalidChars,"");
    return false;
  } else {
    return true;
  }
}
//Email validation starts

var pattern = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
function isEmailAddress($el) {  
  if ($el.match(pattern)) {
    return true;
  }else return false;

} 
//Email validation ends

//Card Validation starts
function CCNumberValid($el, obj){

  var val = $el;
  var newval = '';
  var regexNumber = /^[0-9\s]*$/;

  if(regexNumber.test(val) == false ){
    val = val.substring(0, val.length - 1);
  } 
  val = val.replace(/\s/g, '');
  for(var i=0; i < val.length; i++) {
    if(i%4 == 0 && i > 0) newval = newval.concat(' ');
    newval = newval.concat(val[i]);
  }
  obj.val(newval);
}

//Card Validation ends

//Date in mm/yyyy format in textbox starts
function formatString(e) {
  var inputChar = String.fromCharCode(event.keyCode);
  var code = event.keyCode;
  var allowedKeys = [8];
  if (allowedKeys.indexOf(code) !== -1) {
    return;
  }
  event.target.value = event.target.value.replace(
/^([1-9]\/|[2-9])$/g, '0$1/' // 3 > 03/
).replace(
/^(0[1-9]|1[0-2])$/g, '$1/' // 11 > 11/
).replace(
/^([0-1])([3-9])$/g, '0$1/$2' // 13 > 01/3
).replace(
/^(0?[1-9]|1[0-2])([0-9]{2})$/g, '$1/$2' // 141 > 01/41
).replace(
/^([0]+)\/|[0]+$/g, '0' // 0/ > 0 and 00 > 0
).replace(
/[^\d\/]|^[\/]*$/g, '' // To allow only digits and `/`
).replace(
/\/\//g, '/' // Prevent entering more than 1 `/`
);
}
//Date in mm/yyyy format in textbox ends

//Date Validator starts
function dateFormatCheck($el){
    var dateFormat = 'DD/MM/YYYY';
    var dateNumber = $el;
    var formatCheck = moment(dateNumber, [dateFormat], true).isValid();
    if(formatCheck){
        return true;
    } else{
        return false;
    }
}

function ageCheck($el){
    var dateFormat = 'DD/MM/YYYY';
    var dateNumber = $el;
    var userDate = moment(dateNumber, [dateFormat]).toDate();
    var userDateFormat = moment(userDate).format('YYYY-MM-DD');
    var years = moment().diff(userDateFormat, 'years');
    if(years < 18){
        return false;
    } else{
        return true;
    }
}

function startDateCheck($el){
    var dateFormat = 'DD/MM/YYYY';
    var dateNumber = $el;
    var userDate = moment(dateNumber, [dateFormat]).toDate();
    var userDateFormat = moment(userDate).format('YYYY-MM-DD');
    var years = moment().diff(userDateFormat, 'years');
    if(moment(userDateFormat).isAfter('1990-01-01')){
        return true;
    }else{
        return false;
    }
}
//Date Validator ends
//Password Validator starts
function checkPassword($el) {
    var numbers = $el.match(/\d+/g);
    var uppers  = $el.match(/[A-Z]/);
    var lowers  = $el.match(/[a-z]/);
    var special = $el.match(/[!@#$%\^&*\+]/);

    if (numbers === null || uppers === null || lowers === null || special === null)
        valid = false;

    if (numbers !== null && uppers !== null && lowers !== null && special !== null)
        valid = true;

    return valid;

}
//Password Validator ends


/*Account setup page input formatting JS ends*/

//Account-summary JS as below
$(document).ready(function() {
	$(".summary-text a").click(function() {
		$(this).parent().hide();
		$(this).parent().next().show();
		$(".account-data-buttons").show();
	});
});

