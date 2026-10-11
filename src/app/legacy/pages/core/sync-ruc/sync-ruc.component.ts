import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {environment} from "@env/environment";

@Component({
    selector: 'app-sync-ruc',
    templateUrl: './sync-ruc.component.html',
    styleUrls: ['./sync-ruc.component.scss']
})
export class SyncRucComponent implements OnInit {

  constructor(private readonly httpClient: HttpClient) {
  }

  ngOnInit(): void {
    this.obtenerRucs();
  }

  obtenerRucs() {
    this.httpClient.get(environment.API_URL_PRIVATE + '/sync-rucs').subscribe(res => {
      // console.log(res);
    });
  }
}
