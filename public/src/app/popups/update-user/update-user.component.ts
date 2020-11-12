import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {HttpService} from "../../services/http.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss']
})
export class UpdateUserComponent implements OnInit {
  @ViewChild('userImage', {static: false}) fileInput: ElementRef;
  userImageData: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<UpdateUserComponent>,
    private httpService: HttpService,
    private snackBar: MatSnackBar,
    private domSanitizer: DomSanitizer
  ) {
  }

  ngOnInit(): void {
    this.httpService.getUserImage(this.data.imageUrl).subscribe((imageData) => {
      const TYPED_ARRAY = new Uint8Array(imageData);
      // const STRING_CHAR = String.fromCharCode.apply(null, TYPED_ARRAY);
      const STRING_CHAR = TYPED_ARRAY.reduce((data, byte) => {
        return data + String.fromCharCode(byte);
      }, '');
      const base64String = btoa(STRING_CHAR);
      this.userImageData = this.domSanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + base64String);
    }, (err) => {
      console.log("An error occurred while getting user image", err);
      this.snackBar.open(err.error.message, null, {
        duration: 3000,
        verticalPosition: 'top'
      });
    });
  }

  onNoClick() {
    this.dialogRef.close();
  }

}
