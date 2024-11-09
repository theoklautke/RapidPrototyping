import { Component, OnInit } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventInput, CalendarOptions } from '@fullcalendar/core';
import { DateClickArg } from '@fullcalendar/interaction'; // Importiere DateClickArg

@Component({
  standalone: true,
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  imports: [FullCalendarModule],
})
export class CalendarComponent implements OnInit {
  calendarOptions: CalendarOptions = {};

  ngOnInit() {
    // FullCalendar-Optionen
    this.calendarOptions = {
      initialView: 'dayGridMonth', // Monatsansicht
      plugins: [dayGridPlugin, interactionPlugin],
      events: <EventInput[]>[
        { title: 'Meeting', start: '2024-11-15' },
        { title: 'Projekt Deadline', start: '2024-11-20' },
      ],
      dateClick: this.handleDateClick.bind(this), // Handler für Klicks auf Daten
    };
  }

  handleDateClick(arg: DateClickArg) { // Verwende DateClickArg anstelle von any
    alert('Datum geklickt: ' + arg.dateStr);
  }
}
