import { Component, OnInit } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventInput, CalendarOptions } from '@fullcalendar/core';
import { AppointmentService } from '../appointment.service';
import { Appointment } from 'interfaces';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import * as bootstrap from 'bootstrap';


declare const window: any;

@Component({
  standalone: true,
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  imports: [FullCalendarModule, FormsModule, CommonModule],
})
export class CalendarComponent implements OnInit {
  calendarOptions: CalendarOptions = {};
  selectedEvent: any = {};
  isModalOpen: boolean = false;



  constructor(private appointmentService: AppointmentService, private cdr: ChangeDetectorRef) {} // Injection des Services

  ngOnInit(): void {
    this.calendarOptions = {
      initialView: 'dayGridMonth',
      plugins: [dayGridPlugin, interactionPlugin],
      events: [],
      eventClick: this.handleEventClick.bind(this),
      dateClick: this.handleDateClick.bind(this),
      eventContent: (arg) => {
        return {
          html: `${arg.event.title.replace(/\n/g, '<br>')}`
        };
      },
    };

    this.refreshCalendar(); // Lade den Kalender nach der Initialisierung

    // Lade Termine dynamisch und setze die Kalenderoptionen
    this.appointmentService.getAppointments().subscribe((appointments: Appointment[]) => {
      // Termine für FullCalendar formatieren
      const events: EventInput[] = appointments.map((appointment) => {
        return {
          title: `${appointment.time} Uhr: ${appointment.vehicleOwner}<br> Auftragsart: ${appointment.assignment}`, // Attribut aus Appointment
          start: appointment.date, // Verwende das korrekte Attribut für das Startdatum
          extendedProps: {
            title: appointment.vehicleOwner,
            id: appointment.id, // ID des Termins
            time: appointment.time,
            vehicleOwner: appointment.vehicleOwner,
            assignment: appointment.assignment,
            branch: appointment.branch,
            status: appointment.status,
            vehicleRegNo: appointment.vehicleRegNo,
            date: appointment.date,
          }
        };
      });
      this.calendarOptions = {
        initialView: 'dayGridMonth', // Monatsansicht
        plugins: [dayGridPlugin, interactionPlugin],
        events: events, // Dynamische Events vom Service
        eventClick: this.handleEventClick.bind(this),
      }

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
    console.log('Datum angeklickt:', arg.dateStr);

    // Setze den `selectedEvent` auf die Werte des neuen Termins
    this.selectedEvent = {
      id: null,  // Für einen neuen Termin ist die ID null
      date: arg.dateStr,  // Das angeklickte Datum
      time: '',  // Der Benutzer muss die Uhrzeit eingeben
      vehicleOwner: '',
      vehicleRegNo: '',
      branch: '',
      status: '',
      assignment: ''
    };

    // Öffne das Modal zum Hinzufügen eines neuen Termins
    this.openModal('addAppointmentModal');
  }



  // Erstelle einen neuen Termin
  saveNewAppointment(): void {
    console.log('Neuer Termin speichern-Button geklickt');

    if (this.selectedEvent) {
      const newAppointment = {
        date: this.selectedEvent.date,
        time: this.selectedEvent.time,
        vehicleOwner: this.selectedEvent.vehicleOwner,
        vehicleRegNo: this.selectedEvent.vehicleRegNo,
        branch: this.selectedEvent.branch,
        status: this.selectedEvent.status,
        assignment: this.selectedEvent.assignment,
      };

      console.log('Daten für neuen Termin:', newAppointment);

      this.appointmentService.createAppointment(newAppointment).subscribe({
        next: () => {
          console.log('Neuer Termin wurde erfolgreich erstellt.');

          // Aktualisiere den Kalender, damit der neue Termin angezeigt wird
          this.refreshCalendar();

          // Schließe das Modal
          this.closeAllModals();
        },
        error: (error) => {
          console.error('Fehler beim Erstellen des neuen Termins:', error);
        }
      });
    } else {
      console.warn('Es wurden keine gültigen Daten für den neuen Termin eingegeben.');
    }
  }


  // Bearbeite den Termin
  editAppointment(): void {
    if (this.selectedEvent && this.selectedEvent.id) {
      console.log('Bearbeiten-Button geklickt:', this.selectedEvent);

      // Öffne das Editier-Modal, falls ein gültiger Termin ausgewählt wurde
      this.openModal('editAppointmentModal');
    } else {
      console.warn('Es wurde kein gültiger Termin zum Bearbeiten ausgewählt.');
    }
  }




  //Speichere den Termin
  saveEditedAppointment(): void {
    console.log('Speichern-Button geklickt');

    if (this.selectedEvent && this.selectedEvent.id) {
      const updatedData = {
        id: this.selectedEvent.id,
        assignment: this.selectedEvent.assignment,
        branch: this.selectedEvent.branch,
        vehicleOwner: this.selectedEvent.vehicleOwner,
        vehicleRegNo: this.selectedEvent.vehicleRegNo,
        status: this.selectedEvent.status,
        date: this.selectedEvent.date,
        time: this.selectedEvent.time
      };

      console.log('Daten für PUT-Request nach Anpassung:', updatedData);

      this.appointmentService.updateAppointment(updatedData.id, updatedData).subscribe({
        next: () => {
          console.log('Termin wurde erfolgreich aktualisiert.');
          this.refreshCalendar(); // Aktualisiere den Kalender
          this.closeAllModals(); // Schließe alle Modals
          this.selectedEvent = {}; // Setze den Zustand zurück
          console.log('Bearbeitungsvorgang abgeschlossen');
        },
        error: (error) => {
          console.error('Fehler beim Bearbeiten des Termins:', error);
        }
      });
    } else {
      console.warn('Kein Termin zum Bearbeiten ausgewählt oder ungültige ID.');
    }
  }


  // Lösche den Termin
  cancelAppointment(): void {
    console.log('Absagen-Button geklickt');
    if (this.selectedEvent && this.selectedEvent.id) {
      this.appointmentService.deleteAppointment(this.selectedEvent.id).subscribe({
        next: () => {
          console.log('Termin wurde erfolgreich gelöscht.');
          this.refreshCalendar(); // Aktualisiere den Kalender mit den neuesten Daten
          this.closeAllModals(); // Schließe alle offenen Modals
          this.selectedEvent = {}; // Setze den Zustand zurück
          console.log('Löschvorgang abgeschlossen');
        },
        error: (error) => {
          console.error('Fehler beim Löschen des Termins:', error);
        }
      });
    }
  }

  openModal(modalId: string): void {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      // Schließe das Modal zuerst, falls es bereits offen ist
      const existingModalInstance = bootstrap.Modal.getInstance(modalElement);
      if (existingModalInstance) {
        existingModalInstance.hide();
      }

      // Jetzt sicher öffnen
      const modalInstance = new bootstrap.Modal(modalElement, {
        backdrop: 'static',
        focus: false
      });
      modalInstance.show();

      // Modal-Event-Listener, um zu wissen, wann das Modal geschlossen wird
      modalElement.addEventListener('hidden.bs.modal', () => {
        this.isModalOpen = false; // Setze den Zustand auf "geschlossen", wenn das Modal geschlossen wird
      });

      this.isModalOpen = true; // Setze den Zustand auf "offen", nachdem das Modal geöffnet wurde
    } else {
      console.error(`Modal mit ID ${modalId} wurde nicht gefunden.`);
    }
  }




  // Schließe alle Modale
  closeAllModals(): void {
    const modalElements = document.querySelectorAll('.modal.show'); // Alle offenen Modals im DOM auswählen
    modalElements.forEach((modalElement) => {
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide(); // Existierende Modal-Instanz schließen
      }
    });
  }



