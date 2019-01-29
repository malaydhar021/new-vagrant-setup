import { NgModule } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatRadioModule} from '@angular/material';

@NgModule({
  imports: [MatButtonModule, MatSlideToggleModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatRadioModule],
  exports: [MatButtonModule, MatSlideToggleModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatRadioModule],
})
export class MaterialModule { }
