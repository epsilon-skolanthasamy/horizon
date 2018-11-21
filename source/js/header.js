$(document).ready(function(argument) {
  var header = document.getElementById("primaryNavContainer");
  var body = document.body;
  var sticky = header ? header.offsetTop : 0;

  function setLoginFormPosition() {
    // Navbar - login form position handler
    $('.account-access-wrapper .login-form').css('left', 'auto');

    // Sticky header - login form position handler
    $('.sticky-header .account-access-wrapper .login-form').css('left',
      $('.account-access-wrapper').offset().left + $('.account-access-wrapper').width() - 235);
  }

  function stickyApply() {
    if (window.pageYOffset > sticky) {
      // Set sticky header
      if (!$('body').hasClass('sticky-header')) {
        body.classList.add("sticky-header");
        $('.utilities-search').addClass('search-collapsed');
        $('.utilities-search').css('left', $('.account-access-wrapper').offset().left - 185);
      }

      // Sticky header - Search icon click handler
      $('.sticky-header .utilities-search .fa-search').click(function () {
        $('.utilities-search').removeClass('search-collapsed');
        $('.utilities-search .input-search').val('');
        event.stopPropagation();
      });

      setLoginFormPosition();
    } else {
      // Remvoe sticky header
      body.classList.remove("sticky-header");
      $('.utilities-search').css('left', 'auto');
      $('.utilities-search .input-search').val('');
      setLoginFormPosition();
    }
  }

  // Listen to click event to hide Search box if clicked outside of search box in sticky header
  $('body').on('click', function(e) {
    if ($('body').hasClass('sticky-header') && !$('.utilities-search .input-search').is(":hidden")) {
      if (!$(e.target).hasClass('input-search')) {
        $('.utilities-search').addClass('search-collapsed');
        $('.utilities-search .input-search').val('');
      }
    }

    // Preventing closing of dropdown from clicking inside the login/forgot password form in header
    if ($(e.target).closest('form#forgotPwdForm').length && !$(e.target).is('button')) {
      return false;
    }
  });

  // Toggling nav bar in mobile

  $('.menu-btn').click(function () {
    $(this).toggleClass('open');
    $('.nav-bar').toggleClass('show');

    if ($(this).hasClass('open')){
      $('.search-field .search-btn').trigger('click');
    } else {
      $('.logo').removeClass('hidden-mobile');
      $('.search-field').removeClass('full-width').find('input').removeClass('visible-mobile').val('');
      // Hiding the expanded sub menu
      $('.has-subnav > .fa').removeClass('expanded');
      $('.sub-nav').removeClass('visible-mobile');
    }
  });

  // Search menu expanding in mobile

  $('.search-field .search-btn').on('click', function () {
  // Only for mobile
   if($(window).width()<=1024)
    {
      //hiding the logo and showing the input field
      $('.logo').addClass('hidden-mobile');
     $('.search-field').addClass('full-width').find('input').addClass('visible-mobile');
      // opening the menu 
      $('.menu-btn').addClass('open');
      $('.nav-bar').addClass('show');
    }
  });

  // Sub menu toggling
  $('.has-subnav > a').click(function () { 
    $(this).siblings('.fa').toggleClass('expanded');
    $(this).siblings('.sub-nav').toggleClass('visible-mobile');
  });

  $(window).resize(function(e){
    if ($(window).width() > 1024){
      // Restoring back the action done to initial 
      $('.logo').removeClass('hidden-mobile');
      $('.search-field').removeClass('full-width').find('input').removeClass('visible-mobile').val('');
      $('.menu-btn').removeClass('open');
      $('.nav-bar').removeClass('show'); 
      $('.has-subnav > .fa').removeClass('expanded');
      $('.sub-nav').removeClass('visible-mobile');
    }
  });

  

 

  // Mobile Menu show/hide Callbacks
  $(".navbar-collapse").on('shown.bs.collapse', function () {
    $('body').addClass('mobile-nav-expanded');
    $('.navbar-toggler').blur();
  });

  $(".navbar-collapse").on('hidden.bs.collapse', function () {
    $('body').removeClass('mobile-nav-expanded');
    $('.navbar-toggler').blur();
  });

  // Login form show/hide Callbacks
  $("#loginForm").parent().on('show.bs.dropdown', function () {
    $('.navbar').addClass('login-form-expanded');
    setLoginFormPosition();
  });

  $("#loginForm").parent().on('hide.bs.dropdown', function () {
    $('.navbar').removeClass('login-form-expanded');
    $('.account-access-wrapper').removeClass('show').find('.dropdown-menu.show').removeClass('show');
  });

  //Forgot password show/hide callbacks
  $(".link-reset-password").on('click', function (e) {
    e.stopPropagation();
    $(this).closest('li').find('#loginForm').removeClass('show');
    $(this).closest('li').find('#forgotPwdForm').addClass('show');
  });

  window.onscroll = function () {
    stickyApply();
  };

  $(function () {
    $('[data-toggle="tooltip"]').tooltip();
  });

});
