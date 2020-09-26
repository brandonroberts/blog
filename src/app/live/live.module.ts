import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LiveRoutingModule } from './live-routing.module';
import { LiveComponentModule } from './live.component';

@NgModule({
  imports: [
    CommonModule,
    LiveRoutingModule,
    LiveComponentModule
  ],
})
export class LiveModule {}
