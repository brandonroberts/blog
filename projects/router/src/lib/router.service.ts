import { Injectable } from '@angular/core';
import { PlatformLocation, LocationStrategy } from '@angular/common';

import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { UrlParser } from './url-parser';

@Injectable({
  providedIn: 'root'
})
export class Router {
  private _url$ = new BehaviorSubject<string>(this.getLocation());
  url$ = this._url$.pipe(distinctUntilChanged());

  private _queryParams$ = new BehaviorSubject({});
  queryParams$ = this._queryParams$.pipe(distinctUntilChanged());

  private _hash$ = new BehaviorSubject('');
  hash$ = this._hash$.pipe(distinctUntilChanged());

  constructor(
    private location: LocationStrategy,
    private platformLocation: PlatformLocation,
    private urlParser: UrlParser
  ) {
    this.location.onPopState(() => {
      this.nextState(this.getLocation());
    });

    this.nextState(this.getLocation());
  }

  go(url: string, queryParams: string = '') {
    this.location.pushState(null, '', this.location.prepareExternalUrl(url), queryParams);

    this.nextState(this.getLocation());
  }

  replace(url: string, queryParams?: string) {
    this.location.replaceState(null, '', this.location.prepareExternalUrl(url), queryParams);

    this.nextState(this.getLocation());
  }

  getExternalUrl(url: string) {
    return this.location.prepareExternalUrl(url);
  }

  private getLocation() {
    return this.platformLocation.href;
  }

  private nextState(url: string) {
    const parsedUrl = this._parseUrl(url);
    this._nextUrl(parsedUrl.pathname);
    this._nextQueryParams(parsedUrl.searchParams);
    this._nextHash(parsedUrl.hash ? parsedUrl.hash.split('#')[0] : '');
  }

  private _parseUrl(path: string): URL {
    return this.urlParser.parse(path);
  }

  private _nextUrl(url: string) {
    this._url$.next(url);
  }

  private _nextQueryParams(params: URLSearchParams) {
    this._queryParams$.next(params);
  }

  private _nextHash(hash: string) {
    this._hash$.next(hash);
  }
}
