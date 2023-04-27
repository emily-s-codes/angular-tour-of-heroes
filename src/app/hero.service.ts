import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private heroesURL = 'api/heroes'

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  getHeroes(): Observable<Hero[]> {

    // for ./mock-heroes example
    //     of(HEROES) returns Observable<Hero[]> emitting single value i.e. array of heroes
    // const heroes = of(HEROES)
    // this.messageService.add('HeroService: fetched heroes')
    // return heroes

    // for HttpClient example
    return this.http.get<Hero[]>(this.heroesURL)
      // extend observable result with pipe method and catchError() operator
      .pipe(
        tap(_ => this.log('fetched heroes')),
        catchError(this.handleError<Hero[]>('getHeroes', []))
      )
  }

  getHero(id: number): Observable<Hero> {

    // for ./mock-heroes example ** note, needed to make return value union type with undefined and Hero
    // const hero = HEROES.find(h => h.id === id);
    // this.messageService.add(`HeroService: fetched hero id=${id}`);
    // return of(hero)

    // for HttpClient example
    const url = `${this.heroesURL}/${id}`
    return this.http.get<Hero>(url)
      .pipe(
        tap(_ => this.log(`fetched hero id=${id}`)),
        catchError(this.handleError<Hero>(`getHero id=${id}`))
      )

  }

  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesURL, hero, this.httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    )
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesURL, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero with id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    )
  }

  deleteHero(id: number): Observable<Hero> {
    const url = `${this.heroesURL}/${id}`

    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    )
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      return of([]) // if no search term, return empty array of heroes
    }
    return this.http.get<Hero[]>(`${this.heroesURL}/?name=${term}`).pipe(
      tap(x => x.length ?
        this.log(`found heroes matching "${term}"`) :
        this.log(`no heroes matching "${term}"`)
      ),
      catchError(this.handleError<Hero[]>(`searchHeroes`, []))
    )
  }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  /**
 * Handle Http operation that failed.
 * Let the app continue.
 *
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result (SAFE).
      return of(result as T);
    };
  }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`)
  }
}
