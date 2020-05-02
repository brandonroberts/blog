import { Observable } from 'rxjs';

export interface Params {
  [param: string]: any;
}

export class RouteParams extends Observable<Params> {}