import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  // of(HEROES) returns Observable<Hero[]> emitting single value i.e. array of heroes
  getHeroes(): Observable<Hero[]> {
    const heroes = of(HEROES)
    this.messageService.add('HeroService: fetched heroes')
    return heroes
  }
  constructor(private messageService: MessageService) { }
}
