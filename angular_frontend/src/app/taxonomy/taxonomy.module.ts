import { NgModule } from '@angular/core';
import { OrderByPipe } from './orderby.pipe';


@NgModule({
    declarations: [
        OrderByPipe
    ],
    exports: [
        OrderByPipe]
    })

    export class TaxonomyModule {}