  // Aktualisiere den Kalender
  refreshCalendar(): void {
    this.appointmentService.getAppointments().subscribe((appointments: Appointment[]) => {
      const events: EventInput[] = appointments
        .filter(appointment => appointment != null)
        .map((appointment) => ({
          title: appointment.time ? `${appointment.time} Uhr: ${appointment.vehicleOwner}<br> Auftragsart: ${appointment.assignment}` : "Keine Zeit angegeben",
          start: appointment.date,
          extendedProps: {
            id: appointment.id,
            time: appointment.time,
            vehicleOwner: appointment.vehicleOwner,
            assignment: appointment.assignment,
            branch: appointment.branch,
            status: appointment.status,
            date: appointment.date,
            vehicleRegNo: appointment.vehicleRegNo
          }
        }));

      // Debug-Log der Events, bevor sie dem Kalender hinzugefügt werden
      console.log('Events vor dem Setzen im Kalender:', events);

      // Aktualisiere die Kalender-Events
      if (this.calendarOptions) {
        this.calendarOptions = {
          ...this.calendarOptions,
          events: events,  // Setze die neuen Events
          eventClick: this.handleEventClick.bind(this), // Binde den Event-Click-Handler neu
        };
        console.log('Kalenderoptionen nach Aktualisierung:', this.calendarOptions);
        this.cdr.detectChanges();
      }
    });
  }



}
