import { Component, NgModule } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer>
      <div class="bg-blue-600 py-4 flex justify-center">
        <div class="text-white">© Copyright 2019-2021</div>
      </div>
    </footer>
  `,
})
export class FooterComponent {}

@NgModule({
  declarations: [FooterComponent],
  exports: [FooterComponent],
})
export class FooterComponentModule {}
