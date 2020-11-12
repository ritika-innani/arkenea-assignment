import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  @ViewChild('userImage', {static: false}) fileInput: ElementRef;

  data = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    imageUrl: ""
  };

  constructor(
    public dialogRef: MatDialogRef<AddUserComponent>
  ) { }

  ngOnInit(): void {
  }

  onNoClick() {
    this.dialogRef.close();
  }

  onfileUpload() {
    this.data.imageUrl = this.fileInput.nativeElement.files[0];
  }

}
