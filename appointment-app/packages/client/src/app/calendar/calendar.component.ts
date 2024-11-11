import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventInput, CalendarOptions } from '@fullcalendar/core';
import { AppointmentService } from '../appointment.service';
import { Appointment, User } from 'interfaces';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import * as bootstrap from 'bootstrap';
import { AuthService } from '../auth.service';
import { UserService } from '../user.service';

@Component({
  standalone: true,
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  encapsulation: ViewEncapsulation.None,
  imports: [FullCalendarModule, FormsModule, CommonModule],
})
export class CalendarComponent implements OnInit {
  calendarOptions: CalendarOptions = {};
  selectedEvent: any = {};
  isModalOpen: boolean = false;
  public filteredAppointments: Appointment[] = [];
  public appointmentList: Appointment[] = [];
  public isDealer: boolean = false;
  public vehicleOwner: User | undefined;
  public user: any = null;

  constructor(
    private appointmentService: AppointmentService,
    private cdr: ChangeDetectorRef,
    protected readonly authService: AuthService,
    private readonly userService: UserService
  ) {} // Injection des Services

  ngOnInit(): void {
    this.isDealer = this.authService.isDealer(); // Prüfe, ob der Benutzer ein Händler ist
    this.calendarOptions = {
      initialView: 'dayGridMonth',
      plugins: [dayGridPlugin, interactionPlugin],
      events: [],
      eventClick: this.handleEventClick.bind(this),
      dateClick: this.handleDateClick.bind(this),
      eventContent: (arg) => {
        return {
          html: `${arg.event.title.replace(/\n/g, '<br>')}`,
        };
      },
    };

    this.refreshCalendar(); // Lade den Kalender nach der Initialisierung

    // Lade alle Termine und setze die Kalenderoptionen
    this.appointmentService.getAppointments().subscribe((appointments: Appointment[]) => {
      this.appointmentList = appointments;

      // Basierend auf der Rolle die Termine filtern
      if (this.isDealer) {
        this.filteredAppointments = this.appointmentList; // Dealer sieht alle Termine
      } else {
        this.filterAppointments(); // Kunde sieht nur seine eigenen Termine
      }

      // Kalender-Events basierend auf den gefilterten Terminen formatieren
      const events: EventInput[] = this.filteredAppointments.map((appointment) => {
        return {
          title: `${appointment.time} Uhr: ${appointment.vehicleOwner.firstname} ${appointment.vehicleOwner.lastname}<br> Auftragsart: ${appointment.assignment}`,
          start: appointment.date,
          extendedProps: {
            title: `${appointment.vehicleOwner.firstname} ${appointment.vehicleOwner.lastname}`,
            id: appointment.id, // ID des Termins
            time: appointment.time,
            vehicleOwner: appointment.vehicleOwner,
            assignment: appointment.assignment,
            branch: appointment.branch,
            status: appointment.status,
            vehicleRegNo: appointment.vehicleRegNo,
            date: appointment.date,
          },
        };
      });

      // Setze die Events im Kalender
      this.calendarOptions = {
        ...this.calendarOptions,
        events: events, // Dynamische Events vom Service
        eventClick: this.handleEventClick.bind(this),
      };
      this.cdr.detectChanges();
    });
  }

  // Filter für die Termine des angemeldeten Benutzers
  private filterAppointments(): void {
    const userEmail = this.authService.getMailFromJWT();
    this.filteredAppointments = this.appointmentList.filter((appointment) => {
      return appointment.vehicleOwner.email === userEmail;
    });
  }

  handleEventClick(arg: any): void {
    if (arg && arg.event) {
      console.log('Termin-Event angeklickt:', arg.event);

      if (arg.event.extendedProps) {
        console.log('Extended Props:', arg.event.extendedProps);
      } else {
        console.error('Extended Props fehlen!');
      }

      // Setze `selectedEvent` auf die Daten des angeklickten Termins
      this.selectedEvent = {
        id: arg.event.extendedProps?.id,
        assignment: arg.event.extendedProps?.assignment,
        branch: arg.event.extendedProps?.branch,
        title: arg.event.extendedProps?.title,
        status: arg.event.extendedProps?.status,
        date: arg.event.extendedProps?.date,
        time: arg.event.extendedProps?.time,
        vehicleOwner: arg.event.extendedProps?.vehicleOwner,
        vehicleRegNo: arg.event.extendedProps?.vehicleRegNo,
      };

      console.log('Selected Event gesetzt:', this.selectedEvent);

      // Öffne das Modal für die Details
      this.openModal('appointmentModal');
    }
  }

  // Behandlung des Klicks auf ein Datum
  handleDateClick(arg: any): void {
    if (this.isDealer) {
      console.log('Dealer können keine neuen Termine erstellen.');
      return;
    }

    console.log('Datum angeklickt:', arg.dateStr);
    this.selectedEvent = {
      id: null,
      date: arg.dateStr,
      time: '',
      vehicleOwner: '',
      vehicleRegNo: '',
      branch: '',
      status: '',
      assignment: '',
    };

    this.openModal('addAppointmentModal');
  }

