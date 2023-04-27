import { Component, OnInit } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import {
  debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators'

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css']
})
export class HeroSearchComponent implements OnInit {
  heroes$!: Observable<Hero[]>
  // Subject is observable as well as source of observable values, can be subscribed to
  private searchTerms = new Subject<string>()

  constructor(private heroService: HeroService) { }

  search(term: string): void {
    // .next(x) pushes x to Subject
    this.searchTerms.next(term)
  }

  ngOnInit(): void {
    this.heroes$ = this.searchTerms.pipe(
      debounceTime(300), // wait 300ms after keystroke before considering term
      distinctUntilChanged(), // request is sent only if text is changed
      switchMap((term: string) => this.heroService.searchHeroes(term)) // calls service if search term makes it through above two functions
      // switchMap also preserves call order and only returns results from most recent request, discarding the rest
      // this isn't a cancellation of the request: results just don't reach the app
    )
  }
}
