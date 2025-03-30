import {
  animate,
  keyframes,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export class AnimationProvider {
  public static animations: any[] = [
    trigger('typingDots', [
      state('start', style({ opacity: 1 })),
      state('end', style({ opacity: 1 })),
      transition('start <=> end', [
        animate(
          '1.5s ease-in-out',
          keyframes([
            style({ opacity: 1, offset: 0 }),
            style({ opacity: 0.75, offset: 0.25 }),
            style({ opacity: 0.5, offset: 0.5 }),
            style({ opacity: 0.75, offset: 0.75 }),
            style({ opacity: 1, offset: 1 }),
          ])
        ),
      ]),
    ]),
    trigger('shake', [
      state('start', style({})),
      state('end', style({})),
      transition('start <=> end', [
        animate(
          '0.5s',
          keyframes([
            style({ transform: 'translate3d(-1px, 0, 0)', offset: 0.1 }),
            style({ transform: 'translate3d(2px, 0, 0)', offset: 0.2 }),
            style({ transform: 'translate3d(-4px, 0, 0)', offset: 0.3 }),
            style({ transform: 'translate3d(4px, 0, 0)', offset: 0.4 }),
            style({ transform: 'translate3d(-4px, 0, 0)', offset: 0.5 }),
            style({ transform: 'translate3d(4px, 0, 0)', offset: 0.6 }),
            style({ transform: 'translate3d(-4px, 0, 0)', offset: 0.7 }),
            style({ transform: 'translate3d(2px, 0, 0)', offset: 0.8 }),
            style({ transform: 'translate3d(-1px, 0, 0)', offset: 0.9 }),
          ])
        ),
      ]),
    ]),
  ];
}
