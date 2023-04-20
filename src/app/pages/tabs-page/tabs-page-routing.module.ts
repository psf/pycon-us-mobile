import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs-page';
import { SchedulePage } from '../schedule/schedule';
import { ScheduleListPageModule } from '../schedule-list/schedule-list.module';


const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'schedule',
        children: [
          {
            path: '',
            component: SchedulePage,
          },
          {
            path: 'session/:sessionId',
            loadChildren: () => import('../session-detail/session-detail.module').then(m => m.SessionDetailModule)
          }
        ]
      },
      {
        path: 'tracks',
        children: [
          {
            path: ':trackSlug',
            loadChildren: () => import('../schedule-list/schedule-list.module').then(m => m.ScheduleListPageModule)
          },
        ]
      },
      {
        path: 'speakers',
        children: [
          {
            path: '',
            loadChildren: () => import('../speaker-list/speaker-list.module').then(m => m.SpeakerListModule)
          },
          {
            path: 'session/:sessionId',
            loadChildren: () => import('../session-detail/session-detail.module').then(m => m.SessionDetailModule)
          },
          {
            path: 'speaker-details/:speakerId',
            loadChildren: () => import('../speaker-detail/speaker-detail.module').then(m => m.SpeakerDetailModule)
          }
        ]
      },
      {
        path: 'sponsors',
        children: [
          {
            path: '',
            loadChildren: () => import('../sponsors/sponsors.module').then(m => m.SponsorsPageModule)
          }
        ]
      },
      {
        path: 'lead-retrieval',
        children: [
          {
            path: '',
            loadChildren: () => import('../map/map.module').then(m => m.MapModule)
          }
        ]
      },
      {
        path: 'door-check',
        children: [
          {
            path: '',
            loadChildren: () => import('../door-check/door-check.module').then(m => m.DoorCheckPageModule)
          }
        ]
      },
      {
        path: 'about-pycon',
        children: [
          {
            path: '',
            loadChildren: () => import('../about-pycon/about-pycon.module').then(m => m.AboutPyconPageModule)
          }
        ]
      },
      {
        path: 'about-psf',
        children: [
          {
            path: '',
            loadChildren: () => import('../about-psf/about-psf.module').then(m => m.AboutPsfPageModule)
          }
        ]
      },
      {
        path: 'social-media',
        children: [
          {
            path: '',
            loadChildren: () => import('../social-media/social-media.module').then(m => m.SocialMediaPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/app/tabs/schedule',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }

