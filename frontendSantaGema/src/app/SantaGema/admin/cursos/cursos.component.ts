import { Component, OnInit } from '@angular/core';
import { CountryService } from 'src/app/demo/service/country.service';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.scss']
})
export class CursosComponent implements OnInit{
  selectedCountryAdvanced: any[] = [];
  filteredCountries: any[] = [];
  countries: any[] = [];
  constructor(private countryService: CountryService){}

  ngOnInit(): void {
    this.countryService.getCountries().then(countries => {
      this.countries = countries;
  });
  }

  filterCountry(event: any) {
    const filtered: any[] = [];
    const query = event.query;
    for (let i = 0; i < this.countries.length; i++) {
        const country = this.countries[i];
        if (country.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
            filtered.push(country);
        }
    }

    this.filteredCountries = filtered;
}
}
