import { AfterViewInit, Directive, ElementRef, HostBinding, inject, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';
import { AbstractControl, Validators } from '@angular/forms';

@Directive({
    selector: '[appLabel]'
})
export class LabelDirective implements AfterViewInit, OnChanges {
    @HostBinding('style.display') display = 'block';
    @HostBinding('style.width') width = '100%';
    @HostBinding('style.whiteSpace') whiteSpace = 'normal';
    /** Si se establece, este HTML reemplaza el contenido del <label>. */
    @Input() label: string | null = null;
    /** Si true, añade ":" al final cuando se usa `label`. */
    @Input() appendColon = false;
    private el = inject(ElementRef<HTMLElement>);
    private renderer = inject(Renderer2);
    private _viewInit = false;

    private _required = false;

    @Input()
    set required(control: AbstractControl | null) {
        this._required = !!control && (control.hasValidator(Validators.required) || control.hasValidator(Validators.requiredTrue));
        if (this._viewInit) this.updateRequiredIcon();
    }

    ngAfterViewInit(): void {
        this._viewInit = true;

        // Si viene [label], reemplaza el contenido; si no, conserva lo proyectado.
        if (this.label != null && this.label !== '') {
            const html = this.appendColon ? `${this.label}:` : this.label;
            this.setInnerHTML(html);
        }

        this.updateRequiredIcon();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (!this._viewInit) return;

        if ('label' in changes || 'appendColon' in changes) {
            if (this.label != null && this.label !== '') {
                const html = this.appendColon ? `${this.label}:` : this.label;
                this.setInnerHTML(html);
                this.updateRequiredIcon(); // reinsertar ícono si hace falta
            }
            // Si label pasa a vacío, no tocamos el contenido proyectado actual.
        }
    }

    private setInnerHTML(html: string) {
        // Reemplaza el HTML del label (controlado por el dev).
        this.renderer.setProperty(this.el.nativeElement, 'innerHTML', html + ':');
    }

    private updateRequiredIcon(): void {
        const host = this.el.nativeElement;
        const existing = host.querySelector('[data-app-label-icon="true"]');

        if (this._required) {
            if (!existing) {
                const icon = this.renderer.createElement('i');
                this.renderer.setAttribute(icon, 'data-app-label-icon', 'true');
                this.renderer.addClass(icon, 'pi');
                this.renderer.addClass(icon, 'pi-asterisk');
                this.renderer.addClass(icon, 'text-red-500');
                this.renderer.addClass(icon, 'mr-1');
                this.renderer.setStyle(icon, 'font-size', '0.6rem');
                this.renderer.setAttribute(icon, 'aria-hidden', 'true');

                const first = host.firstChild;
                // Insertar al inicio SIN romper las interpolaciones del contenido existente
                this.renderer.insertBefore(host, icon, first);
            }
        } else if (existing) {
            this.renderer.removeChild(host, existing);
        }
    }
}
