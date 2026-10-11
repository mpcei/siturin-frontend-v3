import {Directive, ElementRef, HostBinding, Input, OnInit, Renderer2} from '@angular/core';
import {AbstractControl, FormArray, Validators} from "@angular/forms";

@Directive({ selector: '[appLabel]' })
export class LabelDirective implements OnInit {
  @HostBinding('style.display') display = 'block';
  @HostBinding('style.width') width = '100%';
  @HostBinding('style.white-space') whiteSpace = 'normal';
  private _required: boolean = false;
  private i: any;
  nativeElement: any;
  @Input() label: string = '';

  @Input() set required(value: AbstractControl | null) {
    if (value) {
      this._required = value.hasValidator(Validators.required) || value.hasValidator(Validators.requiredTrue);
    }
  }

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.nativeElement = el.nativeElement;
    this.i = this.renderer.createElement('i');
  }

  ngOnInit(): void {
    if (this.label) {
      this.renderer.setProperty(this.el.nativeElement, 'textContent', '');
      const txt = this.renderer.createText(this.label + ' ');
      this.renderer.appendChild(this.el.nativeElement, txt);
    }

    if (this._required) {
      const requiredIcon = this.renderer.createElement('i');
      this.renderer.addClass(requiredIcon, 'p-error');
      this.renderer.appendChild(requiredIcon, this.renderer.createText(' (*)'));
      this.renderer.appendChild(this.el.nativeElement, requiredIcon);
    }
  }
}
