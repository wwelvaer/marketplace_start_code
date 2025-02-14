import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {
  transform(array: any[], field: string): any[] {
    if (!Array.isArray(array)) {
        console.log("err")
        
      return;
    }

    array.sort((a: any, b: any) => {
      if (a.value[field] < b.value[field]) {
        
        
        return -1;
      } else if (a[field] > b[field]) {
        return 1;
      } else {
        return 0;
        
      }
    });

    return array;
  }
}