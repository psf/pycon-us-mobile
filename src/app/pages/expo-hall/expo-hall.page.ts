import { Component, OnInit, ChangeDetectorRef, ViewChild, ViewEncapsulation, AfterViewChecked } from '@angular/core';
import { KeyValue } from '@angular/common';
import { Keyboard } from '@capacitor/keyboard';
import { LoadingController } from '@ionic/angular';

import { ConferenceData } from '../../providers/conference-data';
import { LiveUpdateService } from '../../providers/live-update.service';


@Component({
  selector: 'app-expo-hall',
  templateUrl: './expo-hall.page.html',
  styleUrls: ['./expo-hall.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ExpoHallPage implements OnInit, AfterViewChecked {
  sponsors: any;
  @ViewChild('search') search : any;
  @ViewChild('mapContainer') mapContainer: any;
  searchQueryText = '';
  queryResults: any[] = [];
  ios: boolean;
  showSearchbar: boolean;
  private scrolled: boolean = false;
  private scrollTarget: any;
  private iterableDiffer;

  constructor(
    private loadingCtrl: LoadingController,
    private confData: ConferenceData,
    private changeDetection: ChangeDetectorRef,
    public liveUpdateService: LiveUpdateService,
  ) {
    this.scrolled = false;
    Keyboard.addListener('keyboardWillShow', (info) => {
      const height = this.mapContainer.nativeElement.offsetHeight;
      this.mapContainer.nativeElement.style.height = height + 'px';
    });
    Keyboard.addListener('keyboardDidShow', info => {
    });
    Keyboard.addListener('keyboardWillHide', () => {
    });
    Keyboard.addListener('keyboardDidHide', () => {
      this.mapContainer.nativeElement.style.height = '100%';
      this.scrollTarget.scrollIntoView();
    });
  }

  reloadSponsors() {
    this.loadingCtrl.create({
      message: 'Fetching latest...',
      duration: 10000,
    }).then((loader) => {
      loader.present();
      this.confData.getSponsors().subscribe((sponsors: any[]) => {
        this.sponsors = sponsors;
        for (const [level, sponsorss] of Object.entries(this.sponsors)) {
          for(const [index, sponsor] of Object.entries(sponsorss)) {
            if (sponsor.booth_number !== null) {
                let elem = document.getElementById("booth"+sponsor.booth_number);
                elem.innerHTML = "<img class=\"booth-img\" src=\"" + sponsor.logo_url+ "\">";
            }
          }
        }
        this.scrolled = false;
        this.changeDetection.detectChanges();
        setTimeout(() => {loader.dismiss()}, 100);
      });
    });
  }

  resetSearch() {
    this.searchQueryText = "";
    this.queryResults = [];
    let elems = document.getElementsByClassName('booth-highlight')
    Array.from(elems).forEach((elem: any) => {elem.classList.remove('booth-highlight');})
  }

  searchSponsors() {
    if (this.searchQueryText === "" || this.searchQueryText === " ") {
      this.resetSearch();
      return;
    }
    this.queryResults = [];
    let elems = document.getElementsByClassName('booth-highlight')
    Array.from(elems).forEach((elem: any) => {elem.classList.remove('booth-highlight');})
    this.confData.querySponsors(this.searchQueryText).subscribe((sponsors: any[]) => {
      this.queryResults = sponsors;
      this.queryResults.forEach((sponsor: any) => {
        let elem = document.getElementById("booth"+sponsor.booth_number);
        elem.classList.add("booth-highlight");
      })
    });
  }

  selectSponsor(sponsor) {
    this.showSearchbar = false;
    this.resetSearch();
    let elem = document.getElementById("booth"+sponsor.booth_number);
    elem.classList.add("booth-highlight");
    this.scrollTarget = elem;
    this.scrollTarget.scrollIntoView();
  }

  async focusButton() {
     setTimeout(() => {
       this.search.setFocus();
     }, 500); // ms delay
   }

  ngOnInit() {
    this.reloadSponsors();
  }

  ngAfterViewChecked() {
    if (this.scrolled === true) {
      return;
    } else {
      document.getElementById("mapContainer").scrollLeft = 200;
      this.scrolled = true;
    }
  }

}
