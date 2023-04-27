import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {
  // hero: Hero = {
  //   id: 1,
  //   name: 'Windstorm'
  // };
  heroes: Hero[] = [];
  selectedHero?: Hero;

  // defines private property 'heroService' and makes it the site of the injection of HeroService
  constructor(private heroService: HeroService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.getHeroes()
  }

  onSelect(hero: Hero): void {
    this.selectedHero = hero
    this.messageService.add(`HeroesComponent: Selected hero id=${hero.id}`)
  }

  // SYNCHRONOUS version only works if server can instantaneously return value (as if the browser can freeze the UI while waiting for a response)
  // getHeroes(): void {
  //   this.heroes = this.heroService.getHeroes();
  // }

  // ASYNC version with observable waits for the observable to deliver the requested data. subscribe() passes value to callback i.e. setting component's heroes property
  getHeroes(): void {
    this.heroService.getHeroes()
      .subscribe(heroes => this.heroes = heroes)
  }

}
