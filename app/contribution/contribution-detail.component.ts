import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { RouteParams } from '@angular/router-deprecated';
import { Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';

import { Contribution }        from './contribution';
import { ContributionService } from './contribution.service';
import { UserService } from '../user/user.service'
@Component({
    selector: 'my-contribution-detail',
    templateUrl: 'contribution/contribution-detail.component.html',
    styleUrls: ['contribution/contribution-detail.component.css'],
    directives: [ROUTER_DIRECTIVES],
})
export class ContributionDetailComponent implements OnInit {
    @Input() contribution:Contribution;
    @Output() close = new EventEmitter();
    error:any;
    comment = new Contribution();
    navigated = false; // true if navigated here
    name:String;
    comments:Contribution[];

    constructor(private _contributionService:ContributionService,
                private _routeParams:RouteParams,
                private _userService:UserService,
                private router:Router) {
    }

    ngOnInit() {
        if (this._routeParams.get('id') !== null) {
            this.comments = [];
            let id = +this._routeParams.get('id');
            this.navigated = true;
            this._contributionService.getPost(id)
                .then(contribution => {
                    this._userService.getUser(contribution.user_id).then(user1=> {
                            contribution.user = user1;
                            contribution.user_name = user1.name;
                            contribution.user_id = user1.id;
                            //contribution.comments.sort((c1, c2) => (new Date(c1.created_at)).getTime() - (new Date(c2.created_at)).getTime());
                            for (let com of contribution.comments) {
                                this._userService.getUser(com.user_id).then(user2 => {
                                    com.user = user2;
                                    com.user_name = user2.name;
                                    this._contributionService.getComment(com.id).then(comment => {
                                        comment.user_name= user2.name;
                                        for (let rep of comment.comments) {
                                            this._userService.getUser(rep.user_id).then(user => {
                                                rep.user_name = user.name;

                                            });
                                        }
                                        this.comments.push(comment);
                                        this.comments = this.comments.sort((c1, c2) => (new Date(c1.created_at)).getTime() - (new Date(c2.created_at)).getTime());

                                    });

                                })
                            }
                        }
                    );
                    this.contribution = contribution;
                });
        }
        else {
            this.navigated = false;
        }
    }

    postComment(text:string, parent:number) {
        this._contributionService.postComment(text, parent).then(comment=> {
            this._userService.getMe().then(me=> {
                comment.user = me;
                comment.user_name = me.name;
                comment.user_id = me.id;
                this.comments.push(comment);
                this.comment = new Contribution();
            })
        })

    }

    loggedIn() {
        return this._contributionService.loggedIn();
    }

    vote(contribution:Contribution) {
        this._contributionService.postVote(contribution.id).then(vote => {
            contribution.upvote += 1;
            contribution.canVote = false;
        }).catch(error => {
            contribution.canVote = false;
            alert('You can\'t vote here');
        });
    }


}

/*
 Copyright 2016 Google Inc. All Rights Reserved.
 Use of this source code is governed by an MIT-style license that
 can be found in the LICENSE file at http://angular.io/license
 */