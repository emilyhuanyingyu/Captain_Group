import { Component, OnInit } from '@angular/core';
import { MainService } from "./../main.service";
import { Router } from "@angular/router";

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})


export class NavbarComponent implements OnInit {
  logged_user;

  captain_reg = {
    name: "",
    identity: "captain",
    email: "",
    phone: "",
    address: [],
    experience: "",
    boat_name: "",
    spec: "",
    password: ""
  }

  student_reg = {
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    password: ""
  }

  err_message = {
    email: "",
    password: ""
  }

  pass_con;

  error_message = {
    email: "",
    login: "",
    code: 0
  }

  user_log = {
    email: "",
    password: ""
  }

  constructor(private _service: MainService, private _router: Router) { }

  capReg() {
    console.log('cap reg component', this.captain_reg);
    this._service.registerCap(this.captain_reg, (res) => {
      if (res.success === 'register pending') {
        $(".modal-backdrop.show").hide();
        $(".modal").hide();
        this._router.navigate(['/check_email']);
        this.captain_reg = {
          name: "",
          identity: "captain",
          email: "",
          phone: "",
          address: [],
          experience: "",
          boat_name: "",
          spec: "",
          password: ""
        }
        this.pass_con = "";
      }
      else {
        this.err_message.email = res.error;
      }
      
    })
  }

  studentReg() {
    console.log('student reg component', this.student_reg);
    this._service.registerStudent(this.student_reg, (res) => {
      if (res.success = 'success') {
        this._router.navigate(['/create'])
      }
      else {
        this.err_message.email = 'This email has been registered';
      }
      this.student_reg = {
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        password: ""
      }
    })
  }

  ngOnInit() {
    if (this._service.currentUser !== null) {
      this.logged_user = this._service.currentUser.name; 
    }
    $('#student').hide();
    $('#reg1').hide();

    $('#reg1').click(function () {
      $('#student').hide(100);
      $('#cap').show(100);
      $('#reg1').hide();
      $('#reg2').show();
    })
    $('#reg2').click(function () {
      $('#student').show(100);
      $('#cap').hide(100);
      $('#reg1').show();
      $('#reg2').hide();

    })
  }

  display_login() {
    $("#loginForm").fadeIn();
  }
  display_reg() {
    $("#regForm").fadeIn();
  }

  closeLogin() {
    $("#loginForm").fadeOut();
  }
  closeReg() {
    $("#regForm").fadeOut();
  }

  login() {
    this._service.login(this.user_log, 
      (res) => {
        if(res.error == undefined) {
          this.logged_user = res.name;
          this.closeLogin()

        }
        else {
          this.error_message.login = res.error;
          if(res.errorCode != undefined){
            this.error_message.code = res.errorCode;
          }
        }
      });
    this.user_log = {
      email: "",
      password: ""
    };
  }

  logout() {
    this._service.logout();
    this.logged_user = undefined;
  }

  click() {
    if (this._service.show === true) {
      document.getElementById('check_box').style.display = 'block';
      this._service.show = false;
    } else {
      document.getElementById('check_box').style.removeProperty('display');
      this._service.show = true;
    }
  }

  close() {
    document.addEventListener("click", function (e) {
      let box = document.getElementById("check_box");
      if (box.style.display === "block") {
        if (e.target !== box && e.target !== document.getElementById("menu-icon")) {
          box.style.removeProperty("display");

        }
      }
    })
    this._service.show = true;
  }


}
