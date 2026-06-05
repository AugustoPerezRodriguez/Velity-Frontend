import { colors } from '../theme';

export const HEALTH_STATUS = {
  EN_TRATAMIENTO: 'En tratamiento',
  CON_SEGUIMIENTO: 'Con seguimiento médico',
  SIN_NOVEDADES: 'Sin novedades',
};

export function getHealthStatusColor(status) {
  switch (status) {
    case HEALTH_STATUS.EN_TRATAMIENTO:
      return colors.primary;
    case HEALTH_STATUS.CON_SEGUIMIENTO:
      return colors.warning;
    case HEALTH_STATUS.SIN_NOVEDADES:
      return colors.success;
    default:
      return colors.neutral500;
  }
}

export function getHealthStatusSoftColor(status) {
  switch (status) {
    case HEALTH_STATUS.EN_TRATAMIENTO:
      return colors.primarySoft;
    case HEALTH_STATUS.CON_SEGUIMIENTO:
      return colors.warningSoft;
    case HEALTH_STATUS.SIN_NOVEDADES:
      return colors.successSoft;
    default:
      return colors.neutral100;
  }
}

export function getCriticalColor(isCritical) {
  return isCritical ? colors.danger : colors.neutral500;
}

export function getCriticalSoftColor(isCritical) {
  return isCritical ? colors.dangerSoft : colors.neutral100;
}
