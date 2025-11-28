import { Component, OnInit } from '@angular/core';
import { User, UsersService } from "../users.service";
import * as ChartJs from 'chart.js/auto';
import { List } from 'immutable';
@Component({
  selector: 'app-rh',
  templateUrl: './rh.component.html',
  styleUrls: ['./rh.component.css'],
})
export class RhComponent implements OnInit {
  oddUsers: List<User>;
  evenUsers: List<User>;
  userFullNameEven: string = '';
  userFullNameOdd: string = '';
  chart: any;
  constructor(private userService: UsersService) {
    this.oddUsers = this.userService.getOddOrEven(true);
    this.evenUsers = this.userService.getOddOrEven();
  }

  ngOnInit(): void {
    this.createChart();
  }
  addEvenUser(list: List<User>, newUser: string) {
    this.evenUsers = this.userService.addUser(list, newUser);
  }
  addOddUser(list: List<User>, newUser: string) {
    this.oddUsers = this.userService.addUser(list, newUser);
  }
  createChart() {
    const data = [
      { users: 'Workers', count: this.oddUsers.size },
      { users: 'Boss', count: this.evenUsers.size },
    ];
    this.chart = new ChartJs.Chart("MyChart",
      {
        type: 'bar',
        data: {
          labels: data.map(row => row.users),
          datasets: [
            {
              label: 'Entreprise stats',
              data: data.map(row => row.count)
            }
          ]
        }
      });
  }
}
