import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {HttpService} from "../../services/http.service";
import {MatDialog} from "@angular/material/dialog";
import {AddUserComponent} from "../../popups/add-user/add-user.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UpdateUserComponent} from "../../popups/update-user/update-user.component";

export interface User {
  position: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  imageUrl: string;
  _id: string;
}

const ELEMENT_DATA: User[] = [];

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  displayedColumns: string[] = ['position', 'firstName', 'email'];
  dataSource = new MatTableDataSource<User>(ELEMENT_DATA);

  constructor(
    private httpService: HttpService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    this.fetchData();
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddUserComponent, {
      width: '500px',
      height: '500px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const file = new FormData();
        file.set('imageFile', result.imageUrl);
        file.set('firstName', result.firstName);
        file.set('lastName', result.lastName);
        file.set('email', result.email);
        file.set('phone', result.phone);
        this.addData(file);
      }
    });
  }

  openEditUser(data) {
    const dialogRef = this.dialog.open(UpdateUserComponent, {
      width: '500px',
      height: '400px',
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        delete result.position;
        this.updateData(result);
      }
    });
  }

  private fetchData() {
    return this.httpService.get().subscribe((data: any) => {
        if (data.length) {
          let count = 0;
          data.forEach((element) => {
            element.position = ++count;
          });
          this.dataSource.data = data;
        } else {
          this.dataSource.data = [];
        }
      },
      (err) => {
        console.log("An error occurred while fetching records", err);
        this.showMessage(err.error.message);
      });
  }

  private addData(request) {
    this.httpService.post(request).subscribe(() => {
        this.fetchData();
        this.showMessage('User Added Successfully!');
      },
      (err) => {
        console.log("An error occurred while adding records", err);
        this.showMessage(err.error.message);
      })
  }

  private updateData(request) {
    this.httpService.put({data: request}).subscribe(() => {
        this.fetchData();
        this.showMessage('User Updated Successfully!');
      },
      (err) => {
        console.log("An error occurred while updating user", err);
        this.showMessage(err.error.message);
      })
  }

  deleteUser(id) {
    let request = {
      id: id
    };
    this.httpService.delete(request).subscribe(() => {
        this.fetchData();
        this.showMessage('User Deleted Successfully!');
      },
      (err) => {
        console.log("An error occurred while deleting user", err);
        this.showMessage(err.error.message);
      })
  }

  showMessage(message){
    this._snackBar.open(message, null,{
      duration: 2000,
      verticalPosition: 'top'
    });
  }

}
