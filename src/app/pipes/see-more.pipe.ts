import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'seeMore',
  standalone: true
})
export class SeeMorePipe implements PipeTransform {
  transform(title: string | undefined | null, number: number): string {
    if (!title || typeof title !== 'string') {
      return '';
    }
    const words = title.split(" ");
    const slicedWords = words.slice(0, number);
    return slicedWords.join(" ")+ (words.length > number ? '...' : '');
  }
}
