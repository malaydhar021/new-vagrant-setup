import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Log } from 'src/app/helpers/app.helper';
import { UserReviewService } from '../user-review.service';
import { catchError } from 'rxjs/operators';

@Injectable()
export class UserReviewResolver implements Resolve<any> {
    constructor(private userReviewService: UserReviewService) { }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return this.userReviewService.getUserReviewLinkInfo(route.params.slug).pipe(catchError((error, caught) => {
            Log.info(error, "error in user review resolver")
            return of(error);
        }) as any);
    }
}