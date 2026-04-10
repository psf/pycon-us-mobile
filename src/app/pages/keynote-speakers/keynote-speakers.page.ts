import { Component, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { LiveUpdateService } from '../../providers/live-update.service';

interface KeynoteSpeaker {
  name: string;
  photo: string;
  bio: string;
}

interface SteeringCouncilMember {
  name: string;
  photo: string;
}

interface SteeringCouncil {
  name: string;
  members: SteeringCouncilMember[];
  bio: string;
}

@Component({
  selector: 'app-keynote-speakers',
  templateUrl: './keynote-speakers.page.html',
  styleUrls: ['./keynote-speakers.page.scss'],
})
export class KeynoteSpeakersPage {
  @ViewChild(IonContent) content: IonContent;
  showTitle = false;

  speakers: KeynoteSpeaker[] = [
    {
      name: 'Lin Qiao',
      photo: 'https://pycon-assets.s3.amazonaws.com/2026/media/images/lin_qiao.original.jpg',
      bio: 'Lin Qiao is the CEO and co-founder of global AI inference cloud and infrastructure platform Fireworks AI, enables teams like Cursor, Uber, DoorDash, and Shopify to build, tune, and scale highly optimized generative AI applications. Prior to founding Fireworks, Lin was the co-creator and head of Meta\'s PyTorch.',
    },
    {
      name: 'amanda casari',
      photo: 'https://pycon-assets.s3.amazonaws.com/2026/media/images/amcasari-headshot.original.png',
      bio: 'amanda casari is an engineer and researcher who has worked in many technical and socio-technical disciplines for over 20 years, including developer relations, product management, data science, and underwater robotics. amanda was named an External Faculty member of the Vermont Complex Systems Center in 2021 and co-authored Feature Engineering for Machine Learning Principles and Techniques for Data Scientists for O\'Reilly.',
    },
    {
      name: 'Tim Schilling',
      photo: 'https://pycon-assets.s3.amazonaws.com/2026/media/images/Tim_Schilling.original.jpg',
      bio: 'I\'m a software engineer that loves Django and our community. I\'m on the Django Steering Council, a cofounder of Djangonaut Space and an admin of Django Commons. I\'ve been helping maintain django-debug-toolbar and a few other packages.',
    },
    {
      name: 'Rachell Calhoun',
      photo: 'https://pycon-assets.s3.amazonaws.com/2026/media/images/rachell_calhoun.original.jpg',
      bio: 'I\'m Rachell, co-founder of Djangonaut Space and a Django developer. I love building practical, user-friendly tools and creating communities where people walk away with new skills, confidence, and some new friends. I\'ve organized Django Girls workshops across multiple countries and continents for over 10 years.',
    },
    {
      name: 'Pablo Galindo Salgado',
      photo: 'https://pycon-assets.s3.amazonaws.com/2026/media/images/Pablo_Galindo_Salgado.original.jpg',
      bio: 'Pablo Galindo Salgado works in the Python team of Hudson River Trading. He is a CPython core developer and a Theoretical Physicist specializing in general relativity and black hole physics. He is currently serving on the Python Steering Council in his 6th term and he is the release manager for Python 3.10 and 3.11.',
    },
  ];

  steeringCouncil: SteeringCouncil = {
    name: 'Python Steering Council',
    members: [
      { name: 'Barry Warsaw', photo: 'https://pycon-assets.s3.amazonaws.com/2026/media/images/Barry_PyCon.max-165x165.jpg' },
      { name: 'Donghee Na', photo: 'https://pycon-assets.s3.amazonaws.com/2026/media/images/donghee_na.max-165x165.jpg' },
      { name: 'Pablo Galindo Salgado', photo: 'https://pycon-assets.s3.amazonaws.com/2026/media/images/Pablo_Galindo_Salgado.max-165x165.jpg' },
      { name: 'Savannah Ostrowski', photo: 'https://pycon-assets.s3.amazonaws.com/2026/media/images/savannah.max-165x165.jpg' },
      { name: 'Thomas Wouters', photo: 'https://pycon-assets.s3.amazonaws.com/2026/media/images/Thomas_Wouters.max-165x165.jpg' },
    ],
    bio: 'The Python Steering Council is a 5-person elected committee that assumes a mandate to maintain the quality and stability of the Python language and CPython interpreter, improve the contributor experience, formalize and maintain a relationship between the Python core team and the PSF, establish decision making processes for Python Enhancement Proposals, seek consensus among contributors and the Python core team, and resolve decisions and disputes in decision making among the language.',
  };

  constructor(public liveUpdateService: LiveUpdateService) {}

  onScroll(event: any) {
    this.showTitle = event.detail.scrollTop > 100;
  }
}
