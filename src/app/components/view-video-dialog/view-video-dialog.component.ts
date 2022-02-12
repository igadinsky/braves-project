import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component( {
  selector: 'app-view-video-dialog',
  templateUrl: './view-video-dialog.component.html',
  styleUrls: [ './view-video-dialog.component.scss' ],
} )
export class ViewVideoDialogComponent implements OnInit {

  url = '';
  date = '';
  batter = '';
  outcome = '';
  message = '';

  constructor(
    public dialogRef: MatDialogRef<ViewVideoDialogComponent>,
    @Inject( MAT_DIALOG_DATA ) public data : any,
  ) {
  }

  ngOnInit() {
      
    // set autoplay for given URLs
    if ( this.data.url ) {
      this.url = this.data.url + "?autoplay=1"
    } else {
      this.message = 'No URL found for this event.'
    }

    if ( this.data.date ) {
      this.date = this.data.date
    } 

    if ( this.data.batter ) {
      this.batter = this.data.batter
    } 

    if ( this.data.outcome ) {
      this.outcome = this.data.outcome
    } 
    
  }

  close() {
    this.dialogRef.close();
  }
}
