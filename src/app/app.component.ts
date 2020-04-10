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
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]),
      company: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
    });

    this.userList = [
      // {
      //   id: 1,
      //   name: 'Rahimjohn',
      //   email: 'k.rahim001@Gmail.com',
      //   phone: '9876543210',
      //   company: 'Supreme Tech',
      //   address: '150 Sri Ram Nagar, Perungalathur',
      // }
      // , {
      //   id: 2,
      //   name: 'Arun Kumar',
      //   email: 'arunkumar@Gmail.com',
      //   phone: '6549873210',
      //   company: 'CSS Corp',
      //   address: '150 Sri Ram Nagar, Perungalathur',
      // }, {
      //   id: 3,
      //   name: 'Satheesh',
      //   email: 'satheesh@Gmail.com',
      //   phone: '7894561230',
      //   company: 'Alten Calsoft',
      //   address: '150 Sri Ram Nagar, Perungalathur',
      // }
    ];
    this.contactStatus = 'add';
    this.accordionList = true;
    // this.infoBox = this.userList[0];
    // this.mainUser = this.userList[0];
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
  open(content) {
    this.addContactForm.reset();
    this.contactStatus = 'add';
    this.modalService.open(content);
  }
  chat(content, user: User) {
    // this.toUserList = this.userList.filter((element, index) => {
    //   if (index !== i) {
    //     return element;
    //   }
    // });
    if (this.mainUser !== user) {
      this.toUser = user.name;
      this.addContactForm.reset();
      this.contactStatus = 'add';
      this.modalService.open(content);
    }
  }
  onAddContactSubmit() {
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
        this.userList.push({
          id: this.userList.length + 1,
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
  edit(content) {
    this.contactStatus = 'update';
    this.modalService.open(content);
    this.addContactForm.patchValue(this.infoBox);
    // this.addContactForm.patchValue({
    //   id: this.infoBox.id,
    //   name: this.infoBox.name,
    //   email: this.infoBox.email,
    //   phone: this.infoBox.phone,
    //   company: this.infoBox.company,
    //   address: this.infoBox.address,
    // });
  }

}
