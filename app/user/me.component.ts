import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { RouteParams } from '@angular/router-deprecated';

import { User }        from './user';
import { UserService } from './user.service';
@Component({
  selector: 'my-user-detail',
  templateUrl: 'app/user/me.component.html',
  styleUrls: ['app/user/me.component.css']
})
export class MeDetailComponent implements OnInit {
  @Input() user: User;
  @Output() close = new EventEmitter();
  error: any;

  constructor(
    private _userService: UserService,
    private _routeParams: RouteParams) {
  }

  ngOnInit() {
      this._userService.getMe()
          .then(user => this.user = user);
  }
}



/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/