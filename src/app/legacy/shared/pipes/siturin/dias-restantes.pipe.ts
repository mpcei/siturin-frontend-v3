import {Pipe, PipeTransform} from '@angular/core';
import {formatDistanceStrict} from 'date-fns';
import {TramiteModel} from "@models/siturin";
import {EstablecimientoEstadoEnum, InspeccionEstadoFechaEnum, TramiteEstadosEnum} from "@shared/enums";

@Pipe({ name: 'diasRestantes' })
export class DiasRestantesPipe implements PipeTransform {

  transform(value: TramiteModel, ...args: unknown[]): string {
    if (value) {
      let fechaInspeccion = new Date(value.fecha?.toString()!);

      // fechaInspeccion.setHours(11);
      // fechaInspeccion.setMinutes(59);

      let diferencia = formatDistanceStrict(fechaInspeccion, new Date(), {unit: 'day', addSuffix: true});

      if (value.estado?.codigo === TramiteEstadosEnum.PENDIENTE_INSPECCION_2) {

        let diferenciaSegunda = '';

        if (value.inspeccionActual?.estadoFecha?.codigo === InspeccionEstadoFechaEnum.AUTO_GENERADA) {
          fechaInspeccion = new Date(value.inspeccionActual?.fechaCreacion?.toString()!);
          let diferenciaSegunda = this.obtenerDiferenciaFechas(fechaInspeccion);
          // diferenciaSegunda = parseInt(diferenciaSegunda.toString());

          return diferenciaSegunda.toString();
        }

        if (value.inspeccionActual?.estadoFecha?.codigo !== InspeccionEstadoFechaEnum.AUTO_GENERADA) {
          if (value.inspecciones) {
            const inspeccion = value.inspecciones.find(item => item.observaciones?.some(i => i === 'Fecha auto generada por el sistema'))

            fechaInspeccion = new Date(inspeccion?.fechaCreacion?.toString()!);
          }

          let diferenciaSegunda = this.obtenerDiferenciaFechas(fechaInspeccion);
          // diferenciaSegunda = parseInt(diferenciaSegunda.toString());

          return diferenciaSegunda.toString();
        }

        return diferenciaSegunda;
      }

      if (diferencia.search('in') > -1) {
        return (-1 * parseInt(diferencia.split(' ')[1])).toString();
      } else {
        return (parseInt(diferencia.split(' ')[0])).toString();
      }
    }

    return '';
  }

  private obtenerDiferenciaFechas(fechaInspeccion: Date | string | undefined) {
    if (fechaInspeccion) {
      const diferencia = formatDistanceStrict(new Date(fechaInspeccion), new Date(), {unit: 'day', addSuffix: true});
      if (diferencia.search('in') > -1) {
        return -1 * parseInt(diferencia.split(' ')[1]);
      } else {
        return parseInt(diferencia.split(' ')[0]);
      }
    }

    return '';
  }

}
