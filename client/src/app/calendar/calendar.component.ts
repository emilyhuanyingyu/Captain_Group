import { Component, OnInit } from '@angular/core';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { MainService } from '../main.service';

import * as moment from 'moment';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  date_display;
  eventUpdate = {
    date: null,
    title: null,
    timeFrom: null,
    timeTo: null,
    vessel: null,
    spec: null,
    message: null,
    NumOfCrew: null
  };
  user_data = {
    _id: null
  };
  event_created_by;
  event_id;
  student = {
    title: '',
    date: null,
    timeFrom: null,
    timeTo: null,
    message: '',
  }
  captain = {
    title: '',
    date: null,
    timeFrom: null,
    timeTo: null,
    vessel: '',
    spec: '',
    NumOfCrew: '',
    message: '',
  }
  loginUser = 'none';

  saveTime={
    start:[],
    to: []
  }

  constructor(private atp: AmazingTimePickerService, private _service: MainService) { }

  ngOnInit() {
    this._service.getAllEvents((res) => {
      this.display_calendar(res);
    });


    this._service.loginstatus.subscribe(
      (data) => {
        console.log('data: ', data);

        if (data[0].user != null) {
          this.user_data = data[0].user;
          this.loginUser = data[0].user.identity;
        }
        if (data[0].user == null) {
          this.loginUser = 'none';
        }
      });
    console.log('loginuser', this.loginUser);

  }

  update_event(events) {
    $('#calendar').fullCalendar('removeEvents');
    $('#calendar').fullCalendar('addEventSource', events);
    $('#calendar').fullCalendar('rerenderEvents');
  }


  student_submit() {
    if (this._service.currentUser.identity === 'student') {
      this.student.title = this._service.currentUser.name + ' seeking Vessel!';
      this._service.createStudentEvent(this.student, (res) => {
        console.log('res: ', res);
        this.closeModal();
        this.update_event(res);
      });
    } else {
        this.captain.title =  this._service.currentUser.name + ' seeking Vessel!';
        this.captain.timeFrom = this.student.timeFrom;
        this.captain.timeTo = this.student.timeTo;
        this.captain.vessel = '';
        this.captain.spec = '';
        this.captain.message = this.student.message;
        this.captain.NumOfCrew = '';
        this._service.createCaptainEvent(this.captain, (res) => {
          console.log('res: ', res);
          this.closeModal();
          this.update_event(res);
          });
        }
      }
  captain_submit() {
    this.captain.title = this._service.currentUser.name + ' seeking Crew!';
    this._service.createCaptainEvent(this.captain, (res) => {
      console.log('res: ', res);
      this.closeModal();
      this.update_event(res);
    });
  }

  closeModal() {
    $('.modal').fadeOut();
    this.student = {
      title: '',
      date: null,
      timeFrom: null,
      timeTo: null,
      message: '',
    }
    this.captain = {
      title: '',
      date: null,
      timeFrom: null,
      timeTo: null,
      vessel: '',
      spec: '',
      NumOfCrew: '',
      message: '',
    }
    this.saveTime = {
      start: [],
      to: []
    }
  }

  timeFrom() {
    const amazingTimePicker = this.atp.open();
    amazingTimePicker.afterClose().subscribe(time => {
      console.log(time);
      const parts = time.match(/(\d+)\:(\d+)/);
      this.saveTime.start[0] = time;
      this.saveTime.start[1] = parseInt(parts[1])*60 + parseInt(parts[2])
      this.saveTime.start[2] = parseInt(parts[1])
      this.saveTime.start[3] = parseInt(parts[2])
      if (this.saveTime.to[1] === undefined || this.saveTime.start[1] <= this.saveTime.to[1]) {
        this.student.timeFrom = time;
        this.captain.timeFrom = time;
        this.eventUpdate.timeFrom = time;
      }
    });
  }
  timeTo() {
    const amazingTimePicker = this.atp.open();
    amazingTimePicker.afterClose().subscribe(time => {
      console.log(time);
      const parts = time.match(/(\d+)\:(\d+)/)
      this.saveTime.to[0] = time;
      this.saveTime.to[1] = parseInt(parts[1])*60 + parseInt(parts[2])
      this.saveTime.to[2] = parseInt(parts[1])
      this.saveTime.to[3] = parseInt(parts[2])
      if (this.saveTime.start[1] === undefined || this.saveTime.start[1] <= this.saveTime.to[1]) {
        this.student.timeTo = time;
        this.captain.timeTo = time;
        this.eventUpdate.timeTo = time;
      }
    });
  }

  student_req() {
    document.getElementById('myModal1').style.display = 'none';
    $('#myModal2').fadeIn();
  }
  captain_req() {
    document.getElementById('myModal1').style.display = 'none';
    $('#myModal3').fadeIn();
  }



  display_calendar(eventsData) {
    const userId = this.user_data._id;
    $('#calendar').fullCalendar({
      header: {
        left: 'prev,next today',
        center: 'title',
        // right: 'month'
      },
      selectable: true,
      selectHelper: true,
      // editable: true,
      eventLimit: true,
      weekMode: 'liquid',
      url: '#',
      editable: true,
      eventClick: (e) => {
        this.eventUpdate = {
          title: e.title,
          date: moment(e.date).format('DD MMM YYYY'),
          timeFrom: e.timeFrom,
          timeTo: e.timeTo,
          vessel: e.vessel,
          spec: e.spec,
          message: e.message,
          NumOfCrew: e.NumOfCrew
        }
        console.log('eventUpdate: ', this.eventUpdate);
        this.event_created_by = e.created_by;
        this.event_id = e._id;
        if(this.loginUser == 'none') {
          if(e.title.includes('Crew')) {
            $('#myModal0').fadeIn();
            $('#date').html(`The Captain will set sail on ${e.date}`);
            $('#title').html(`${e.title}`);
            $('#timeRange').html(`Set sail between: ${e.timeFrom} to ${e.timeTo}`);
            $('#vessel').html(`Vessel: ${e.vessel}`);
            $('#numCrew').html(`This vessel has room for ${e.NumOfCrew} crew.`);
            $('#Message').html(`Captains Log (Message): ${e.message}`);
          } else if (e.title.includes('Vessel')) {
            $('#myModal0').fadeIn();
            $('#date').html(`He/She would like to set sail in: ${e.date}`);
            $('#title').html(`${e.title}`);
            $('#timeRange').html(`Set sail between: ${e.timeFrom} to ${e.timeTo}`);
            $('#Message').html(`Message to Would-be Captains: ${e.message}`);
          }
        } else {
          if (this.user_data._id == e.created_by) {
            if (e.title.includes('Crew')) {
              $('#myModal4').fadeIn();
            } else if (e.title.includes('Vessel')) {
              $('#myModal5').fadeIn();
            }
          } else {
            if (e.title.includes('Crew')) {
              $('#myModal0').fadeIn();
              $('#date').html(`He/She would like to set sail in: ${e.date}`);
              $('#title').html(`${e.title}`);
              $('#timeRange').html(`Set sail between: ${e.timeFrom} to ${e.timeTo}`);
              $('#vessel').html(`Vessel: ${e.vessel}`);
              $('#numCrew').html(`Number of Crew is seeking: ${e.NumOfCrew}`);
              $('#Message').html(`Captains Log (Message): ${e.message}`);
            } else if (e.title.includes('Vessel')) {
              $('#myModal0').fadeIn();
              $('#date').html(`He/She would like to set sail in: ${e.date}`);
              $('#title').html(`${e.title}`);
              $('#timeRange').html(`Set sail between: ${e.timeFrom} to ${e.timeTo}`);
              $('#Message').html(`Message to Would-be Captains: ${e.message}`);
            }
          }

        }
      },
      events: eventsData,

      dayClick: (date, jsEvent, view) => {
        if (moment().format('YYYY-MM-DD') === date.format('YYYY-MM-DD') || date.isAfter(moment())) {
          this.student.date = date;
          this.captain.date = date;
          this.date_display = moment(date).format('DD MMM YYYY');
          $('#myModal1').fadeIn();
        }

      },
      eventAfterRender: (event, element, view) => {
        if (event.vessel !== undefined) {
          element.css('background-color', 'rgba(179, 225, 247, 1)');
          element.css('border', 'none');
        } else {
          element.css('background-color', '#CDDC39');
          element.css('border', 'none');
        }
      },
      displayEventTime: false

    });
  }

  req_login(state) {
    if(state === 'reg') {
      const data = [{
        user: null,
        mesg: state
      }]
      this._service.updateLoginStatus(data);
    } else if (state === 'log') {
      const data = [{
        user: null,
        mesg: state
      }]
      this._service.updateLoginStatus(data);
    } else {
      return;
    }
    $('#myModal1').fadeOut();
  }

  delete(eventId) {
    console.log('click', eventId);
    this._service.delete_event(eventId, this.loginUser, (res) => {
      this.closeModal();
      this.update_event(res);
    })
  }

  event_update() {
    console.log('update', this.event_id, this.eventUpdate);
    this._service.event_update(this.event_id, this.eventUpdate, (res) => {
      this.closeModal();
      this.update_event(res);
    });
  }
}
