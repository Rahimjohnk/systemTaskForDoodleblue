import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { User } from './user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isShown: boolean = false;
  title = 'systemTask';
  addContactForm: FormGroup;
  isSubmitted = false;
  accordionList: boolean;
  mainUser: User;
  userList: User[];
  // toUserList: User[];
  toUser: string;
  infoBox: User;
  editedUserIndex: number;
  editedUser: User;
  contactStatus: string;

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    config: NgbModalConfig
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }
  ngOnInit() {
    this.addContactForm = new FormGroup({
      id: new FormControl(null),
      name: new FormControl('', Validators.required),
      firstLetter: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]),
      company: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
    });

    this.userList = [];

    this.contactStatus = 'add';
    this.accordionList = true;

    // if (this.userList.length === 1) {
    //   this.infoBox = this.userList[0];
    //   this.mainUser = this.userList[0];
    // }
  }
  onList = () => {
    this.accordionList = !this.accordionList;
  }
  onUserListRow = (user: User) => {
    this.infoBox = user;
  }
  onSwitchUser = (index: number) => {
    this.mainUser = this.userList[index];
    this.infoBox = this.userList[index];
  }
  open = (content) => {
    this.addContactForm.reset();
    this.contactStatus = 'add';
    this.modalService.open(content);
  }
  chat = (content, user: User) => {
    if (this.mainUser !== user) {
      this.toUser = user.name;
      this.addContactForm.reset();
      this.contactStatus = 'add';
      this.modalService.open(content);
    }
  }
  onAddContactSubmit = () => {
    this.isSubmitted = true;
    if (this.addContactForm.valid) {
      this.isSubmitted = false;
      if (this.addContactForm.value.id) {
        this.userList.map((userElement: User, index: number) => {
          if (this.addContactForm.value.id === userElement.id) {
            this.editedUserIndex = index;
          }
        });
        this.onUserListRow(this.addContactForm.value);
        this.userList[this.editedUserIndex] = this.addContactForm.value;
      } else {
        const matches = this.addContactForm.value.name.match(/\b(\w)/g);
        const firstLetter = matches.join('');
        this.userList.push({
          id: this.userList.length + 1,
          firstLetter,
          name: this.addContactForm.value.name,
          email: this.addContactForm.value.email,
          phone: this.addContactForm.value.phone,
          company: this.addContactForm.value.company,
          address: this.addContactForm.value.address,
        });
      }
      if (this.userList.length === 1) {
        this.infoBox = this.userList[0];
        this.mainUser = this.userList[0];
      }
      this.modalService.dismissAll();
      this.addContactForm.reset();
    }
  }
  edit = (content) => {
    this.contactStatus = 'update';
    this.modalService.open(content);
    this.addContactForm.patchValue(this.infoBox);
  }
  sent = () => {
    this.modalService.dismissAll();
  }

}
