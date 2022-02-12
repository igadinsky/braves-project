import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ViewVideoDialogComponent } from '../view-video-dialog/view-video-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms'
var _ = require('lodash');

const battedBallData = require('../../../data/BattedBallData.json');

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {

  @ViewChild( MatSort, {static: true} ) sort: MatSort;
  @ViewChild( MatPaginator, {static: true} ) paginator: MatPaginator;

  @ViewChild( MatSort ) set matSort( ms: MatSort ) {
    this.sort = ms;
  }

  @ViewChild( MatPaginator ) set matPaginator( mp: MatPaginator ) {
    this.paginator = mp;
  }

  setDataSourceAttributes( dataSource: MatTableDataSource<any> ) {
    dataSource.sort = this.sort;
    dataSource.paginator = this.paginator;
  }

  // for rendering
  isLoading = true;
  isError = false;

  // table features
  pageIndex = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [ 10, 50, 250 ];

  // table data
  displayedColumns: string[] = [ 'game_date', 'batter_id', 'batter', 'pitcher_id', 'pitcher', 'launch_angel',
    'exit_speed', 'hit_distance', 'play_outcome' ];
  bbDataSourceRaw: MatTableDataSource<any> = new MatTableDataSource( [''] );  // unfiltered datasource
  bbDataSourceFiltered: MatTableDataSource<any> = new MatTableDataSource( [''] ); // filtered datasource
  dataSource: MatTableDataSource<any> = new MatTableDataSource( [''] ); // datasource control

  filterForm: FormGroup;
  bbData: JSON[] = [];

  constructor(
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) { }

  async ngOnInit() {
    this.bbData = battedBallData; 
    this.initliazeFilterForm();
    this.initializedDataTable();
    this.isLoading = false; 
  }

  // set data source for table
  async initializedDataTable() {
    this.bbDataSourceRaw = new MatTableDataSource( this.bbData );
    this.dataSource = this.bbDataSourceRaw;
    this.setDataSourceAttributes( this.dataSource );
  }

  // set form for filtering
  initliazeFilterForm() {
    this.filterForm = new FormGroup({
      batterId: new FormControl( '' ),
      pitcherId: new FormControl( '' ),
      outcome: new FormControl( '' )
    });
  }

  submitForm() {
    const filterAttributes = {} as any; // fields and corresponding filter values

    if ( this.filterForm.controls['outcome'].value ) {
      filterAttributes[ 'play_outcome' ] = this.filterForm.controls['outcome'].value;
    }

    if ( this.filterForm.controls['batterId'].value  ) {
      filterAttributes [ 'batter_id' ] = parseInt( this.filterForm.controls['batterId'].value );
    }

    if ( this.filterForm.controls['pitcherId'].value  ) {
      filterAttributes [ 'pitcher_id' ] = parseInt( this.filterForm.controls['pitcherId'].value );
    }

    // filter on available attributes
    const filteredBbData = _.filter(this.bbData, filterAttributes );

    // update data source 
    this.bbDataSourceFiltered = new MatTableDataSource( filteredBbData );
    this.setDataSourceAttributes( this.bbDataSourceFiltered );
    this.dataSource = this.bbDataSourceFiltered
  }
  
  clearForm() {
    this.filterForm.reset( {
      batterId: '',
      pitcherId: '',
      launchAngle: null,
      exitVelocity: null,
      distance: null,
      outcome: ''
    } );

    // reset data source to unfilered data
    this.dataSource = this.bbDataSourceRaw;
  }

  onError() {
    this.isError = true;
  }

  openVideoModal( row: any ) {
    this.dialog.open( ViewVideoDialogComponent, {
      data: {
        url: row.video_link,
        date: row.game_date,
        batter: row.batter,
        outcome: row.play_outcome
      },
      width: '800px',
      height: '600px'
    } );
  }

}
