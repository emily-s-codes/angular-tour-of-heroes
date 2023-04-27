import { Component, Input } from '@angular/core';
import { Hero } from '../hero';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent {
  @Input() hero?: Hero

  constructor(
    // like useParams()
    private route: ActivatedRoute,

    // gets hero data from server
    private heroService: HeroService,

    // interaction with browser: allows back and forward navigation
    private location: Location
  ) { }

  ngOnInit(): void {
    this.getHero()
  }

  getHero(): void {
    // Route params are always strings
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.heroService.getHero(id)
      .subscribe(hero => this.hero = hero)
  }

  goBack(): void {
    this.location.back()
  }

  save(): void {
    if (this.hero) {
      this.heroService.updateHero(this.hero)
        .subscribe(() => this.goBack())
    }
  }
}
