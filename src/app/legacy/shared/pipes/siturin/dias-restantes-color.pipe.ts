import {Pipe, PipeTransform} from '@angular/core';
import {formatDistanceStrict} from 'date-fns';
import {TramiteEstadosEnum, TramiteTiposEnum} from '@shared/enums/siturin/tramite.enum';
import {TramiteModel} from '@models/siturin';
import {InspeccionEstadoFechaEnum} from '@shared/enums';

@Pipe({ name: 'diasRestantesColor' })
export class DiasRestantesColorPipe implements PipeTransform {

  transform(value: TramiteModel, ...args: unknown[]): string {
    const fechaInspecion = value.inspeccionActual?.fechaSolicitud ? value.inspeccionActual?.fechaSolicitud : value.inspeccionActual?.fechaInspeccion;
    let diferenciaDias = this.obtenerDiferenciaFechas(value.fecha);

    if (value) {
      if (value.tipo?.codigo === TramiteTiposEnum.ACTUALIZACION) {
        if (diferenciaDias > 0 && diferenciaDias <= 30) {
          return 'warn';
        }

        if (diferenciaDias >= 31) {
          return 'danger';
        }
      }

      if (value.tipo?.codigo === 'registro' || value.tipo?.codigo === 'reingreso' || value.tipo?.codigo === 'nueva_clasificacion' || value.tipo?.codigo === 'nueva_actividad') {
        if (value.estado?.codigo === TramiteEstadosEnum.PENDIENTE_INSPECCION_1) {
          if (diferenciaDias >= 0 && diferenciaDias <= 84) {
            return 'success';
          }

          if (diferenciaDias >= 85 && diferenciaDias <= 114) {
            return 'warn';
          }

          if (diferenciaDias >= 115) {
            return 'danger';
          }
        }

        if (value.estado?.codigo === TramiteEstadosEnum.PENDIENTE_INSPECCION_2) {


          if (value.inspeccionActual?.estadoFecha?.codigo === InspeccionEstadoFechaEnum.AUTO_GENERADA) {
            diferenciaDias = this.obtenerDiferenciaFechas(value.inspeccionActual?.fechaCreacion);

            if (diferenciaDias >= 0 && diferenciaDias <= 42) {
              return 'success';
            }
          }

          if (value.inspeccionActual?.estadoFecha?.codigo !== InspeccionEstadoFechaEnum.AUTO_GENERADA) {
            if (value.inspecciones) {
              const inspeccion = value.inspecciones.find(item => item.observaciones?.some(i => i === 'Fecha auto generada por el sistema'))

              diferenciaDias = this.obtenerDiferenciaFechas(inspeccion?.fechaCreacion?.toString()!);
            }

            if (diferenciaDias >= 0 && diferenciaDias <= 42) {
              return 'success';
            }

            if (diferenciaDias >= 43 && diferenciaDias <= 72) {
              return 'warn';
            }

            if (diferenciaDias >= 72) {
              return 'danger';
            }
          }

          if (diferenciaDias < 0) {
            return 'success';
          }
          if (diferenciaDias >= 0) {
            return 'danger';
          }
        }
      }

      if (value.tipo?.codigo === 'registro' || value.tipo?.codigo === 'reclasificacion' || value.tipo?.codigo === 'recategorizacion') {
        if (diferenciaDias >= 0 && diferenciaDias <= 42) {
          return 'success';
        }

        if (diferenciaDias >= 43 && diferenciaDias <= 72) {
          return 'warn';
        }

        if (diferenciaDias >= 73) {
          return 'danger';
        }
      }
    }

    return '';
  }

  private obtenerDiferenciaFechas(fechaInspeccion: Date | string | undefined): any {
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

/*
&& (value.inspeccionActual?.estadoFecha?.codigo === InspeccionEstadoFechaEnum.AGENDADA
  || value.inspeccionActual?.estadoFecha?.codigo === InspeccionEstadoFechaEnum.CONFIRMADA
  || value.inspeccionActual?.estadoFecha?.codigo === InspeccionEstadoFechaEnum.RE_AGENDADA_1
  || value.inspeccionActual?.estadoFecha?.codigo === InspeccionEstadoFechaEnum.RE_AGENDADA_2
  || value.inspeccionActual?.estadoFecha?.codigo === InspeccionEstadoFechaEnum.SOLICITADA
)
 */
