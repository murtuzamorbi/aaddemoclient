import { Component } from '@angular/core';
import {MsAdalAngular6Service} from 'microsoft-adal-angular6';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'aaddemoclient';

  constructor(private httpClient: HttpClient, private adalService: MsAdalAngular6Service) {}

  public call1(): void {
    console.log(this.adalService.userInfo);

    this.httpClient.get('http://localhost:8080/home')
      .subscribe(t => console.log(t));
  }

  public call2(): void {
    this.httpClient.get('http://localhost:8080/api/group1')
      .subscribe(t => console.log(t));
  }

  public logout(): void {
    this.adalService.logout();
  }
}
