// src/app/animations.ts
import { trigger, style, animate, transition, state } from '@angular/animations';

/**
 * Slide from left to right on enter,
 * and right to left on leave.
 */
export const slideInOut = trigger('slideInOut', [
  transition(':enter', [
    style({ transform: 'translateX(-100%)' }),
    animate('600ms ease-in', style({ transform: 'translateX(0)' }))
  ]),
  transition(':leave', [
    animate('600ms ease-out', style({ transform: 'translateX(-100%)' }))
  ])
]);

/**
 * Slide from right to left on enter,
 * and left to right on leave.
 */
export const slideOutIn = trigger('slideOutIn', [
  transition(':enter', [
    style({ transform: 'translateX(100%)' }),
    animate('600ms ease-in', style({ transform: 'translateX(0)' }))
  ]),
  transition(':leave', [
    animate('600ms ease-out', style({ transform: 'translateX(100%)' }))
  ])
]);

/**
 * Slide down from top to original position.
 */
export const zoomIn = trigger('zoomIn', [
  state('hidden', style({ transform: 'scale(0)', opacity: 0 })),
  state('enter', style({ transform: 'scale(1)', opacity: 1 })),
  transition('hidden => enter', [
    animate('1000ms ease')
  ])
]);

export const slideDown = trigger('slideDown', [
  state('hidden', style({ transform: 'translateY(-100%)', opacity: 0 })),
  state('enter', style({ transform: 'translateY(0)', opacity: 1 })),
  transition('hidden => enter', [
    animate('1000ms ease')
  ])
]);

export const slideUp = trigger('slideUp', [
  state('hidden', style({ transform: 'translateY(100%)', opacity: 0 })),
  state('enter', style({ transform: 'translateY(0)', opacity: 1 })),
  transition('hidden => enter', [
    animate('1000ms ease')
  ])
]);
export const slideDownUp = trigger('slideDownUp', [
  transition(':enter', [
    style({ transform: 'translateY(100%)' }),
    animate('300ms ease-in', style({ transform: 'translateY(0)' }))
  ]),
  transition(':leave', [
    animate('300ms ease-out', style({ transform: 'translateY(100%)' }))
  ])
]);