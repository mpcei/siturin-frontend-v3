import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from '@services/auth';

@Injectable({
  providedIn: 'root'
})
export class ValidatedQuestionGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkValidatedQuestions();
  }

  private checkValidatedQuestions(): boolean {
    console.log('entro aqui');
    if (this.authService.token) {
      if (!this.authService.auth.validatedQuestions){
        this.router.navigate(['/administration/users/validated-questions']);
        return false;
      }

      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}
