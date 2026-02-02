import { Component, inject, OnInit } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { AppointmentHttpService } from '@/pages/core/roles/owner/services';
import { CustomMessageService } from '@utils/services';
import { Dialog } from 'primeng/dialog';
import { DatePicker } from 'primeng/datepicker';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { InputText } from 'primeng/inputtext';
import { LabelDirective } from '@utils/directives/label.directive';
import { Message } from 'primeng/message';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Select } from 'primeng/select';
import { Textarea } from 'primeng/textarea';
import { Button } from 'primeng/button';
import { CatalogueInterface } from '@utils/interfaces';
import { FontAwesome } from '@/api/font-awesome';

@Component({
    selector: 'app-appointments',
    imports: [FullCalendarModule, Dialog, DatePicker, ErrorMessageDirective, InputText, LabelDirective, Message, ReactiveFormsModule, Select, Textarea, Button],
    templateUrl: './appointments.html',
    styleUrl: './appointments.scss'
})
export class Appointments implements OnInit {
    states: CatalogueInterface[] = [
        { code: 'pending', name: 'Pendiente' },
        { code: 'confirmed', name: 'Confirmada' },
        { code: 'cancelled', name: 'Cancelado' }
    ];
    options!: CalendarOptions;
    showDialog = false;
    selectedEvent: any;
    serviceColors: Record<string, string> = {
        pending: '#ffff00',
        confirmed: '#00ec00',
        cancelled: '#ef4444',
        completed: '#00008b'
    };
    events: any[] = [];
    protected form!: FormGroup;
    protected services: string[] = ['Manicura', 'Depilado de cejas'];
    protected currentDate = new Date();

    protected readonly onsubmit = onsubmit;
    private customMessageService = inject(CustomMessageService);
    private appointmentHttpService = inject(AppointmentHttpService);
    private readonly formBuilder = inject(FormBuilder);

    constructor() {
        this.buildForm();
    }

    get idField(): AbstractControl {
        return this.form.controls['id'];
    }

    get identificationField(): AbstractControl {
        return this.form.controls['identification'];
    }

    get nameField(): AbstractControl {
        return this.form.controls['name'];
    }

    get emailField(): AbstractControl {
        return this.form.controls['email'];
    }

    get phoneField(): AbstractControl {
        return this.form.controls['phone'];
    }

    get serviceField(): AbstractControl {
        return this.form.controls['service'];
    }

    get dateField(): AbstractControl {
        return this.form.controls['date'];
    }

    get notesField(): AbstractControl {
        return this.form.controls['notes'];
    }

    get statusField(): AbstractControl {
        return this.form.controls['status'];
    }

    async ngOnInit() {
        await this.loadAppointments();
    }

    async loadAppointments() {
        const appointments: any = [];

        if (!appointments) {
            this.customMessageService.showError({ summary: 'No existen citas', detail: 'Vuelva a intentar más tarde' });
            return;
        }

        this.events = appointments.map((a: any) => ({
            id: a.id,
            title: a.service,
            start: a.date?.toDate ? a.date.toDate() : a.date,
            color: this.serviceColors[a.status] ?? '#2563eb',
            backgroundColor: this.serviceColors[a.status] ?? '#fff',
            textColor: '#000',
            borderColor: this.serviceColors[a.status],
            extendedProps: { date: a.date, status: a.status, notes: a.notes, customer: { ...a.customer } }
        }));

        this.options = {
            plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
            initialView: 'dayGridMonth',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            selectable: true,
            editable: true,
            events: this.events,
            dateClick: (info) => {
                console.log('click date', info.dateStr);
            },
            eventClick: (info) => {
                this.selectedEvent = info.event;

                const customer = this.selectedEvent.extendedProps.customer;

                this.idField.patchValue(this.selectedEvent.id);
                this.identificationField.patchValue(customer.identification);
                this.nameField.patchValue(customer.name);
                this.emailField.patchValue(customer.email);
                this.phoneField.patchValue(customer.phone);
                this.serviceField.patchValue(this.selectedEvent.title);
                this.statusField.patchValue(this.selectedEvent.extendedProps.status);
                this.dateField.patchValue(this.selectedEvent.extendedProps.date.toDate());
                this.notesField.patchValue(this.selectedEvent.extendedProps.notes);

                console.log(this.statusField.value);
                console.log(this.selectedEvent);

                this.showDialog = true;
            },
            eventDrop: (info) => {
                console.log('Evento movido');
                console.log('ID:', info.event.id);
                console.log('Nuevo inicio:', info.event.start);
                console.log('Nuevo fin:', info.event.end);
            }
        };
    }

    buildForm() {
        this.form = this.formBuilder.group({
            id: [null, [Validators.required]],
            identification: [null, [Validators.required, Validators.minLength(9)]],
            name: [null, [Validators.required]],
            email: [null, [Validators.email]],
            phone: [null, [Validators.required]],
            service: [null, [Validators.required]],
            date: [null, [Validators.required]],
            status: [null, [Validators.required]],
            notes: [null]
        });
    }

    async onSubmit() {
        if (this.validateForm()) {
            //TODO updateAppointment
            const index = this.events.findIndex((item) => item.id === this.idField.value);
            this.events[index] = {
                id: this.idField.value,
                title: this.serviceField.value,
                start: this.dateField.value?.toDate ? this.dateField.value.date.toDate() : this.dateField.value.date,
                color: this.serviceColors[this.statusField.value] ?? '#2563eb',
                backgroundColor: this.serviceColors[this.statusField.value] ?? '#fff',
                textColor: '#000',
                borderColor: this.serviceColors[this.statusField.value],
                extendedProps: {
                    date: this.dateField.value,
                    status: this.statusField.value,
                    notes: this.notesField.value,
                    customer: { identification: this.identificationField.value, name: this.nameField.value, email: this.emailField.value, phone: this.phoneField.value }
                }
            };

            console.log(this.events);
            this.showDialog = false;
            this.form.reset();
        }
    }

    validateForm() {
        const errors = [];

        if (this.identificationField.invalid) errors.push('Indentificación');

        if (this.nameField.invalid) errors.push('Nombre del cliente');

        if (this.emailField.invalid) errors.push('Correo');

        if (this.phoneField.invalid) errors.push('Teléfono');

        if (this.serviceField.invalid) errors.push('Servicio');

        if (this.dateField.invalid) errors.push('Fecha de la cita');

        if (this.notesField.invalid) errors.push('nota');

        if (errors.length > 0) {
            this.customMessageService.showFormErrors(errors);
            this.form.markAllAsTouched();
            return false;
        }

        return true;
    }

    confirm() {}

    cancel() {}

    protected readonly FontAwesome = FontAwesome;
}
