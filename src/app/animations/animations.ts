// src/app/animations.ts
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

export const slideInOut = trigger('slideInOut', [
  transition(':enter', [
    style({ transform: 'translateX(-100%)'}),
    animate('600ms ease-in', style({ transform: 'translateX(0)'}))
  ]),
  transition(':leave', [
    animate('600ms ease-out', style({ transform: 'translateX(-100%)'}))
  ])
]);
export const slideOutIn = trigger('slideOutIn', [
  transition(':enter', [
    style({ transform: 'translateX(100%)'}),
    animate('600ms ease-in', style({ transform: 'translateX(0)'}))
  ]),
  transition(':leave', [
    animate('600ms ease-out', style({ transform: 'translateX(100%)'}))
  ])
]);
export const slideDown= trigger('slideDown', [
  transition('void => visible', [
    style({ transform: 'translateY(-100%)'}),
    animate('1000ms ease', style({ transform: 'translateY(0)'}))
  ])
]);  
// Slide up animation for elements entering the view    
export const slideUp = trigger('slideUp', [
  transition('void => visible', [ 
    style({ transform: 'translateY(100%)', opacity: 0 }), 
    animate('1000ms ease', style({ transform: 'translateY(0)', opacity: 1 }))
  ])
]);  
export const zoomIn = trigger('zoomIn', [
  transition('void => visible', [
    style({ transform: 'scale(0)', opacity: 0 }),
    animate('1000ms ease', style({ transform: 'scale(1)', opacity: 1 }))
  ])
]);
