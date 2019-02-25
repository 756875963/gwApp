import { NgModule } from '@angular/core';
import { SxypiePipe } from './sxypie/sxypie';
import { TimePassagePipe } from './time-passage/time-passage';
import { StarObjectPipe } from './star-object/star-object';
@NgModule({
	declarations: [SxypiePipe,
    TimePassagePipe,
    StarObjectPipe],
	imports: [],
	exports: [SxypiePipe,
    TimePassagePipe,
    StarObjectPipe]
})
export class PipesModule {

	
}