  saveNewAppointment(): void {
    console.log('Neuer Termin speichern-Button geklickt');

    const mailOfUser = this.authService.getMailFromJWT();
    this.userService.getUsers().subscribe({
      next: (users) => {
        const currentUser = users.find((user) => user.email === mailOfUser);

        if (!currentUser) {
          console.error('Benutzer konnte nicht gefunden werden!');
          return;
        }

        if (this.selectedEvent) {
          const newAppointment: Appointment = {
            id: -1,
            date: this.selectedEvent.date,
            time: this.selectedEvent.time,
            vehicleOwner: {
              id: currentUser.id,
              firstname: currentUser.firstname,
              lastname: currentUser.lastname,
              email: currentUser.email,
              isDealer: currentUser.isDealer,
              password: '',
            } as User,
            vehicleRegNo: this.selectedEvent.vehicleRegNo,
            branch: this.selectedEvent.branch,
            status: this.selectedEvent.status,
            assignment: this.selectedEvent.assignment,
          };

          this.appointmentService.createAppointment(newAppointment).subscribe({
            next: () => {
              console.log('Neuer Termin wurde erfolgreich erstellt.');
              this.refreshCalendar();
              this.closeAllModals();
            },
            error: (error) => {
              console.error('Fehler beim Erstellen des neuen Termins:', error);
            },
          });
        } else {
          console.warn('Es wurden keine gültigen Daten für den neuen Termin eingegeben.');
        }
      },
      error: (error) => {
        console.error('Fehler beim Abrufen der Benutzer:', error);
      },
    });
  }

  editAppointment(): void {
    if (this.selectedEvent && this.selectedEvent.id) {
      console.log('Bearbeiten-Button geklickt:', this.selectedEvent);
      this.openModal('editAppointmentModal');
    } else {
      console.warn('Es wurde kein gültiger Termin zum Bearbeiten ausgewählt.');
    }
  }

  saveEditedAppointment(): void {
    if (this.selectedEvent && this.selectedEvent.id) {
      const updatedData = {
        id: this.selectedEvent.id,
        assignment: this.selectedEvent.assignment,
        branch: this.selectedEvent.branch,
        vehicleOwner: this.selectedEvent.vehicleOwner,
        vehicleRegNo: this.selectedEvent.vehicleRegNo,
        status: this.selectedEvent.status,
        date: this.selectedEvent.date,
        time: this.selectedEvent.time,
      };

      this.appointmentService.updateAppointment(updatedData.id, updatedData).subscribe({
        next: () => {
          console.log('Termin wurde erfolgreich aktualisiert.');
          this.refreshCalendar();
          this.closeAllModals();
          this.selectedEvent = {};
        },
        error: (error) => {
          console.error('Fehler beim Bearbeiten des Termins:', error);
        },
      });
    } else {
      console.warn('Kein Termin zum Bearbeiten ausgewählt oder ungültige ID.');
    }
  }

  cancelAppointment(): void {
    if (this.selectedEvent && this.selectedEvent.id) {
      this.appointmentService.deleteAppointment(this.selectedEvent.id).subscribe({
        next: () => {
          console.log('Termin wurde erfolgreich gelöscht.');
          this.refreshCalendar();
          this.closeAllModals();
          this.selectedEvent = {};
        },
        error: (error) => {
          console.error('Fehler beim Löschen des Termins:', error);
        },
      });
    }
  }

  openModal(modalId: string): void {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const existingModalInstance = bootstrap.Modal.getInstance(modalElement);
      if (existingModalInstance) {
        existingModalInstance.hide();
      }
      const modalInstance = new bootstrap.Modal(modalElement, {
        backdrop: 'static',
        focus: false,
      });
      modalInstance.show();

      modalElement.addEventListener('hidden.bs.modal', () => {
        this.isModalOpen = false;
      });

      this.isModalOpen = true;
    } else {
      console.error(`Modal mit ID ${modalId} wurde nicht gefunden.`);
    }
  }

  closeAllModals(): void {
    const modalElements = document.querySelectorAll('.modal.show');
    modalElements.forEach((modalElement) => {
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
    });
  }

  refreshCalendar(): void {
    this.appointmentService.getAppointments().subscribe((appointments: Appointment[]) => {
      // Basierend auf der Rolle filtern: Wenn Dealer, dann alle Termine, sonst nur eigene Termine
      let filteredAppointments: Appointment[] = [];

      if (this.isDealer) {
        // Händler sehen alle Termine
        filteredAppointments = appointments;
      } else {
        // Kunden sehen nur ihre eigenen Termine
        const userEmail = this.authService.getMailFromJWT();
        filteredAppointments = appointments.filter((appointment) => appointment.vehicleOwner.email === userEmail);
      }

      // Kalender-Events basierend auf den gefilterten Terminen formatieren
      const events: EventInput[] = filteredAppointments.map((appointment) => ({
        title: appointment.time
          ? `${appointment.time} Uhr: ${appointment.vehicleOwner.firstname} ${appointment.vehicleOwner.lastname}<br> Auftragsart: ${appointment.assignment}`
          : 'Keine Zeit angegeben',
        start: appointment.date,
        extendedProps: {
          id: appointment.id,
          time: appointment.time,
          vehicleOwner: appointment.vehicleOwner,
          assignment: appointment.assignment,
          branch: appointment.branch,
          status: appointment.status,
          date: appointment.date,
          vehicleRegNo: appointment.vehicleRegNo,
        },
      }));

      // Debug-Log der Events, bevor sie dem Kalender hinzugefügt werden
      console.log('Events vor dem Setzen im Kalender:', events);

      // Aktualisiere die Kalender-Events
      if (this.calendarOptions) {
        this.calendarOptions = {
          ...this.calendarOptions,
          events: events,  // Setze die neuen Events basierend auf der gefilterten Liste
          eventClick: this.handleEventClick.bind(this), // Binde den Event-Click-Handler neu
        };
        console.log('Kalenderoptionen nach Aktualisierung:', this.calendarOptions);
        this.cdr.detectChanges();
      }
    });
  }

}
